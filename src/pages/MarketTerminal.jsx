import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';

// Add this to your MarketTerminal.jsx or a new LandingHome.jsx
const TerminalWelcome = () => {
    return (
        <div style={styles.landingContainer}>
            <div style={styles.heroSection}>
                <h2 style={styles.typewriter}>{"> INITIALIZING_JERIC_OS_V3..."}</h2>
                <p style={styles.subtext}>LOCATION: MONTREAL // STATUS: OPTIMAL</p>
            </div>

            <div style={styles.logBox}>
                <p style={styles.logEntry}>[ INFO ] LOADING_SAP_CORE_MODULES...</p>
                <p style={styles.logEntry}>[ INFO ] FETCHING_ASSET_PROCUREMENT_MANIFEST...</p>
                <p style={styles.logEntry}>[ INFO ] CONNECTING_TO_MARKET_TERMINAL_API...</p>
                <p style={styles.logEntry} style={{ color: '#4ade80' }}>[ SUCCESS ] SYSTEM_READY</p>
            </div>

            <div style={styles.ctaGrid}>
                <div style={styles.ctaCard}>
                    <h3>ASSET_PROCUREMENT</h3>
                    <p>Configure and validate hardware specs.</p>
                </div>
                <div style={styles.ctaCard}>
                    <h3>MARKET_TERMINAL</h3>
                    <p>Real-time data visualization.</p>
                </div>
            </div>
        </div>
    );
};

const MarketTerminal = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY.trim(),
                        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
                    }
                };
                const response = await fetch(
                    'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=AAPL,MSFT,NVDA,AMD,BTC-USD,ETH-USD',
                    options
                );
                const result = await response.json();
                setMarketData(result?.body || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={styles.loading}>SYNCING MARKET DATA...</div>;

    return (
        <div style={styles.contentWrapper}>
            <h1 style={styles.title}>MARKET INTELLIGENCE TERMINAL</h1>
            <div style={styles.grid}>
                {marketData.map((item) => (
                    <MetricCard
                        key={item.symbol}
                        label={item.displayName || item.symbol}
                        value={`$${item.regularMarketPrice?.toFixed(2)}`}
                        trend={item.regularMarketChangePercent > 0 ? 'up' : 'down'}
                        percentage={Math.abs(item.regularMarketChangePercent || 0).toFixed(2)}
                    />
                ))}
            </div>
        </div>
    );
};

// Re-use your existing styles here...
const styles = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100%', color: '#fff', fontFamily: 'monospace' },
    contentWrapper: { padding: '40px', maxWidth: '1400px', margin: '0 auto' },
    loading: { color: '#4ade80', padding: '40px', background: '#0a0a0a', height: '100vh', fontFamily: 'monospace' },
    errorTag: { color: '#ff4444', marginBottom: '20px', fontSize: '0.8rem', border: '1px solid #ff4444', padding: '5px', display: 'inline-block' },
    title: { borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '40px', fontSize: '1.4rem', letterSpacing: '2px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
};

export default MarketTerminal;