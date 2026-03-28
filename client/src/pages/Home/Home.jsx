import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Home = () => {
  const [services, setServices] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [category])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/services', {
        params: category ? { category } : {}
      })
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Design', 'Development', 'Marketing', 'Writing', 'Video']

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>SkillBridge</h1>
        <p style={styles.subtitle}>Find the perfect freelancer for your project</p>

        <div style={styles.filters}>
          <button
            style={category === '' ? styles.filterActive : styles.filter}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              style={category === cat ? styles.filterActive : styles.filter}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.loading}>Loading services...</p>
        ) : services.length === 0 ? (
          <p style={styles.empty}>No services found.</p>
        ) : (
          <div style={styles.grid}>
            {services.map(service => (
              <div
                key={service.id}
                style={styles.card}
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <div style={styles.cardCategory}>{service.category}</div>
                <h3 style={styles.cardTitle}>{service.title}</h3>
                <p style={styles.cardDesc}>{service.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardPrice}>${service.price}</span>
                  <span style={styles.cardFreelancer}>
                    {service.freelancer.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={() => navigate('/login')}>
          Sign in
        </button>
        <button style={styles.navBtnPrimary} onClick={() => navigate('/register')}>
          Get started
        </button>
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
    padding: '3rem 2rem 2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#999',
    marginBottom: '24px'
  },
  filters: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  filter: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    color: '#999',
    cursor: 'pointer',
    fontSize: '13px'
  },
  filterActive: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid #fff',
    backgroundColor: '#fff',
    color: '#1a1a1a',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem'
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '3rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '3rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s'
  },
  cardCategory: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  cardDesc: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  cardFreelancer: {
    fontSize: '12px',
    color: '#999'
  },
  nav: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    gap: '8px'
  },
  navBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px'
  },
  navBtnPrimary: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  }
}

export default Home