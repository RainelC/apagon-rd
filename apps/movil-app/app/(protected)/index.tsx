import { View } from 'react-native'
import { MapWebView } from '@components/MapWebView'

export default function ProtectedIndex() {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <MapWebView />
    </View>
  )
}
