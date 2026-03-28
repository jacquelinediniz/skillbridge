import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const ordersRes = await api.get('/orders')
      setOrders(ordersRes.data)

      if (user?.role === 'FREELANCER') {
        const servicesRes = await api.get('/services')
        const myServices = servicesRes.data.filter(
          s => s.freelancer.id === user.id
        )
        setServices(myServices)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const totalEarnings = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.service.price, 0)

  const activeOrders = orders.filter(
    o => o.status === 'PENDING' || o.status === 'IN_PROGRESS'
  ).length

  const completedOrders = orders.filter(
    o => o.status === 'COMPLETED'
  ).length

  if (loading) return <p style={styles.loading}>Loading...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {user?.name}</h1>
          <p style={styles.subtitle}>
            {user?.role === 'FREELANCER' ? 'Freelancer' : 'Client'} Dashboard
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.navBtn} onClick={() => navigate('/')}>
            Browse
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/orders')}>
            Orders
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.metrics}>
          {user?.role === 'FREELANCER' && (
            <div style={styles.metric}>
              <p style={styles.metricLabel}>Total earnings</p>
              <p style={styles.metricValue}>${totalEarnings}</p>
            </div>
          )}
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Active orders</p>
            <p style={styles.metricValue}>{activeOrders}</p>
          </div>
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Completed orders</p>
            <p style={styles.metricValue}>{completedOrders}</p>
          </div>
          {user?.role === 'FREELANCER' && (
            <div style={styles.metric}>
              <p style={styles.metricLabel}>My services</p>
              <p style={styles.metricValue}>{services.length}</p>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent orders</h2>
            <button
              style={styles.seeAll}
              onClick={() => navigate('/orders')}
            >
              See all
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={styles.empty}>
              <p>No orders yet.</p>
              {user?.role === 'CLIENT' && (
                <button
                  style={styles.button}
                  onClick={() => navigate('/')}
                >
                  Browse services
                </button>
              )}
            </div>
          ) : (
            <div style={styles.ordersList}>
              {orders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  style={styles.orderCard}
                  onClick={() => navigate(`/chat/${order.id}`)}
                >
                  <div>
                    <p style={styles.orderTitle}>{order.service.title}</p>
                    <p style={styles.orderInfo}>
                      {user?.role === 'CLIENT'
                        ? order.service.freelancer.name
                        : order.client.name
                      }
                    </p>
                  </div>
                  <div style={styles.orderRight}>
                    <p style={styles.orderPrice}>${order.service.price}</p>
                    <span style={{
                      ...styles.orderStatus,
                      backgroundColor:
                        order.status === 'COMPLETED' ? '#E8F5E9' :
                        order.status === 'IN_PROGRESS' ? '#E3F2FD' :
                        order.status === 'CANCELLED' ? '#FFEBEE' : '#FFF8E1',
                      color:
                        order.status === 'COMPLETED' ? '#4CAF50' :
                        order.status === 'IN_PROGRESS' ? '#2196F3' :
                        order.status === 'CANCELLED' ? '#F44336' : '#F59E0B'
                    }}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
    color: '#999'
  },
  headerActions: {
    display: 'flex',
    gap: '8px'
  },
  navBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#ff4444',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '2rem'
  },
  metric: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '8px'
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  seeAll: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#666',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
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
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  orderCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'background 0.15s'
  },
  orderTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '2px'
  },
  orderInfo: {
    fontSize: '12px',
    color: '#999'
  },
  orderRight: {
    textAlign: 'right'
  },
  orderPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  orderStatus: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  }
}

export default Dashboard