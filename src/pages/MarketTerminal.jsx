import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';

const MarketTerminal = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeSymbols, setActiveSymbols] = useState(['AAPL', 'NVDA', 'BTCUSD']);

    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

    // --- Search Function ---
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 1) {
            try {
                const res = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`);
                const data = await res.json();
                setSearchResults(data.bestMatches || []);
            } catch (err) { console.error("SEARCH_ERROR", err); }
        } else { setSearchResults([]); }
    };

    const addTicker = (symbol) => {
        if (!activeSymbols.includes(symbol)) {
            setActiveSymbols([...activeSymbols, symbol]);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // --- Helper for Fallback ---
    const fetchMonthlyFallback = async (symbol) => {
        try {
            const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`);
            const data = await res.json();
            const timeSeries = data["Monthly Time Series"];
            if (!timeSeries) return null;

            const months = Object.keys(timeSeries);
            const latest = timeSeries[months[0]];
            const prev = timeSeries[months[1]];
            const currentPrice = parseFloat(latest["4. close"]);
            const prevPrice = parseFloat(prev["4. close"]);

            return {
                symbol: symbol,
                price: currentPrice,
                changePercent: ((currentPrice - prevPrice) / prevPrice) * 100,
                isHistorical: true 
            };
        } catch { return null; }
    };

    // --- Main Fetch ---
    useEffect(() => {
        if (!API_KEY) {
            console.error("CRITICAL_ERROR: API_KEY_MISSING. Check your .env file.");
            return;
        }
        // A simple delay helper
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const fetchQuotes = async () => {
    setLoading(true);
    const results = [];

    for (const symbol of activeSymbols) {
        try {
            const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
            const data = await res.json();
            
            if (data["Global Quote"]) {
                const quote = data["Global Quote"];
                results.push({
                    symbol: quote["01. symbol"],
                    price: parseFloat(quote["05. price"] || 0),
                    changePercent: parseFloat((quote["10. change percent"] || "0%").replace('%', '')),
                });
            }
            // Wait 1.5 seconds between each stock to stay under the 1-per-second limit
            await delay(1500); 
        } catch (err) {
            console.error(`UPLINK_ERR for ${symbol}`, err);
        }
    }
    setMarketData(results);
    setLoading(false);
};

        fetchQuotes();
    }, [activeSymbols]);

    return (
        <div style={styles.contentWrapper} className="page-container">
            {/* Header */}
            <div style={styles.header} className="header-container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h1 style={styles.glitch}>[MARKET_INTELLIGENCE_TERMINAL]</h1>
                    <p style={styles.subText}>JERIC_OS // LIVE_MARKET_FEED</p>
                </div>
            </div>

            {/* Search Interface */}
            <div style={styles.searchSection}>
                <div style={styles.inputWrapper}>
                    <span style={styles.prompt}>{"> SEARCH_TICKER:"}</span>
                    <input type="text" value={searchQuery} onChange={handleSearch} placeholder="ENTER_SYMBOL..." style={styles.searchInput} />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div style={styles.resultsDropdown}>
                        {searchResults.map((match) => (
                            <div key={match["1. symbol"]} onClick={() => addTicker(match["1. symbol"])} style={styles.resultItem}>
                                <span style={{ color: '#4ade80' }}>{match["1. symbol"]}</span>
                                <span style={{ color: '#64748b', marginLeft: '10px' }}>{match["2. name"]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Messages */}
            {loading && <p style={{ color: '#4ade80', fontFamily: 'monospace' }}>[ SYNCING_LIVE_DATA... ]</p>}
            
            {!loading && marketData.length === 0 && (
                <div style={{ border: '1px solid #ff4444', padding: '20px', color: '#ff4444' }}>
                    <p>[ ERROR: UPLINK_THROTTLED ]</p>
                </div>
            )}

            {/* Main Data Grid */}
            <div style={styles.grid}>
                {marketData.map((item) => (
                    item && (
                        <div key={item.symbol} style={{ position: 'relative' }}>
                            {item.isHistorical && (
                                <span style={styles.historicalTag}>[ MONTHLY_TREND ]</span>
                            )}
                            <MetricCard
                                label={item.symbol}
                                value={`$${item.price.toFixed(2)}`}
                                trend={item.changePercent >= 0 ? 'up' : 'down'}
                                percentage={Math.abs(item.changePercent).toFixed(2)}
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

const styles = {
    contentWrapper: { padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' },
    header: { borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' },
    glitch: { 
    color: '#4ade80', 
        fontSize: '1.8rem', 
        margin: 0, 
        letterSpacing: '2px',
        fontFamily: 'monospace'
    },
    subText: { 
        color: '#475569', // Muted slate grey
        fontSize: '0.75rem', 
        marginTop: '4px',
        letterSpacing: '1px',
        fontFamily: 'monospace'
    },
    searchSection: { position: 'relative', marginBottom: '30px' },
    inputWrapper: { display: 'flex', alignItems: 'center', background: '#0f172a', padding: '10px', border: '1px solid #1e293b' },
    prompt: { color: '#4ade80', marginRight: '10px', fontSize: '0.8rem' },
    searchInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontFamily: 'monospace' },
    resultsDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#0f172a', border: '1px solid #4ade80', zIndex: 10, maxHeight: '200px', overflowY: 'auto' },
    resultItem: { padding: '10px', borderBottom: '1px solid #1e293b', cursor: 'pointer', fontSize: '0.8rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    historicalTag: {
        position: 'absolute', top: '-10px', right: '10px', backgroundColor: '#0f172a', color: '#fbbf24', 
        fontSize: '0.6rem', padding: '2px 6px', border: '1px solid #fbbf24', zIndex: 2, fontFamily: 'monospace'
    }
};

export default MarketTerminal;