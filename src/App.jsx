import { Routes, Route, NavLink } from 'react-router-dom';
import TerminalWelcome from './pages/TerminalWelcome';
import MarketTerminal from './pages/MarketTerminal';
import AssetProcurement from './pages/AssetProcurement';

function App() {
    return (
        <div style={appStyles.main}>
            {/* Global Styles for Responsive Nav */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-container {
                        flex-direction: column !important;
                        padding: 15px 20px !important;
                        gap: 15px;
                        text-align: center;
                    }
                    .links-container {
                        gap: 10px !important;
                        width: 100%;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .nav-link-item {
                        font-size: 0.7rem !important;
                    }
                }
            `}</style>

            <nav style={appStyles.nav} className="nav-container">
                <a
                    href="https://jbulda.github.io/"
                    style={appStyles.logoLink}
                    onClick={(e) => {
                        window.location.href = "https://jbulda.github.io/";
                    }}
                >
                    JERIC_OS_V3
                </a>

                <div style={appStyles.links} className="links-container">
                    <NavLink 
                        to="/" 
                        className="nav-link-item"
                        style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}
                    >
                        [ BOOT_SEQ ]
                    </NavLink>

                    <NavLink 
                        to="/market" 
                        className="nav-link-item"
                        style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}
                    >
                        [ MARKET_TERM ]
                    </NavLink>

                    <NavLink 
                        to="/procurement" 
                        className="nav-link-item"
                        style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}
                    >
                        [ ASSET_PROC ]
                    </NavLink>
                </div>
            </nav>

            <Routes>
                <Route path="/">
                    <Route index element={<TerminalWelcome />} />
                    <Route path="procurement" element={<AssetProcurement />} />
                    <Route path="market" element={<MarketTerminal />} />
                </Route>
            </Routes>
        </div>
    );
}

const appStyles = {
    main: { 
        backgroundColor: '#0a0a0a', 
        minHeight: '100vh', 
        fontFamily: 'monospace', 
        color: '#fff',
        overflowX: 'hidden' // Prevents side-scrolling on mobile
    },
    nav: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '20px 40px', 
        borderBottom: '1px solid #222', 
        alignItems: 'center',
        backgroundColor: '#0a0a0a' 
    },
    links: { display: 'flex', gap: '20px' },
    link: { 
        color: '#666', 
        textDecoration: 'none', 
        fontSize: '0.8rem', 
        transition: 'color 0.2s',
        whiteSpace: 'nowrap' 
    },
    activeLink: {
        color: '#4ade80',
        textDecoration: 'none',
        fontSize: '0.8rem',
        borderBottom: '1px solid #4ade80',
        paddingBottom: '5px',
        whiteSpace: 'nowrap'
    },
    logoLink: {
        color: '#4ade80',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        cursor: 'pointer'
    }
};

export default App;