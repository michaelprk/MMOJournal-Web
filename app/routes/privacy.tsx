import React from 'react';

export default function Privacy() {
  return (
    <div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 24px' }}>
          <h1 style={{ color: '#ffcb05', fontSize: '2rem', margin: '0 0 12px 0' }}>Privacy Policy (MMOJournal)</h1>
          <p style={{ color: '#ccc', margin: '0 0 20px 0' }}>Last updated: 2025</p>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Who We Are</h2>
            <p style={{ lineHeight: 1.7 }}>
              MMOJournal (“MMOJ”) provides tools to track shiny hunts, manage PvP builds, and related community content.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>What We Collect</h2>
            <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
              <li><strong>Account information:</strong> email address and authentication data (via Supabase Auth).</li>
              <li><strong>User content:</strong> PvP builds, shiny hunts, notes, and related data you create.</li>
              <li><strong>Technical data:</strong> basic logs required to operate and secure the service (e.g., error logs, IP for session security).</li>
            </ul>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Why We Collect It</h2>
            <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
              <li>To create and secure your account.</li>
              <li>To provide functionality (saving and displaying your hunts and builds).</li>
              <li>To maintain reliability and protect the platform.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Storage & Processing</h2>
            <p style={{ lineHeight: 1.7 }}>
              MMOJ uses Supabase for database and authentication (our data processor). Hosting and delivery is via Vercel. All account data and content are stored securely in Supabase. MMOJ does not use third-party analytics or advertising trackers.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Legal Basis</h2>
            <p style={{ lineHeight: 1.7 }}>
              Contract: processing is necessary to provide the service you requested (your account and saved content). Legitimate interests: to maintain security and platform reliability.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Retention</h2>
            <p style={{ lineHeight: 1.7 }}>
              Your account and content are stored as long as your MMOJ account is active. If you delete your account, your data is permanently removed from primary databases. Backups are kept only for disaster recovery and are purged on rotation.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Your Rights</h2>
            <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
              <li>Access & export: request a copy of your account data.</li>
              <li>Erase: delete your account to remove your data from active systems.</li>
              <li>Rectify: update your profile or saved content in-app.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Delete My Account</h2>
            <p style={{ lineHeight: 1.7 }}>
              Use the in-app Delete Account option (under Account Settings). This permanently removes your login identity and saved content from MMOJ, subject to backup retention periods.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Contact</h2>
            <p style={{ lineHeight: 1.7 }}>
              If you have any questions or queries, feel free to whisper or mail “PRK” in PokéMMO.
            </p>
          </section>
      </div>
    </div>
  );
}


