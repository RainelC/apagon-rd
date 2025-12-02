import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'

interface ReportMapProps {
  latitude: string
  longitude: string
  touchControl: boolean
}

const ReportMap = ({
  latitude,
  longitude,
  touchControl
}: ReportMapProps) => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{
          html: mapHtml(latitude, longitude, touchControl)
        }}
        scrollEnabled={false}
        style={styles.webview}
      />
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
  webview: {
    flex: 1,
    opacity: 0.99
  }
})

const mapHtml = (
  latitude: string,
  longitude: string,
  touchControl: boolean
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
