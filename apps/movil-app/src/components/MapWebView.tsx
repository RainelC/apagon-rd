import { AuthContext } from '@context/AuthContext'
import { MapService } from '@services/mapService'
import { useRouter } from 'expo-router'
import {
  useRef,
  useEffect,
  useState,
  useContext
} from 'react'
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'
import { Sector } from '../types/Sectors'

const MapWebView = () => {
  const auth = useContext(AuthContext)
  const router = useRouter()
  const [sectors, setSectors] = useState<Sector[]>([])
  const webviewRef = useRef<WebView>(null)
  const [showReportButton, setShowReportButton] =
    useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS
            .ACCESS_FINE_LOCATION
        )
        if (
          granted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permiso de ubicación denegado')
        }
      }
    }
    requestPermission()
  }, [])

  useEffect(() => {
    const fetchSectorsWithPolygons = async () => {
      try {
        if (!auth || !auth.token) return

        const { token } = auth
        const sectors = await MapService.getSectorsGeoJson(
          token
        )
        setSectors(sectors)
      } catch (error) {
        console.log(error)
        Alert.alert(
          'Error',
          'No se pudieron cargar los sectores'
        )
      }
    }
    fetchSectorsWithPolygons()
  }, [auth])

  if (!auth || !auth.token)
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
      />
    )

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'MAP_CLICK') {
        setSelectedLocation(data.coords)
        setShowReportButton(true)
      }
    } catch (e) {
      console.error(e)
    }
  }
  const handleAddReport = () => {
    router.navigate({
      pathname: '/(protected)/report',
      params: {
        lat: selectedLocation?.lat.toString() || '',
        lng: selectedLocation?.lng.toString() || ''
      }
    })
  }
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml(sectors) }}
        onMessage={onMessage}
        geolocationEnabled={true}
      />

      {showReportButton && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAddReport}
        >
          <Text style={styles.buttonText}>
            Reportar ubicación
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export { MapWebView }

const mapHtml = (sectors: Sector[]) => `
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
      body,
      html,
      #map {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map("map").setView([18.63702, -69.79610], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      var userMarker;
      var clickMarker;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;

            map.setView([lat, lon], 15);

            userMarker = L.marker([lat, lon])
              .addTo(map)
              .bindPopup("Estás aquí")
              .openPopup();
          },
          function (error) {
            console.error("Error obteniendo ubicación:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }

      ${sectors
        .map((sector) => {
          return `L.polygon(${JSON.stringify(
            sector.geojson.coordinates
          )}, {color: '${
            sector.status === 'NO_POWER' ? 'red' : 'green'
          }'}).addTo(map).bindPopup('${
            sector.name
          } - Estado: ${
            sector.status === 'NO_POWER'
              ? 'Sin Energía'
              : 'Con Energía'
          }');`
        })
        .join('\n')}
      
      map.on("click", function (e) {
        if (clickMarker) {
          map.removeLayer(clickMarker);
          }
          
          clickMarker = L.marker(e.latlng)
          .addTo(map)
          .bindPopup(
            "Marcador en " +
            e.latlng.lat.toFixed(5) +
            ", " +
            e.latlng.lng.toFixed(5)
            )
            .openPopup();
            
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: "MAP_CLICK",
                coords: e.latlng,
                })
                );
      });
      
      document.addEventListener("message", function (event) {
        var data = JSON.parse(event.data);
        if (data.action === "addMarker") {
          if (clickMarker) {
            map.removeLayer(clickMarker);
          }
          
          clickMarker = L.marker([data.lat, data.lon])
          .addTo(map)
          .bindPopup(data.text || "Marcador agregado")
          .openPopup();
          }
          });
          </script>
          </body>
          </html>
          `
