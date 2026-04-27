import { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';
import { Navbar } from './components/Navbar';

function App() {
    const [cryptoData, setCryptoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add this state
    const stockSymbols = ['AAPL', 'NVDA', 'AMD', 'INTC', '005930.KS'];

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Crypto (Existing)
                const cryptoRes = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&order=market_cap_desc'
                );
                const cryptos = await cryptoRes.json();

                // 2. Fetch Stocks (using a public proxy for Yahoo Finance)
                // Note: In a real enterprise app, you'd use a backend to hide an API Key
                const stocks = await Promise.all(stockSymbols.map(async (symbol) => {
                    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`);
                    const json = await res.json();
                    const result = json.chart.result[0];
                    return {
                        id: symbol,
                        name: symbol === '005930.KS' ? 'SAMSUNG' : symbol,
                        current_price: result.meta.regularMarketPrice,
                        price_change_percentage_24h: ((result.meta.regularMarketPrice - result.meta.chartPreviousClose) / result.meta.chartPreviousClose) * 100
                    };
                }));

                setCryptoData([...cryptos, ...stocks]);
                setError(null);
            } catch (err) {
                setError("SYSTEM_OVERLOAD: Rate limit hit or network failure.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // use for testing
    // useEffect(() => {
    //     const mockData = [
    //         { id: 'aapl', name: 'Apple', current_price: 185.92, price_change_percentage_24h: 1.2 },
    //         { id: 'nvda', name: 'NVIDIA', current_price: 875.21, price_change_percentage_24h: 4.5 },
    //         { id: 'amd', name: 'AMD', current_price: 170.12, price_change_percentage_24h: -0.8 },
    //         { id: 'intc', name: 'Intel', current_price: 43.50, price_change_percentage_24h: -1.5 },
    //         { id: 'samsung', name: 'Samsung', current_price: 72400, price_change_percentage_24h: 0.5 },
    //     ];
    //     setCryptoData(mockData);
    //     setLoading(false);
    //     }, []);

    if (loading) return <div style={{ color: '#4ade80', padding: '40px' }}>INITIALIZING SYSTEM...</div>;

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>Market Intelligence Terminal</h1>
                <div style={styles.grid}>
                    {cryptoData?.map((coin) => (
                        <MetricCard
                            key={coin.id}
                            label={coin.name}
                            value={`$${coin.current_price.toLocaleString()}`}
                            trend={coin.price_change_percentage_24h > 0 ? 'up' : 'down'}
                            percentage={Math.abs(coin.price_change_percentage_24h).toFixed(2)}
                        />
                    ))}
                    {error && (
                        <div style={{ color: '#f87171', border: '1px solid #f87171', padding: '10px', marginBottom: '20px' }}>
                            CRITICAL FAILURE: {error}. API rate limit likely exceeded. Please wait 60 seconds.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: 'monospace'
    },
    title: {
        color: '#fff',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
        marginBottom: '30px',
        fontSize: '1.2rem',
        textTransform: 'uppercase'
    },
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
    }
};

export default App;