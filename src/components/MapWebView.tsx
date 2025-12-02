import { AuthContext } from '@context/AuthContext'
import { MaterialIcons } from '@expo/vector-icons'
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

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(
    null
  )

  // useEffect(() => {
  //   async function getCurrentLocation() {
  //     let { status } =
  //       await Location.requestForegroundPermissionsAsync()
  //     if (status !== 'granted') {
  //       setErrorMsg(
  //         'Permission to access location was denied'
  //       )
  //       return
  //     }

  //     let location = await Location.getCurrentPositionAsync(
  //       {}
  //     )
  //     setLocation(location)
  //   }

  //   getCurrentLocation()
  // }, [])

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
     let location = await Location.getCurrentPositionAsync(
        {}
      )
      setLocation(location)
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
      if (data.type === 'REPORT_CLICK') {
        router.navigate({
          pathname: '/(protected)/report',
          params: {
            lat: data.coords.lat.toString(),
            lng: data.coords.lng.toString()
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
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

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          if (location?.coords) {
            webviewRef.current?.postMessage(
              JSON.stringify({
                action: 'CENTER_MAP',
                lat: location.coords.latitude,
                lng: location.coords.longitude
              })
            )
          } else {
            Alert.alert('Ubicación no disponible')
          }
        }}
      >
        <MaterialIcons
          name='my-location'
          size={24}
          color='#333'
        />
      </TouchableOpacity>
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
  myLocationButton: {
    position: 'absolute',
    bottom: 65,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000
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
  accuracy: Double | undefined | null
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
      .leaflet-popup-content-wrapper,
      .leaflet-popup-tip {
        background-color: #007bff;
        color: white;
      }
      .leaflet-popup-close-button {
        color: #ffffff !important;
      } 
      .leaflet-control-attribution {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map("map", { zoomControl: false }).setView([${longitude}, ${latitude}], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
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
      
      map.on("click", function (e) {
        if (clickMarker) {
          map.removeLayer(clickMarker);
        }
          
        var popupContent = '<button onclick="reportLocation(' + e.latlng.lat + ',' + e.latlng.lng + ')" style="background-color: transparent; color: white; border: none; font-size: 14px; font-weight: bold; cursor: pointer;">Reportar avería</button>';

        clickMarker = L.marker(e.latlng)
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();
      });

      window.reportLocation = function(lat, lng) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "REPORT_CLICK",
            coords: { lat: lat, lng: lng }
          })
        );
      };
      
      // Handle messages from React Native
      function handleMessage(event) {
        try {
          var data = JSON.parse(event.data);
          if (data.action === "addMarker") {
            if (clickMarker) {
              map.removeLayer(clickMarker);
            }
            clickMarker = L.marker([data.lat, data.lon])
              .addTo(map)
              .bindPopup(data.text || "Marcador agregado")
              .openPopup();
          } else if (data.action === "CENTER_MAP") {
            map.flyTo([data.lat, data.lng], 15);
          }
        } catch (e) {
          console.error("Error handling message:", e);
        }
      }

      document.addEventListener("message", handleMessage);
      window.addEventListener("message", handleMessage);
          </script>
          </body>
          </html>
          `
