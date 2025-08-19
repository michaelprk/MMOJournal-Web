import React from 'react';

export default function Terms() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Spacer to keep content below navbar */}
      <div style={{ height: '300px', flex: '0 0 auto' }} />
      {/* Scroll pane */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 16px' }}>
          <h1 style={{ color: '#ffcb05', fontSize: '2rem', margin: '0 0 12px 0' }}>Terms of Service (MMOJournal)</h1>
          <p style={{ color: '#ccc', margin: '0 0 20px 0' }}>Last updated: 2025</p>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Acceptable Use</h2>
            <p style={{ lineHeight: 1.7 }}>
              Use MMOJournal (“MMOJ”) responsibly. Do not attempt to disrupt the service, abuse rate limits, or engage in unlawful activity. You are responsible for the content you create and store.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Availability & Disclaimers</h2>
            <p style={{ lineHeight: 1.7 }}>
              MMOJ is provided “as is.” We do not guarantee uninterrupted availability or that the service will meet every requirement. To the fullest extent permitted by law, we disclaim warranties and limit liability.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Suspension & Termination</h2>
            <p style={{ lineHeight: 1.7 }}>
              We may suspend or terminate access for violations of these terms, misuse of the service, or to protect MMOJ and its users.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Intellectual Property</h2>
            <p style={{ lineHeight: 1.7 }}>
              The MMOJournal name, logo, domain, and software are owned by us. All other content, assets, and trademarks remain the property of their respective owners. MMOJ makes no claim of ownership over third-party game assets. Disclaimer: MMOJournal is a fan-made resource and is not affiliated with, endorsed by, or connected to any game developers or publishers.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Governing Law</h2>
            <p style={{ lineHeight: 1.7 }}>
              These terms are governed by applicable local law. Any disputes will be subject to the exclusive jurisdiction of the courts in our principal place of operation.
            </p>
          </section>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#ffcb05', fontSize: '1.3rem', margin: '0 0 8px 0' }}>Changes</h2>
            <p style={{ lineHeight: 1.7 }}>
              We may update these terms from time to time. Material changes will be announced in-app. Continued use after changes means you accept the updated terms.
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
    </div>
  );
}


