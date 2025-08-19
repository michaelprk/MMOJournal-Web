import React from 'react';

export default function Terms() {
  return (
    <div style={{ maxWidth: '900px', margin: '200px auto 80px', padding: '0 16px' }}>
      <h1 style={{ color: '#ffcb05', fontSize: '2rem', margin: '0 0 12px 0' }}>Terms of Service</h1>
      <p style={{ color: '#ccc', margin: '0 0 20px 0' }}>Last updated: {new Date().getFullYear()}</p>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Acceptable use</h2>
        <p style={{ lineHeight: 1.7 }}>
          Use MMOJournal (“MMOJ”) responsibly. Do not attempt to disrupt the service, abuse rate limits, or engage in unlawful activity. You are responsible for the content you store.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Availability & disclaimers</h2>
        <p style={{ lineHeight: 1.7 }}>
          MMOJ is provided “as is.” We do not guarantee uninterrupted availability or that the service will meet every requirement. To the fullest extent permitted by law, we disclaim warranties and limit liability.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Suspension & termination</h2>
        <p style={{ lineHeight: 1.7 }}>
          We may suspend or terminate access for violations of these terms, misuse, or to protect the service and its users.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Intellectual property</h2>
        <p style={{ lineHeight: 1.7 }}>
          MMOJ, its logo, software, and site content are owned by us or our licensors. Third‑party trademarks and assets remain the property of their respective owners.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Governing law</h2>
        <p style={{ lineHeight: 1.7 }}>
          These terms are governed by applicable local law. Any disputes will be subject to the exclusive jurisdiction of the courts in our principal place of operation.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Changes</h2>
        <p style={{ lineHeight: 1.7 }}>
          We may update these terms from time to time. Material changes will be announced in‑app. Continued use after changes means you accept the updated terms.
        </p>
      </section>
    </div>
  );
}


