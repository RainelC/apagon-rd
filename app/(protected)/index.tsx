import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { MapWebView } from '@components/MapWebView'
import { Ionicons,  } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS } from '@constants/colors'

export default function ProtectedIndex() {
  return (
    <View style={styles.container}>
      <MapWebView />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(protected)/chatbot')}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        <Text style={styles.fabText}>Ayuda</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  }
})
