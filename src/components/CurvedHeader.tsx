import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

interface CurvedHeaderProps {
  title: string
  subtitle: string
}

export const CurvedHeader: React.FC<CurvedHeaderProps> = ({
  title,
  subtitle
}) => {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <View style={[styles.headerContent]}>
        <View style={styles.textContainer}>
          <Text
            style={styles.logo}
          >
            ApagónRD
          </Text>
          <Text
            style={styles.title}
          >
            {title}
          </Text>
          <Text
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Svg
        style={styles.svg}
        viewBox='0 0 60 256'
      >
        <Path
          d='M15.138 107.334c7.447 8.956 7.462 32.717.056 41.708C5.884 160.345.307 174.806.307 190.527c0 36.306 29.41 65.473 65.32 65.473 15.803 0 30.267-5.558 41.563-14.842 9.012-7.406 32.917-7.407 41.929 0C160.415 250.441 174.88 256 190.686 256c35.91 0 65.314-29.167 65.314-65.473 0-15.838-5.75-30.397-15.219-41.736-7.439-8.91-7.439-32.367-.01-41.286C250.244 96.129 256 81.488 256 65.473 256 29.48 226.597 0 190.686 0c-15.67 0-29.965 5.436-41.202 14.534-9.148 7.406-33.966 7.323-43.114-.083C95.192 5.403 80.937 0 65.314 0 29.404 0 0 29.48 0 65.473c0 15.934 5.698 30.51 15.138 41.861'
          fill={colors.primary}
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden'
  },
  headerContent: {
    paddingTop: 120,
    paddingBottom: 60,
    paddingHorizontal: 24
  },
  textContainer: {
    position: 'relative',
    bottom: 60,
    gap: 8
  },
  logo: {
    fontSize: 68,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.95,
    color: '#FFFFFF'
  },
  svg: {
    position: 'absolute',
    bottom: -60,
    left: -5,
    transform: [{ rotate: '-110deg' }, { scale: 1.4 }],
    zIndex: -1
  }
})
