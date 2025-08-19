import React from 'react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: '900px', margin: '200px auto 80px', padding: '0 16px' }}>
      <h1 style={{ color: '#ffcb05', fontSize: '2rem', margin: '0 0 12px 0' }}>Privacy Policy</h1>
      <p style={{ color: '#ccc', margin: '0 0 20px 0' }}>Last updated: {new Date().getFullYear()}</p>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Who we are</h2>
        <p style={{ lineHeight: 1.7 }}>
          MMOJournal ("MMOJ") provides tools to manage competitive builds, shiny hunts, and related content.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>What we collect</h2>
        <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
          <li>Email address and authentication data via Supabase Auth.</li>
          <li>User-generated content (e.g., PvP builds, shiny hunts, notes).</li>
          <li>Basic technical logs necessary to operate the service (e.g., error logs).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Why we collect it</h2>
        <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
          <li>To create and secure your account.</li>
          <li>To provide app functionality (saving builds and hunts to your account).</li>
          <li>To maintain and improve reliability and security.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Storage & processing</h2>
        <p style={{ lineHeight: 1.7 }}>
          We use Supabase as our database and authentication provider (data processor). The web app is hosted on Vercel. Your account and content are stored in Supabase. We do not use third‑party analytics or advertising trackers.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Legal basis</h2>
        <p style={{ lineHeight: 1.7 }}>
          We process your data to perform the service you request (contract) and to maintain platform security and reliability (legitimate interests).
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Retention</h2>
        <p style={{ lineHeight: 1.7 }}>
          We retain your account and content while your MMOJ account is active. If you delete your account, your data is permanently removed from our primary databases. Backups are retained for a limited period for disaster recovery and are purged on rotation.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Your rights</h2>
        <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
          <li>Access and export: you can request a copy of your account data.</li>
          <li>Erase: use the in‑app delete option to remove your account and content.</li>
          <li>Rectify: update your profile and saved content in the app.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Delete my account</h2>
        <p style={{ lineHeight: 1.7 }}>
          Go to Account settings and choose “Delete Account.” This permanently removes your content and login identity from our systems (subject to backup retention periods).
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Contact</h2>
        <p style={{ lineHeight: 1.7 }}>
          Email us at <a href="mailto:support@mmojournal.app" style={{ color: '#ffcb05' }}>support@mmojournal.app</a> for questions or data requests.
        </p>
      </section>
    </div>
  );
}


