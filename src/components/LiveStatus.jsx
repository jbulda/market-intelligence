import React from 'react';
import { syncMetadata } from '../data/products';

const LiveStatus = () => {
    // If the metadata doesn't exist yet (first run), provide defaults
    const meta = syncMetadata || { lastSync: new Date().toISOString(), status: 'pending' };
    
    const lastUpdate = new Date(meta.lastSync);
    const hoursSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60);

    let statusColor = '#4ade80'; 
    let statusText = 'Market Live';

    if (meta.status === 'error' || hoursSinceUpdate > 48) {
        statusColor = '#ef4444'; 
        statusText = 'Sync Delayed';
    } else if (hoursSinceUpdate > 24) {
        statusColor = '#facc15'; 
        statusText = 'Market Cached';
    }

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px 20px', 
            backgroundColor: '#0b0e14', 
            borderBottom: '1px solid #1e293b',
            fontFamily: 'JetBrains Mono, monospace' // Giving it that "system" feel
        }}>
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(0.9); opacity: 1; }
                        70% { transform: scale(1.5); opacity: 0; }
                        100% { transform: scale(0.9); opacity: 0; }
                    }
                `}
            </style>
            
            <div style={{ position: 'relative', marginRight: '15px', display: 'flex', alignItems: 'center', width: '12px', height: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor, position: 'absolute', left: '2px' }} />
                <div style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', backgroundColor: statusColor, 
                    animation: 'pulse 2s infinite ease-out' 
                }} />
            </div>

            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {statusText} <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span> 
                <span style={{ color: '#f1f5f9' }}>
                    {lastUpdate.toLocaleDateString('en-CA')} {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </span>
        </div>
    );
};

export default LiveStatus;