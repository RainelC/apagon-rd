import { useRef, useEffect, useState } from 'react'
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'

const MapWebView = () => {
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

  const html = `
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
      var map = L.map("map").setView([18.4861, -69.9312], 13);

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
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'MAP_CLICK') {
        console.log('Coordenadas:', data.coords)
        setSelectedLocation(data.coords)
        setShowReportButton(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddReport = () => {
    if (selectedLocation) {
      Alert.alert(
        'Agregar Reporte',
        `Lat: ${selectedLocation.lat.toFixed(
          5
        )}\nLng: ${selectedLocation.lng.toFixed(5)}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              console.log(
                'Reporte agregado en:',
                selectedLocation
              )
            }
          }
        ]
      )
    }
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={onMessage}
        geolocationEnabled={true}
      />

      {showReportButton && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAddReport}
        >
          <Text style={styles.buttonText}>
            Agregar reporte
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
