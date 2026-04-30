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
                                <div style={styles.statusGroup}>
                                    <div style={styles.pulseDot}></div>
                                    <span style={styles.idText}>{product.id}</span>
                                </div>
                                <span style={styles.categoryLabel}>{product.category}</span>
                            </div>
                            
                            <div style={styles.content}>
                                {/* HEADER: Fixed height for alignment */}
                                <div style={styles.contentHeader}>
                                    <p style={styles.brand}>{product.brand}</p>
                                    <h3 style={styles.productTitle}>{product.name}</h3>
                                </div>

                                {/* IMAGE: Fixed viewport */}
                                {product.image && (
                                    <div style={styles.imageWrapper}>
                                        <img
                                            src={product.image}
                                            alt={product.id}
                                            style={styles.productImg}
                                        />
                                    </div>
                                )}

                                {/* UPLINK */}
                                <div style={styles.actionArea}>
                                    <a
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.procureButton}
                                    >
                                        [ VIEW_UPLINK ]
                                    </a>
                                </div>

                                {/* SPECS: Fixed scrollable height */}
                                <div style={styles.specContainer}>
                                    {product.specs && product.specs.map((spec, index) => (
                                        <p key={index} style={styles.specItem}>
                                            <span style={{ color: '#4ade80' }}>&gt;</span> {spec}
                                        </p>
                                    ))}
                                </div>

                                {/* FOOTER: Price and Procure Button */}
                                <div style={styles.footer}>
                                    <span style={styles.price}>${product.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => toggleProcure(product)}
                                        style={{
                                            ...styles.btn,
                                            backgroundColor: manifest.find(m => m.id === product.id) ? '#4ade80' : '#0f172a',
                                            color: manifest.find(m => m.id === product.id) ? '#0b0e14' : '#4ade80',
                                            fontWeight: manifest.find(m => m.id === product.id) ? 'bold' : 'normal'
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

            {/* MANIFEST PANEL */}
            <div style={styles.manifestPanel}>
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
                
                {/* DEPLOYMENT OVERLAY */}
                {buildStatus !== 'IDLE' && (
                    <div style={styles.overlay}>
                        <div style={styles.deploymentWindow}>
                            {buildStatus === 'BOOTING' ? (
                                <div style={styles.terminalContainer}>
                                    <h2 style={styles.glitchText}>
                                        <div>[ EXECUTING ]</div>
                                        <div>[ BUILD_SEQUENCE ]</div>
                                    </h2>
                                    <div style={styles.logContainer}>
                                        {bootLogs.map((log, i) => (
                                            <p key={i} style={styles.logText}>{log}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={styles.successDashboard}>
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
                                    <div style={styles.dashboardFooter}>
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
    filterBtn: { background: 'none', border: 'none', borderBottom: '2px solid', cursor: 'pointer', fontSize: '0.7rem', padding: '5px', transition: 'all 0.2s' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    card: { 
        backgroundColor: '#fff', border: '1px solid #4ade80', color: '#0b0e14', 
        display: 'flex', flexDirection: 'column', height: '100%', minHeight: '720px' 
    },
    cardHeader: { padding: '10px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', borderBottom: '1px solid #e2e8f0' },
    statusGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    pulseDot: { width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' },
    idText: { color: '#64748b', fontFamily: 'monospace' },
    categoryLabel: { backgroundColor: '#0f172a', color: '#fff', padding: '2px 6px' },
    content: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
    contentHeader: { height: '70px', marginBottom: '15px' },
    brand: { fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' },
    productTitle: { fontSize: '1rem', fontWeight: '900', margin: 0, lineHeight: '1.2', color: '#0b0e14' },
    imageWrapper: { 
        height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', 
        border: '1px solid rgba(74, 222, 128, 0.2)', background: 'rgba(0,0,0,0.02)', padding: '10px', boxSizing: 'border-box' 
    },
    productImg: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' },
    actionArea: { padding: '15px 0', textAlign: 'center' },
    procureButton: { 
        display: 'block', color: '#4ade80', textDecoration: 'none', fontSize: '0.65rem', padding: '8px', 
        border: '1px solid #4ade80', backgroundColor: '#0f172a', transition: 'all 0.2s' 
    },
    specContainer: { height: '140px', overflowY: 'auto', backgroundColor: '#94a3b8', padding: '12px', borderRadius: '4px', marginBottom: '15px' },
    specItem: { fontSize: '0.65rem', color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'monospace', lineHeight: '1.4', whiteSpace: 'pre-wrap' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px', marginTop: 'auto' },
    price: { fontSize: '1.1rem', fontWeight: 'bold' },
    btn: { border: '1px solid #4ade80', padding: '8px 16px', fontSize: '0.65rem', cursor: 'pointer', transition: 'all 0.2s' },
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
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 5, 5, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    deploymentWindow: { width: '90%', maxWidth: '800px', border: '1px solid #4ade80', backgroundColor: '#0b0e14' },
    terminalContainer: { padding: '40px' },
    logContainer: { marginTop: '20px', minHeight: '200px' },
    logText: { color: '#4ade80', fontFamily: 'monospace', marginBottom: '8px', fontSize: '0.85rem' },
    glitchText: { color: '#4ade80', fontSize: '1.4rem', textAlign: 'center', letterSpacing: '4px' },
    successDashboard: { padding: '40px' },
    metricGroup: { display: 'flex', gap: '20px', margin: '30px 0' },
    metricCard: { flex: 1, padding: '20px', border: '1px solid #1e293b', backgroundColor: '#0f172a' },
    assetList: { borderTop: '1px solid #1e293b', paddingTop: '20px' },
    assetRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', padding: '8px 0' },
    dashboardFooter: { marginTop: '30px', display: 'flex' },
    printBtn: { backgroundColor: '#4ade80', color: '#0b0e14', border: 'none', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', marginRight: '15px' },
    returnBtn: { backgroundColor: 'transparent', color: '#64748b', border: '1px solid #1e293b', padding: '12px 24px', cursor: 'pointer' }
};

export default AssetProcurement;