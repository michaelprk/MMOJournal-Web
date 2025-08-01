export default function Home() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '220px', // Start below the navbar
        left: 0,
        right: 0,
        height: 'calc(100vh - 220px)', // Take remaining viewport height
        backgroundColor: 'transparent',
        overflowY: 'auto', // Allow scrolling within this container
        overflowX: 'hidden',
      }}
    >
      <main style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: "2rem", 
        minHeight: "100%" 
      }}>
        <h2>Welcome to MMOJournal-Web!</h2>
        <p>Please use the navigation bar to explore the app.</p>
      </main>
    </div>
  );
}
