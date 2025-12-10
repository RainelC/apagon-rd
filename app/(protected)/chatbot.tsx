import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { BotService } from '@services/botService'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Message } from '../../src/types/message'

export default function ReluxChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content:
        'Hola, solo saluda una vez y trata de dar las respuestas breves y concisas.'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const { isDarkMode } = useTheme()
  const { token } = useAuth()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  const INITIAL_MESSAGE: Message = {
    role: 'user',
    content:
      'Hola, solo saluda una vez y trata de dar las respuestas breves y concisas.'
  }

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!token) {
      setMessages([INITIAL_MESSAGE])
    }
  }, [token])

  const callBotAPI = async (userMessage: string) => {
    const response = await BotService.chat({
      reply: userMessage,
      messages: messages
    })
    setMessages(response.messages)
  }

  const handleSend = async () => {
    if (inputText.trim() === '') return

    const newUserMessage: Message = {
      content: inputText.trim(),
      role: 'user'
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputText('')
    setIsTyping(true)

    try {
      await callBotAPI(inputText)
    } catch {
      Alert.alert(
        'Error',
        'No se pudo enviar el mensaje. Verifica tu conexión.'
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: 'user',
        content:
          'Hola, solo saluda una vez y trata de dar las respuestas breves y concisas.'
      }
    ])
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? 0 : 20
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name='chatbubble-ellipses'
              size={28}
              color='#4F46E5'
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Apagón RD
            </Text>
            <Text style={styles.headerSubtitle}>
              Tu asistente virtual
            </Text>
          </View>
          <TouchableOpacity onPress={handleClearChat}>
            <Ionicons
              name='trash'
              size={24}
              color='#FFF'
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages Container */}
      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.messagesContainer,
          { backgroundColor: colors.background }
        ]}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message, i) =>
          i === 0 ? null : (
            <View
              key={message.role + i}
              style={[
                styles.messageWrapper,
                message.role === 'user'
                  ? styles.userMessageWrapper
                  : styles.botMessageWrapper
              ]}
            >
              <View
                style={[
                  styles.messageAvatar,
                  message.role === 'user'
                    ? styles.userAvatar
                    : styles.botAvatar
                ]}
              >
                <Ionicons
                  name={
                    message.role === 'user'
                      ? 'person'
                      : 'chatbubble-ellipses'
                  }
                  size={18}
                  color='#FFF'
                />
              </View>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? styles.userBubble
                    : [
                        styles.botBubble,
                        {
                          backgroundColor:
                            colors.cardBackground
                        }
                      ]
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user'
                      ? styles.userText
                      : { color: colors.textSecondary }
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          )
        )}

        {isTyping && (
          <View
            style={[
              styles.messageWrapper,
              styles.botMessageWrapper
            ]}
          >
            <View
              style={[
                styles.messageAvatar,
                styles.botAvatar
              ]}
            >
              <Ionicons
                name='chatbubble-ellipses'
                size={18}
                color='#FFF'
              />
            </View>
            <View
              style={[
                styles.messageBubble,
                styles.botBubble,
                styles.typingBubble
              ]}
            >
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text
              }
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Escribe tu mensaje...'
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={inputText.trim() === '' || isTyping}
            style={[
              styles.sendButton,
              (inputText.trim() === '' || isTyping) &&
                styles.sendButtonDisabled
            ]}
          >
            <LinearGradient
              colors={
                inputText.trim() === '' || isTyping
                  ? ['#9CA3AF', '#9CA3AF']
                  : ['#4F46E5', '#7C3AED']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              {isTyping ? (
                <ActivityIndicator
                  size='small'
                  color='#FFF'
                />
              ) : (
                <Ionicons
                  name='send'
                  size={20}
                  color='#FFF'
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  headerText: {
    flex: 1
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF'
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 16
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end'
  },
  userMessageWrapper: {
    flexDirection: 'row-reverse'
  },
  botMessageWrapper: {
    flexDirection: 'row'
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  userAvatar: {
    backgroundColor: '#4F46E5'
  },
  botAvatar: {
    backgroundColor: '#7C3AED'
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 4
  },
  botBubble: {
    borderTopLeftRadius: 4
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20
  },
  userText: {
    color: '#FFF'
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4
  },
  userTimestamp: {
    color: '#C7D2FE'
  },
  botTimestamp: {
    color: '#9CA3AF'
  },
  typingBubble: {
    paddingVertical: 12
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF'
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden'
  },
  sendButtonDisabled: {
    opacity: 0.5
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
