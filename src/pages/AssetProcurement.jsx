import React, { useState } from 'react';
import { products } from '../data/products';
import LiveStatus from '../components/LiveStatus';

const AssetProcurement = () => {
    const [filter, setFilter] = useState('ALL');
    const [manifest, setManifest] = useState([]);
    const [buildStatus, setBuildStatus] = useState('IDLE');
    const [bootLogs, setBootLogs] = useState([]);

    const categories = ['ALL', ...new Set(products.map(p => p.category))];
    const filteredProducts = filter === 'ALL' ? products : products.filter(p => p.category === filter);

    const totalWattage = manifest.reduce((sum, p) => sum + (p.wattage || 0), 0);
    const psu = manifest.find(p => p.category === 'POWER');
    const psuCapacity = psu ? psu.capacity : 0;
    const loadPercentage = psuCapacity > 0 ? (totalWattage / psuCapacity) * 100 : 0;
    const totalValue = manifest.reduce((sum, p) => sum + p.price, 0);

    const toggleProcure = (product) => {
        if (manifest.find(item => item.id === product.id)) {
            setManifest(manifest.filter(item => item.id !== product.id));
        } else {
            setManifest([...manifest, product]);
        }
    };

    const isSystemReady = manifest.some(p => p.category === 'CPU') &&
        manifest.some(p => p.category === 'GPU') &&
        manifest.some(p => p.category === 'POWER');

    const executeBuild = () => {
        setBootLogs([]);
        setBuildStatus('BOOTING');
        const logs = [
            "INITIALIZING HARDWARE_STRESS_TEST...",
            "VERIFYING VOLTAGE_STABILITY...",
            "CALIBRATING LIAN_LI_LCD_BUS...",
            "SYNCING ARGB_CONTROLLER...",
            "STRESS_TEST: PASSED",
            "SYSTEM_READY: DEPLOYING_OS..."
        ];

        logs.forEach((msg, i) => {
            setTimeout(() => {
                setBootLogs(prev => [...prev, `[ OK ] ${msg}`]);
                if (i === logs.length - 1) {
                    setTimeout(() => setBuildStatus('SUCCESS'), 1000);
                }
            }, i * 800);
        });
    };

    return (
        <div style={styles.pageContainer} className="page-container">
            <div style={styles.mainContent} >
                <div className="procurement-container">
                    <LiveStatus />
                    <div style={styles.header} className="header-container">
                        <div>
                            <h1 style={styles.glitch}>
                                {window.innerWidth < 768 ? '[ASSET_PROC]' : '[ASSET_PROCUREMENT_V3]'}
                            </h1>
                            <p style={styles.subText}>
                                {window.innerWidth < 768 ? 'JERIC_OS' : 'JERIC_OS // SPEC_VALIDATION_ACTIVE'}
                            </p>
                        </div>
                        <div style={styles.statsBar} className="stats-bar">
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>CATALOG_UNITS:</span>
                                <span style={styles.statValue}>{filteredProducts.length}</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>MANIFEST_VALUE:</span>
                                <span style={styles.statValue}>${totalValue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.filterBar} className="filter-bar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                ...styles.filterBtn,
                                color: filter === cat ? '#4ade80' : '#475569',
                                borderColor: filter === cat ? '#4ade80' : 'transparent'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={styles.grid} className="asset-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.statusGroup}><div style={styles.pulseDot}></div>
                                    <span style={styles.idText}>{product.id}</span>
                                </div>
                                <span style={styles.categoryLabel}>{product.category}</span>
                            </div>
                            <div style={styles.content}>
                                <p style={styles.brand}>{product.brand}</p>
                                <h3 style={styles.name}>{product.name}</h3>
                                <div style={styles.specBox}>
                                    {product.specs.map(spec => (
                                        <div key={spec} style={styles.specItem}>
                                            <span style={{ color: '#4ade80', marginRight: '8px' }}>{">"}</span>
                                            {spec}
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.footer}>
                                    <span style={styles.price}>${product.price}</span>
                                    <button
                                        onClick={() => toggleProcure(product)}
                                        style={{
                                            ...styles.btn,
                                            // Dynamic color inversion
                                            backgroundColor: manifest.find(m => m.id === product.id) ? '#4ade80' : '#0f172a',
                                            color: manifest.find(m => m.id === product.id) ? '#0b0e14' : '#4ade80',
                                            fontWeight: manifest.find(m => m.id === product.id) ? 'bold' : 'normal',
                                            transition: 'all 0.2s ease' // Smooth transition for the inversion
                                        }}
                                    >
                                        {manifest.find(m => m.id === product.id) ? 'COMMITTED' : 'PROCURE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.manifestPanel} class="manifest-panel">
                <h2 style={styles.manifestTitle}>[ SYSTEM_MANIFEST ]</h2>
                <div style={{ ...styles.statusIndicator, borderColor: isSystemReady ? '#4ade80' : '#f87171' }}>
                    <span style={{ color: isSystemReady ? '#4ade80' : '#f87171', fontSize: '0.7rem' }}>
                        STATUS: {isSystemReady ? 'READY_FOR_BOOT' : 'AWAITING_CRITICAL_HARDWARE'}
                    </span>
                </div>

                <div style={styles.manifestList}>
                    {manifest.map(item => (
                        <div key={item.id} style={styles.manifestItem}>
                            <span>{item.id}</span>
                            <button onClick={() => toggleProcure(item)} style={styles.removeBtn}>[X]</button>
                        </div>
                    ))}
                </div>

                <div style={styles.wattageSection}>
                    <div style={styles.footerRow}>
                        <span>POWER_LOAD:</span>
                        <span style={{ color: loadPercentage > 90 ? '#f87171' : '#4ade80' }}>
                            {totalWattage}W / {psuCapacity}W
                        </span>
                    </div>
                    <div style={styles.powerBarContainer}>
                        <div style={{ ...styles.powerBarFill, width: `${Math.min(loadPercentage, 100)}%`, backgroundColor: loadPercentage > 85 ? '#f87171' : '#4ade80' }} />
                    </div>
                </div>

                <button
                    disabled={!isSystemReady}
                    onClick={executeBuild}
                    style={{ ...styles.deployBtn, opacity: isSystemReady ? 1 : 0.5 }}>
                    EXECUTE_BUILD_SEQUENCE
                </button>

                {buildStatus !== 'IDLE' && (
                    <div style={styles.overlay}>
                        <div style={styles.deploymentWindow}>
                            {buildStatus === 'BOOTING' ? (
                                <div style={styles.terminalContainer}>
                                    <h2 className="glitch-animation" style={{
                                        ...styles.glitchText,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <span>[ EXECUTING ]</span>
                                        <span>[ BUILD_SEQUENCE ]</span>
                                    </h2>
                                    <div style={styles.logContainer}>
                                        {bootLogs.map((log, i) => (
                                            <p key={i} style={styles.logText}>{log}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="print-area" style={styles.successDashboard}>
                                    <div style={styles.successHeader}>
                                        <h1 style={{ color: '#4ade80', margin: 0 }}>SYSTEM_DEPLOYED</h1>
                                        <p style={{ color: '#64748b' }}>CONFIGURATION_ID: {Math.random().toString(36).toUpperCase().substring(7)}</p>
                                    </div>

                                    <div style={styles.dashboardBody}>
                                        <div style={styles.metricGroup}>
                                            <div style={styles.metricCard}>
                                                <label>TOTAL_INVESTMENT</label>
                                                <span>${totalValue.toFixed(2)}</span>
                                            </div>
                                            <div style={styles.metricCard}>
                                                <label>POWER_DRAW</label>
                                                <span>{totalWattage}W / {psuCapacity}W</span>
                                            </div>
                                        </div>

                                        <div style={styles.assetList}>
                                            <label style={styles.listLabel}>COMMITTED_ASSETS:</label>
                                            {manifest.map(item => (
                                                <div key={item.id} style={styles.assetRow}>
                                                    <span>{item.name}</span>
                                                    <span>{item.id}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="no-print" style={styles.dashboardFooter}>
                                        <button onClick={() => window.print()} style={styles.printBtn}>[ EXPORT_MANIFEST_PDF ]</button>
                                        <button onClick={() => setBuildStatus('IDLE')} style={styles.returnBtn}>RETURN_TO_TERMINAL</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageContainer: { display: 'flex', padding: '40px', backgroundColor: '#0b0e14', minHeight: '100vh', fontFamily: 'monospace', gap: '30px', color: '#fff' },
    mainContent: { flex: 1 },
    header: { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    glitch: { color: '#4ade80', fontSize: '1.6rem', margin: 0 },
    subText: { color: '#334155', fontSize: '0.7rem' },
    statsBar: { display: 'flex', gap: '20px', backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '10px 20px', border: '1px solid #1e293b' },
    statLabel: { fontSize: '0.6rem', color: '#64748b', display: 'block' },
    statValue: { fontSize: '1rem', color: '#fff' },
    filterBar: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' },
    filterBtn: { background: 'none', border: 'none', borderBottom: '2px solid', cursor: 'pointer', fontSize: '0.7rem', padding: '5px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: {
        backgroundColor: '#fff', border: '1px solid #4ade80', color: '#0b0e14',
        display: 'flex', flexDirection: 'column', height: '100%'
    },
    cardHeader: { padding: '10px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', borderBottom: '1px solid #e2e8f0' },
    statusGroup: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        gap: '10px' // Space between dot and ID
    },
    pulseDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#4ade80',
        borderRadius: '50%',
        animation: 'pulseDot 2s infinite ease-in-out',
        boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
        flexShrink: 0 // Prevents the dot from squishing
    },
    idText: {
        color: '#64748b',
        fontFamily: 'monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.5px'
    },
    categoryLabel: { backgroundColor: '#0f172a', color: '#fff', padding: '2px 6px' },
    content: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '15px' },
    brand: { fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' },
    name: { fontSize: '1.1rem', fontWeight: '900', margin: 0, flex: 1, display: 'flex', alignItems: 'flex-start' },
    specBox: { backgroundColor: '#f1f5f9', padding: '12px', borderLeft: '3px solid #4ade80', marginBottom: '15px', minHeight: '120px' },
    specItem: { fontSize: '0.75rem', color: '#475569', marginBottom: '4px' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px', marginTop: 'auto' },
    price: { fontSize: '1.2rem', fontWeight: 'bold' },
    btn: { backgroundColor: '#0f172a', color: '#4ade80', border: '1px solid #4ade80', padding: '8px 12px', fontSize: '0.65rem', cursor: 'pointer' },
    manifestPanel: { width: '300px', backgroundColor: '#0f172a', border: '1px solid #4ade80', padding: '20px', display: 'flex', flexDirection: 'column', position: 'sticky', top: '40px', height: 'calc(100vh - 80px)' },
    manifestTitle: { fontSize: '0.9rem', color: '#4ade80', marginBottom: '15px' },
    statusIndicator: { padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderLeft: '3px solid', marginBottom: '20px' },
    manifestList: { flex: 1, overflowY: 'auto' },
    manifestItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', padding: '8px 0', borderBottom: '1px solid #1e293b', color: '#4ade80' },
    removeBtn: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' },
    wattageSection: { borderTop: '1px solid #1e293b', paddingTop: '20px', marginBottom: '20px' },
    footerRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' },
    powerBarContainer: { height: '4px', backgroundColor: '#1e293b', marginTop: '10px' },
    powerBarFill: { height: '100%', transition: 'width 0.4s ease' },
    deployBtn: { width: '100%', padding: '12px', backgroundColor: '#4ade80', color: '#0b0e14', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 5, 5, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '40px' },
    deploymentWindow: { width: '100%', maxWidth: '800px', border: '1px solid #4ade80', backgroundColor: '#0b0e14', boxShadow: '0 0 50px rgba(74, 222, 128, 0.1)' },
    terminalContainer: { padding: '40px' },
    logContainer: { marginTop: '20px', minHeight: '200px' },
    logText: { color: '#4ade80', fontFamily: 'monospace', marginBottom: '8px', fontSize: '0.9rem' },
    successDashboard: { padding: '40px', color: '#fff', fontFamily: 'monospace' },
    metricGroup: { display: 'flex', gap: '20px', margin: '30px 0' },
    metricCard: { flex: 1, padding: '20px', border: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' },
    assetList: { borderTop: '1px solid #1e293b', paddingTop: '20px', marginBottom: '30px' },
    assetRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', padding: '8px 0', borderBottom: '1px solid #0f172a' },
    printBtn: { backgroundColor: '#4ade80', color: '#0b0e14', border: 'none', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', marginRight: '15px' },
    returnBtn: { backgroundColor: 'transparent', color: '#64748b', border: '1px solid #1e293b', padding: '12px 24px', cursor: 'pointer' },
    glitchText: { color: '#4ade80', fontSize: '1.4rem', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '4px' },
};

export default AssetProcurement;