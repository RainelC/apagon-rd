import {
  ActionSheetIOS,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { WebView } from 'react-native-webview'

interface ReportMapProps {
  latitude: string
  longitude: string
  touchControl: boolean
  canOpenInMaps: boolean
  isDarkMode?: boolean
}

const ReportMap = ({
  latitude,
  longitude,
  touchControl,
  canOpenInMaps,
  isDarkMode = false
}: ReportMapProps) => {
  const openInMaps = () => {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Cancelar',
            'Apple Maps',
            'Google Maps',
            'Waze'
          ],
          cancelButtonIndex: 0,
          title: 'Abrir ubicación en:'
        },
        (buttonIndex) => {
          let url = ''
          switch (buttonIndex) {
            case 1: // Apple Maps
              url = `maps:0,0?q=${lat},${lng}`
              break
            case 2: // Google Maps
              url = `comgooglemaps://?q=${lat},${lng}`
              break
            case 3: // Waze
              url = `waze://?ll=${lat},${lng}&navigate=yes`
              break
            default:
              return
          }

          Linking.canOpenURL(url)
            .then((supported) => {
              if (supported) {
                return Linking.openURL(url)
              } else {
                // Fallback to web version
                const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                return Linking.openURL(webUrl)
              }
            })
            .catch((err) => {
              Alert.alert(
                'Error',
                'No se pudo abrir el mapa'
              )
            })
        }
      )
    } else {
      const url = `geo:0,0?q=${lat},${lng}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url)
          } else {
            return Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
            )
          }
        })
        .catch((err) => {
          Alert.alert(
            'Error',
            'No se pudo abrir Google Maps'
          )
        })
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={canOpenInMaps ? openInMaps : undefined}
        style={styles.touchable}
      >
        <WebView
          originWhitelist={['*']}
          source={{
            html: mapHtml(
              latitude,
              longitude,
              touchControl,
              isDarkMode
            )
          }}
          scrollEnabled={false}
          style={styles.webview}
          pointerEvents='none'
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginVertical: 15
  },
  touchable: {
    flex: 1
  },
  webview: {
    flex: 1,
    opacity: 0.99
  }
})

const mapHtml = (
  latitude: string,
  longitude: string,
  touchControl: boolean,
  isDarkMode: boolean
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
        ${
          isDarkMode
            ? 'filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);'
            : ''
        }
      }
      .leaflet-control-attribution {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map("map", {
        zoomControl: false,
        dragging: ${touchControl},
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: ${touchControl}
      }).setView([${latitude}, ${longitude}], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.marker([${latitude}, ${longitude}]).addTo(map);
    </script>
  </body>
</html>
`

export default ReportMap
