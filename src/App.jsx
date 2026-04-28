import { Routes, Route, NavLink } from 'react-router-dom';
import TerminalWelcome from './pages/TerminalWelcome';
import MarketTerminal from './pages/MarketTerminal';
import AssetProcurement from './pages/AssetProcurement';

function App() {
    return (
        <div style={appStyles.main}>
            {/* Navigation Header */}
            <nav style={appStyles.nav}>
                <a
                    href="https://jbulda.github.io/"
                    style={appStyles.logoLink}
                    onClick={(e) => {
                        // Optional: This force-clears the hash just in case the browser tries to be too smart
                        window.location.href = "https://jbulda.github.io/";
                    }}
                >
                    JERIC_OS_V3
                </a>

                <div style={appStyles.links}>
                    {/* Points to the new TerminalWelcome landing page */}
                    <NavLink to="/" style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}>
                        [ BOOT_SEQ ]
                    </NavLink>

                    {/* Points to the actual Market Terminal component */}
                    <NavLink to="/market" style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}>
                        [ MARKET_TERM ]
                    </NavLink>

                    <NavLink to="/procurement" style={({ isActive }) => isActive ? appStyles.activeLink : appStyles.link}>
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
    main: { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace', color: '#fff' },
    nav: { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #222', alignItems: 'center' },
    logo: { color: '#4ade80', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
    links: { display: 'flex', gap: '20px' },
    link: { color: '#666', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' },
    activeLink: {
        color: '#4ade80',
        textDecoration: 'none',
        fontSize: '0.8rem',
        borderBottom: '1px solid #4ade80',
        paddingBottom: '5px'
    },
    logoLink: {
        color: '#4ade80', // Keep your signature green
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    // Optional: add a hover effect to show it's clickable
    logoLinkHover: {
        textShadow: '0 0 8px #4ade80',
        opacity: 0.8
    }
};

export default App;