import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { MapService } from '@services/mapService'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
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
  const { token } = useAuth()
  const router = useRouter()
  const [sectors, setSectors] = useState<Sector[]>([])
  const webviewRef = useRef<WebView>(null)

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null)

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
        if (!token) return

        const sectors = await MapService.getSectorsGeoJson(
          token
        )
        setSectors(sectors)
      } catch {
        Alert.alert(
          'Error',
          'No se pudieron cargar los sectores'
        )
      }
    }
    fetchSectorsWithPolygons()
  }, [token])

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
      if (data.type === 'SECTOR_STATS_CLICK') {
        router.navigate({
          pathname: '/(protected)/sectorStats',
          params: {
            sectorId: data.sectorId.toString(),
            sectorName: data.sectorName
          }
        })
      }
    } catch {
      Alert.alert('Error', 'Ocurrió un error')
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
      .sector-popup {
        min-width: 100px;
        max-width: 200px;
      }
      .sector-popup-title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .sector-popup-button {
        background-color: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 24px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        margin: 6px 0;
        width: 100%;
        text-align: center;
      }
      .sector-popup-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
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
          return `(function() {
            var polygon = L.polygon(${JSON.stringify(
              sector.geojson.coordinates
            )}, {color: '${
            sector.status === 'NO_POWER' ? 'red' : 'green'
          }'}).addTo(map);
            
            polygon.on('click', function(e) {
              // Stop event propagation to prevent map click event
              L.DomEvent.stopPropagation(e);
              
              if (clickMarker) {
                map.removeLayer(clickMarker);
              }
              
              var clickLat = e.latlng.lat;
              var clickLng = e.latlng.lng;
              
              var popupContent = 
                '<div class="sector-popup">' +
                '<div class="sector-popup-title">${
                  sector.name
                }</div>' +
                '<button class="sector-popup-button" onclick="reportLocation(' + clickLat + ',' + clickLng + ')">Reportar avería</button>' +
                '<button class="sector-popup-button" onclick="showSectorStats(${
                  sector.id
                })">Estadísticas</button>' +
                '</div>';
              
              polygon.bindPopup(popupContent).openPopup(e.latlng);
            });
          })();`
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

      window.showSectorStats = function(sectorId, sectorName) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "SECTOR_STATS_CLICK",
            sectorId: sectorId,
            sectorName: sectorName
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
          Alert.alert('Error', 'Ocurrió un error')
        }
      }

      document.addEventListener("message", handleMessage);
      window.addEventListener("message", handleMessage);
          </script>
          </body>
          </html>
          `
