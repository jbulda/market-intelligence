import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ label, value, trend, percentage }) => {
  const isPositive = trend === 'up';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        {isPositive ? 
          <TrendingUp size={16} color="#4ade80" /> : 
          <TrendingDown size={16} color="#f87171" />
        }
      </div>
      
      <div style={styles.value}>{value}</div>
      
      <div style={{ ...styles.percentage, color: isPositive ? '#4ade80' : '#f87171' }}>
        {isPositive ? '+' : '-'}{percentage}% 
        <span style={styles.subtext}> vs last 24h</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    minWidth: '200px',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  label: {
    color: '#888',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  value: {
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '5px 0'
  },
  percentage: {
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  subtext: {
    color: '#555',
    fontSize: '0.75rem'
  }
};

export default MetricCard;