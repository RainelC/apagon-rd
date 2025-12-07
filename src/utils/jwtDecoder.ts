// Base64 decode function compatible with React Native
const base64Decode = (str: string): string => {
  // Handle base64url encoding
  str = str.replace(/-/g, '+').replace(/_/g, '/')

  // Add padding if needed
  while (str.length % 4) {
    str += '='
  }

  // Use global atob if available (polyfilled in some React Native environments)
  // Otherwise, decode manually
  if (typeof atob !== 'undefined') {
    return atob(str)
  }

  // Manual base64 decode for React Native
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let output = ''

  str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '')

  for (let i = 0; i < str.length; i += 4) {
    const enc1 = chars.indexOf(str.charAt(i))
    const enc2 = chars.indexOf(str.charAt(i + 1))
    const enc3 = chars.indexOf(str.charAt(i + 2))
    const enc4 = chars.indexOf(str.charAt(i + 3))

    const chr1 = (enc1 << 2) | (enc2 >> 4)
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    const chr3 = ((enc3 & 3) << 6) | enc4

    output += String.fromCharCode(chr1)

    if (enc3 !== 64) output += String.fromCharCode(chr2)
    if (enc4 !== 64) output += String.fromCharCode(chr3)
  }

  return output
}

export const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const base64Url = parts[1]
    const base64Decoded = base64Decode(base64Url)

    // Decode URI component
    const jsonPayload = decodeURIComponent(
      base64Decoded
        .split('')
        .map(
          (c) =>
            '%' +
            ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

export const getUserIdFromToken = (
  token: string
): number | null => {
  const decoded = decodeJWT(token)
  if (!decoded) return null

  // Try common JWT claim names for user ID
  return (
    decoded.sub ||
    decoded.userId ||
    decoded.id ||
    decoded.user?.id ||
    null
  )
}
