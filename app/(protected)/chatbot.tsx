import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BotService } from '@services/botService';

export default function ReluxChatbot() {
  const [messages, setMessages] = useState([
    {
      content: '¡Hola! Soy Apagón RD, tu asistente especializado en energía eléctrica y apagones en la República Dominicana. Mi misión es brindarte información actualizada sobre el sistema eléctrico del país: noticias recientes, reportes de apagones, averías, cortes programados, información de las EDES, tarifas y todo lo relacionado con el servicio de electricidad en el territorio dominicano.\n\n¿En qué aspecto del sistema eléctrico dominicano puedo ayudarte hoy?',
      role: 'bot',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callReluxAPI = async (userMessage: string) => {
    try {
        const response = await BotService.chat(userMessage);
        setMessages([...messages, response.messages]);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
      return data.response || data.message || data.text || 'Lo siento, no pude procesar tu solicitud.';
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      return 'Lo siento, estoy teniendo problemas de conexión. Por favor intenta de nuevo.';
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const newUserMessage = {
      content: inputText.trim(),
      role: 'user',
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const botReply = await callReluxAPI(currentInput);
      
      const newBotMessage = {
        content: botReply,
        role: 'bot',
      };
      
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el mensaje. Verifica tu conexión.');
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
            <Ionicons name="chatbubble-ellipses" size={28} color="#4F46E5" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Apagón RD</Text>
            <Text style={styles.headerSubtitle}>Tu asistente virtual</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Messages Container */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message) => (
          <View
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
            ]}
          >
            <View
              style={[
                styles.messageAvatar,
                message.role === 'user' ? styles.userAvatar : styles.botAvatar
              ]}
            >
              <Ionicons
                name={message.role === 'user' ? 'person' : 'chatbubble-ellipses'}
                size={18}
                color="#FFF"
              />
            </View>
            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.botBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userText : styles.botText
                ]}
              >
                {message.content}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
            <View style={[styles.messageAvatar, styles.botAvatar]}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#FFF" />
            </View>
            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={inputText.trim() === '' || isTyping}
            style={[
              styles.sendButton,
              (inputText.trim() === '' || isTyping) && styles.sendButtonDisabled
            ]}
          >
            <LinearGradient
              colors={inputText.trim() === '' || isTyping ? ['#9CA3AF', '#9CA3AF'] : ['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    flexDirection: 'row-reverse',
  },
  botMessageWrapper: {
    flexDirection: 'row',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: '#4F46E5',
  },
  botAvatar: {
    backgroundColor: '#7C3AED',
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
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFF',
  },
  botText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#C7D2FE',
  },
  botTimestamp: {
    color: '#9CA3AF',
  },
  typingBubble: {
    paddingVertical: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});