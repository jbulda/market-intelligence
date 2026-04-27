import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TerminalWelcome = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);

    const bootSequence = [
        "INITIATING JERIC_OS_V3.0.4...",
        "LOADING SAP_UI5_CORE_LIBRARIES...",
        "ESTABLISHING BTP_SECURE_TUNNEL...",
        "MOUNTING VOLUMES: [DOCUMENTS, PROJECTS, ASSETS]",
        "SYSTEM_CHECK: OPTIMAL",
        "WELCOME, SENIOR DEVELOPER."
    ];

    useEffect(() => {
        // Only run if we haven't started adding logs yet
        if (logs.length === 0) {
            bootSequence.forEach((text, i) => {
                setTimeout(() => {
                    // Functional update to ensure we always have the freshest state
                    setLogs(prev => {
                        // Final safety check: don't add if the message already exists
                        const timestampedMsg = `[ ${new Date().toLocaleTimeString()} ] ${text}`;
                        if (prev.some(log => log.includes(text))) return prev;
                        return [...prev, timestampedMsg];
                    });
                }, i * 600);
            });
        }
    }, []); // Empty dependency array

    return (
        <div style={styles.container}>
            <div style={styles.terminalWindow}>
                <div style={styles.header}>
                    <div style={styles.dots}>
                        <div style={{ ...styles.dot, backgroundColor: '#ff5f56' }}></div>
                        <div style={{ ...styles.dot, backgroundColor: '#ffbd2e' }}></div>
                        <div style={{ ...styles.dot, backgroundColor: '#27c93f' }}></div>
                    </div>
                    <span style={styles.title}>guest@jeric_os: ~</span>
                </div>

                <div style={styles.body}>
                    {logs.map((log, i) => (
                        <p key={i} style={styles.logText}>{log}</p>
                    ))}

                    {logs.length === bootSequence.length && (
                        <div style={styles.ctaSection}>
                            <p style={styles.prompt}>Select Module:</p>
                            <div style={styles.buttonGroup}>
                                <button onClick={() => navigate('/market')} style={styles.navBtn}>
                                    {"> VIEW_MARKET"}
                                </button>
                                <button onClick={() => navigate('/procurement')} style={styles.navBtn}>
                                    {"> ASSET_PROCUREMENT"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b0e14',
    },
    terminalWindow: {
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid #1e293b',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#1e293b',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    dots: { display: 'flex', gap: '6px' },
    dot: { width: '10px', height: '10px', borderRadius: '50%' },
    title: { color: '#94a3b8', fontSize: '0.7rem', fontFamily: 'monospace' },
    body: { padding: '20px', minHeight: '300px', fontFamily: 'monospace' },
    logText: { color: '#4ade80', fontSize: '0.85rem', margin: '5px 0', letterSpacing: '0.5px' },
    ctaSection: { marginTop: '30px', borderTop: '1px solid #1e293b', paddingTop: '20px' },
    prompt: { color: '#64748b', fontSize: '0.8rem', marginBottom: '15px' },
    buttonGroup: { display: 'flex', gap: '20px' },
    navBtn: {
        background: 'none',
        border: '1px solid #4ade80',
        color: '#4ade80',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(74, 222, 128, 0.1)'
        }
    }
};

export default TerminalWelcome;