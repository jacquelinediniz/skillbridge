import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const statusColors = {
  PENDING: { bg: '#FFF8E1', color: '#F59E0B' },
  IN_PROGRESS: { bg: '#E3F2FD', color: '#2196F3' },
  COMPLETED: { bg: '#E8F5E9', color: '#4CAF50' },
  CANCELLED: { bg: '#FFEBEE', color: '#F44336' }
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) return <p style={styles.loading}>Loading orders...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1 style={styles.title}>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>No orders yet.</p>
          {user?.role === 'CLIENT' && (
            <button style={styles.button} onClick={() => navigate('/')}>
              Browse services
            </button>
          )}
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.serviceName}>{order.service.title}</h3>
                  <p style={styles.serviceInfo}>
                    {user?.role === 'CLIENT'
                      ? `Freelancer: ${order.service.freelancer.name}`
                      : `Client: ${order.client.name}`
                    }
                  </p>
                </div>
                <span style={{
                  ...styles.status,
                  backgroundColor: statusColors[order.status].bg,
                  color: statusColors[order.status].color
                }}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.price}>
                  ${order.service.price}
                </span>
                <div style={styles.actions}>
                  {user?.role === 'FREELANCER' && order.status === 'PENDING' && (
                    <button
                      style={styles.actionBtn}
                      onClick={() => updateStatus(order.id, 'IN_PROGRESS')}
                    >
                      Accept
                    </button>
                  )}
                  {user?.role === 'FREELANCER' && order.status === 'IN_PROGRESS' && (
                    <button
                      style={styles.actionBtn}
                      onClick={() => updateStatus(order.id, 'COMPLETED')}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    style={styles.chatBtn}
                    onClick={() => navigate(`/chat/${order.id}`)}
                  >
                    Open chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem'
  },
  header: {
    marginBottom: '1.5rem'
  },
  back: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  },
  button: {
    marginTop: '1rem',
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '700px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  serviceName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  serviceInfo: {
    fontSize: '13px',
    color: '#999'
  },
  status: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    padding: '8px 16px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  chatBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  }
}

export default Orders