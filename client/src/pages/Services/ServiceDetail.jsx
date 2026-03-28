import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const ServiceDetail = () => {
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [message, setMessage] = useState('')

  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${id}`)
      setService(response.data)
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'CLIENT') {
      setMessage('Only clients can place orders')
      return
    }

    try {
      setOrdering(true)
      const response = await api.post('/orders', { serviceId: id })
      navigate(`/chat/${response.data.order.id}`)
    } catch (error) {
      setMessage('Error placing order. Try again.')
    } finally {
      setOrdering(false)
    }
  }

  if (loading) return <p style={styles.loading}>Loading...</p>
  if (!service) return <p style={styles.loading}>Service not found.</p>

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate('/')}>
        ← Back
      </button>

      <div style={styles.card}>
        <div style={styles.category}>{service.category}</div>
        <h1 style={styles.title}>{service.title}</h1>
        <p style={styles.desc}>{service.description}</p>

        <div style={styles.divider} />

        <div style={styles.freelancer}>
          <div style={styles.avatar}>
            {service.freelancer.name.charAt(0)}
          </div>
          <div>
            <p style={styles.freelancerName}>{service.freelancer.name}</p>
            <p style={styles.freelancerLabel}>Freelancer</p>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.footer}>
          <div>
            <p style={styles.priceLabel}>Price</p>
            <p style={styles.price}>${service.price}</p>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <button
            style={styles.button}
            onClick={handleOrder}
            disabled={ordering}
          >
            {ordering ? 'Placing order...' : 'Hire now'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem'
  },
  back: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    marginBottom: '1rem',
    padding: '0'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  category: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '12px'
  },
  desc: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6'
  },
  divider: {
    borderTop: '1px solid #f0f0f0',
    margin: '1.5rem 0'
  },
  freelancer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700'
  },
  freelancerName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  freelancerLabel: {
    fontSize: '12px',
    color: '#999'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px'
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  message: {
    fontSize: '13px',
    color: '#e53e3e'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  }
}

export default ServiceDetail