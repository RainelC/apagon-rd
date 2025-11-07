import { View } from 'react-native'
import { MapWebView } from '@components/MapWebView'
// import { useContext } from 'react'
// import { AuthContext } from '../../src/context/AuthContext'
// import { router } from 'expo-router'

export default function ProtectedIndex() {
  // const { signOut } = useContext(AuthContext)!

  return (
    <View
      style={{
        flex: 1
        // justifyContent: 'center',
        // alignItems: 'center'
      }}
    >
      <MapWebView />
      {/* <Text style={{ fontSize: 24 }}>
        Bienvenido Usuario!
      </Text>
      */}
      {/* <Button title='Cerrar sesión' /> */}
    </View>
  )
}
