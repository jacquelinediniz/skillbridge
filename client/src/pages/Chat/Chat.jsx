import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const { orderId } = useParams()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    fetchMessages()

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket']
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to socket')
      newSocket.emit('joinRoom', orderId)
    })

    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [orderId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${orderId}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return
    const content = newMessage
    setNewMessage('')
    socketRef.current.emit('sendMessage', {
      orderId,
      senderId: user.id,
      content
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Order Chat</h2>
        <p style={styles.subtitle}>Order #{orderId.slice(0, 8)}</p>
      </div>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <p style={styles.empty}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              style={msg.senderId === user.id ? styles.myMessage : styles.otherMessage}
            >
              <p style={styles.senderName}>
                {msg.sender?.name} · {msg.sender?.role}
              </p>
              <p style={styles.messageContent}>{msg.content}</p>
              <p style={styles.messageTime}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: '1rem 1.5rem',
    color: '#fff'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0
  },
  subtitle: {
    fontSize: '12px',
    color: '#999',
    margin: '4px 0 0'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    marginTop: '2rem'
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '12px 12px 0 12px',
    maxWidth: '70%'
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    color: '#1a1a1a',
    padding: '10px 14px',
    borderRadius: '12px 12px 12px 0',
    maxWidth: '70%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  },
  senderName: {
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '4px',
    opacity: 0.7
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.4'
  },
  messageTime: {
    fontSize: '10px',
    opacity: 0.5,
    marginTop: '4px',
    textAlign: 'right'
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '1rem 1.5rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
}

export default Chat