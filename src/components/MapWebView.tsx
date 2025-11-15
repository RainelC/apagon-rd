import { AuthContext } from '@context/AuthContext'
import { MapService } from '@services/mapService'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'
import { Double } from 'react-native/Libraries/Types/CodegenTypes'
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

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(
    null
  )

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } =
        await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg(
          'Permission to access location was denied'
        )
        return
      }

      let location = await Location.getCurrentPositionAsync(
        {}
      )
      setLocation(location)
    }

    getCurrentLocation()
  }, [])

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
        source={{
          html: mapHtml(
            sectors,
            location?.coords.latitude,
            location?.coords.longitude,
            location?.coords.accuracy
          )
        }}
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

const mapHtml = (
  sectors: Sector[],
  longitude: Double | undefined,
  latitude: Double | undefined,
  accuracy:  Double | undefined | null
) => `
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
      var map = L.map("map").setView([${longitude}, ${latitude}], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      var clickMarker;

      L.circleMarker([${longitude}, ${latitude}], 
        {
          radius: 8,
          fillColor: "#4285F4",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }
      ).addTo(map)

      L.circle([${longitude}, ${latitude}], {
        radius: ${accuracy},
        color: "#4285F4",
        fillColor: "#4285F4",
        fillOpacity: 0.1,
        weight: 9
      }).addTo(map);

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
