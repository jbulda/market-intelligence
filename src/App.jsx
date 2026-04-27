import { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';
import { Navbar } from './components/Navbar';

const fallbackData = [
    { id: 'AAPL', name: 'Apple', price: 266.98, change: -1.50 },
    { id: 'MSFT', name: 'Microsoft', price: 420.22, change: 0.45 },
    { id: 'NVDA', name: 'Nvidia', price: 850.10, change: 2.30 },
    { id: 'BTC', name: 'Bitcoin', price: 64200, change: -0.80 }
];

function App() {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // One request, all data points. YH Finance uses "-USD" for crypto.
    const symbols = 'BTC-USD,ETH-USD,AAPL,NVDA,AMD,INTC';

    useEffect(() => {
        const fetchData = async () => {
            if (marketData.length > 0) return;

            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY.trim(),
                        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
                    }
                };

                // This endpoint supports multiple tickers again based on your result!
                const response = await fetch(
                    'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=AAPL,MSFT,NVDA,AMD,BTC-USD,ETH-USD',
                    options
                );

                const result = await response.json();

                // Extract the array from the 'body' property
                const rawData = result?.body || [];

                if (rawData.length === 0) throw new Error("Empty body received");

                const cleanData = rawData.map(item => ({
                    id: item.symbol,
                    // Prioritize Display Name (Apple), then Short Name (Apple Inc.), then Symbol (AAPL)
                    name: item.displayName || item.shortName || item.symbol,
                    price: item.regularMarketPrice,
                    change: item.regularMarketChangePercent
                }));

                setMarketData(cleanData);
                setError(null);
            } catch (err) {
                console.error("Dashboard Sync Error:", err.message);
                setError("SYSTEM_OFFLINE: Emergency Data Active");
                setMarketData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array = Runs once on load

    if (loading) return <div style={styles.loading}>ACCESSING ENCRYPTED TERMINAL...</div>;

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.contentWrapper}>
                <h1 style={styles.title}>MARKET INTELLIGENCE TERMINAL</h1>

                {error && <div style={styles.errorTag}>[!] {error}</div>}

                <div style={styles.grid}>
                    {marketData.map((item) => (
                        <MetricCard
                            key={item.id}
                            label={item.name}
                            value={`$${item.price.toFixed(2)}`} // Formatting here keeps the component clean
                            trend={item.change > 0 ? 'up' : 'down'}
                            percentage={Math.abs(item.change).toFixed(2)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100%', color: '#fff', fontFamily: 'monospace' },
    contentWrapper: { padding: '40px', maxWidth: '1400px', margin: '0 auto' },
    loading: { color: '#4ade80', padding: '40px', background: '#0a0a0a', height: '100vh', fontFamily: 'monospace' },
    errorTag: { color: '#ff4444', marginBottom: '20px', fontSize: '0.8rem', border: '1px solid #ff4444', padding: '5px', display: 'inline-block' },
    title: { borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '40px', fontSize: '1.4rem', letterSpacing: '2px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }
};

export default App;