import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import * as Sharing from 'expo-sharing'
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window')

export const ImageViewer = ({
  visible,
  onClose,
  imageUrl
}: {
  visible: boolean
  onClose: () => void
  imageUrl: string
}) => {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  const resetAnimation = () => {
    'worklet'
    scale.value = withSpring(1)
    savedScale.value = 1
    translateX.value = withSpring(0)
    translateY.value = withSpring(0)
    savedTranslateX.value = 0
    savedTranslateY.value = 0
  }

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetAnimation()
      } else if (scale.value > 3) {
        scale.value = withSpring(3)
        savedScale.value = 3
      } else {
        savedScale.value = scale.value
      }
    })

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value =
          savedTranslateX.value + e.translationX
        translateY.value =
          savedTranslateY.value + e.translationY
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetAnimation()
      } else {
        scale.value = withSpring(2)
        savedScale.value = 2
      }
    })

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    }
  })

  const handleClose = () => {
    resetAnimation()
    setTimeout(() => onClose(), 100)
  }

  const downloadImage = async () => {
    try {
      const { status } =
        await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Se necesita permiso para guardar imágenes'
        )
        return
      }

      const fileUri =
        FileSystem.documentDirectory +
        'report_image_' +
        Date.now() +
        '.jpg'

      const downloadResult = await FileSystem.downloadAsync(
        imageUrl,
        fileUri
      )

      if (downloadResult.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(
          downloadResult.uri
        )
        await MediaLibrary.createAlbumAsync(
          'ApagónRD',
          asset,
          false
        ).catch(() => {
          // Album might already exist
        })
        Alert.alert(
          'Éxito',
          'Imagen guardada en la galería'
        )
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.status}`
        )
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        `No se pudo descargar la imagen: ${
          error.message || 'Error desconocido'
        }`
      )
    }
  }

  const shareImage = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert(
          'Error',
          'Compartir no está disponible en este dispositivo'
        )
        return
      }

      const fileUri =
        FileSystem.cacheDirectory +
        'share_image_' +
        Date.now() +
        '.jpg'

      const downloadResult = await FileSystem.downloadAsync(
        imageUrl,
        fileUri
      )

      if (downloadResult.status === 200) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Compartir imagen del reporte'
        })
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.status}`
        )
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        `No se pudo compartir la imagen: ${
          error.message || 'Error desconocido'
        }`
      )
    }
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleClose}
      animationType='fade'
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={handleClose}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={downloadImage}
            >
              <Ionicons
                name='download-outline'
                size={24}
                color='#fff'
              />
              <Text style={styles.actionButtonText}>
                Descargar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={shareImage}
            >
              <Ionicons
                name='share-outline'
                size={24}
                color='#fff'
              />
              <Text style={styles.actionButtonText}>
                Compartir
              </Text>
            </TouchableOpacity>
          </View>

          {imageUrl && (
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={styles.imageContainer}>
                <Animated.Image
                  source={{ uri: imageUrl }}
                  style={[styles.modalImage, animatedStyle]}
                  resizeMode='contain'
                />
              </Animated.View>
            </GestureDetector>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600'
  },
  actionButtons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 16,
    zIndex: 1
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  }
})
