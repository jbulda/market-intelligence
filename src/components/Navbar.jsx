// src/components/Navbar.jsx
export const Navbar = () => {
  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.logo}>J. BULDA // SYSTEM_OPS</div>
      <div style={navStyles.links}>
        <a href="https://jbulda.github.io/" style={navStyles.link}>← Exit to Main Terminal</a>
      </div>
    </nav>
  );
};

const navStyles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 40px',
    backgroundColor: '#000',
    borderBottom: '1px solid #333',
    fontFamily: 'monospace'
  },
  logo: { color: '#4ade80', fontWeight: 'bold' },
  link: { color: '#888', textDecoration: 'none', fontSize: '0.9rem' }
};