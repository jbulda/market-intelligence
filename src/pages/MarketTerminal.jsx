import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';

const MarketTerminal = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Default symbols to load initially
    const [activeSymbols, setActiveSymbols] = useState(['AAPL', 'NVDA', 'BTCUSD']);

    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

    // --- Search Function ---
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 1) {
            try {
                const res = await fetch(
                    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
                );
                const data = await res.json();
                setSearchResults(data.bestMatches || []);
            } catch (err) {
                console.error("SEARCH_ERROR", err);
            }
        } else {
            setSearchResults([]);
        }
    };

    // --- Add Ticker to Terminal ---
    const addTicker = (symbol) => {
        if (!activeSymbols.includes(symbol)) {
            setActiveSymbols([...activeSymbols, symbol]);
            // Clear search
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // --- Fetch Quote Logic ---
    useEffect(() => {
        const fetchQuotes = async () => {
            const CACHE_KEY = 'jeric_os_market_data';
            const TIMESTAMP_KEY = 'jeric_os_market_last_fetch';
            const ONE_HOUR = 60 * 60 * 1000; // 3,600,000 ms

            const now = Date.now();
            const cachedData = localStorage.getItem(CACHE_KEY);
            const lastFetch = localStorage.getItem(TIMESTAMP_KEY);

            // 1. Check if we have a valid cache from the last hour
            if (cachedData && lastFetch && (now - parseInt(lastFetch) < ONE_HOUR)) {
                console.log("[ CACHE_HIT ] LOADING_LOCAL_DATA...");
                setMarketData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }
            setLoading(true);
            console.log("[ CACHE_MISS ] ESTABLISHING_UPLINK...");

            try {
                const results = await Promise.all(
                    activeSymbols.map(async (symbol) => {
                        const res = await fetch(
                            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
                        );
                        const data = await res.json();

                        if (data["Note"]) throw new Error("RATE_LIMIT");

                        const quote = data["Global Quote"];
                        if (!quote) return null;

                        return {
                            symbol: quote["01. symbol"],
                            price: parseFloat(quote["05. price"] || 0),
                            changePercent: parseFloat((quote["10. change percent"] || "0%").replace('%', '')),
                        };
                    })
                );

                const filtered = results.filter(item => item !== null);

                if (filtered.length > 0) {
                    setMarketData(filtered);
                    // Save to local storage
                    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
                    localStorage.setItem(TIMESTAMP_KEY, now.toString());
                }
            } catch (err) {
                console.error("UPLINK_FAILURE", err);
                // Fallback to expired cache if available during error
                if (cachedData) setMarketData(JSON.parse(cachedData));
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [activeSymbols]); // Only re-runs if you search/add a new symbol

    return (
        <div style={styles.contentWrapper} className="page-container">
            <div style={styles.header} className="header-container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h1 style={styles.glitch}>
                        [MARKET_INTELLIGENCE_TERMINAL]
                    </h1>
                    <p style={styles.subText}>
                        JERIC_OS // LIVE_MARKET_FEED
                    </p>
                </div>

                {/* If you have a stats-bar or LiveStatus, it would go here, 
        pushed to the right by the header-container's flex settings */}
            </div>

            {/* --- Search Interface --- */}
            <div style={styles.searchSection}>
                <div style={styles.inputWrapper}>
                    <span style={styles.prompt}>{"> SEARCH_TICKER:"}</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="ENTER_SYMBOL..."
                        style={styles.searchInput}
                    />
                </div>

                {searchResults.length > 0 && (
                    <div style={styles.resultsDropdown}>
                        {searchResults.map((match) => (
                            <div
                                key={match["1. symbol"]}
                                onClick={() => addTicker(match["1. symbol"])}
                                style={styles.resultItem}
                            >
                                <span style={{ color: '#4ade80' }}>{match["1. symbol"]}</span>
                                <span style={{ color: '#64748b', marginLeft: '10px' }}>{match["2. name"]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add this inside your return, above the grid */}
            {loading && <p style={{ color: '#4ade80', fontFamily: 'monospace' }}>[ SYNCING_LIVE_DATA... ]</p>}

            {!loading && marketData.length === 0 && (
                <div style={{ border: '1px solid #ff4444', padding: '20px', color: '#ff4444' }}>
                    <p>[ ERROR: UPLINK_THROTTLED ]</p>
                    <p style={{ fontSize: '0.7rem' }}>API rate limit reached. Wait 60 seconds or use a different key.</p>
                </div>
            )}
            <div style={styles.grid}>
                {marketData.map((item) => (
                    item && <MetricCard key={item.symbol} label={item.symbol} value={`$${item.price.toFixed(2)}`} trend={item.changePercent >= 0 ? 'up' : 'down'} percentage={Math.abs(item.changePercent).toFixed(2)} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    contentWrapper: { padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' },
    searchSection: { position: 'relative', marginBottom: '30px' },
    inputWrapper: { display: 'flex', alignItems: 'center', background: '#0f172a', padding: '10px', border: '1px solid #1e293b' },
    prompt: { color: '#4ade80', marginRight: '10px', fontSize: '0.8rem' },
    searchInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontFamily: 'monospace' },
    resultsDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#0f172a', border: '1px solid #4ade80', zIndex: 10, maxHeight: '200px', overflowY: 'auto' },
    resultItem: { padding: '10px', borderBottom: '1px solid #1e293b', cursor: 'pointer', fontSize: '0.8rem', '&:hover': { background: '#1e293b' } },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    title: { fontSize: '1.5rem', margin: '10px 0' },
    glitch: { color: '#4ade80', fontSize: '1.6rem', margin: 0 },
    subText: { color: '#334155', fontSize: '0.7rem' },

};

export default MarketTerminal;