import { useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    padding: '2rem'
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem'
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '20px',
    color: '#6b7280',
    maxWidth: '800px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  cardDesc: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '1.5rem'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#00BE76',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px'
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px'
  },
  buttonOutline: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#00BE76',
    border: '2px solid #00BE76',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px'
  },
  buttonDanger: {
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '1rem',
    boxSizing: 'border-box' as const
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical' as const,
    marginBottom: '1rem',
    boxSizing: 'border-box' as const
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px',
    display: 'inline-block'
  },
  badgeDefault: {
    backgroundColor: '#e5e7eb',
    color: '#374151'
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  badgeDanger: {
    backgroundColor: '#fecaca',
    color: '#991b1b'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#374151',
    marginRight: '12px'
  },
  alert: {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  alertInfo: {
    backgroundColor: '#dbeafe',
    border: '1px solid #bfdbfe',
    color: '#1e40af'
  },
  alertSuccess: {
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    color: '#065f46'
  },
  alertWarning: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fde68a',
    color: '#92400e'
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#e5e7eb',
    outline: 'none',
    marginBottom: '1rem'
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BE76',
    borderRadius: '6px',
    transition: 'width 0.3s ease'
  },
  switch: {
    position: 'relative' as const,
    width: '44px',
    height: '24px',
    backgroundColor: '#e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  switchActive: {
    backgroundColor: '#00BE76'
  },
  switchHandle: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s ease'
  },
  switchHandleActive: {
    transform: 'translateX(20px)'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  }
};

export default function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [progress, setProgress] = useState(65);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>HTML Component Showcase</h1>
          <p style={styles.subtitle}>
            Clean and simple HTML components styled with vanilla CSS - no external dependencies required
          </p>
        </div>

        <div style={styles.grid}>
          {/* Buttons Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Buttons</h3>
            <p style={styles.cardDesc}>Various button styles and variants</p>
            <div>
              <button style={styles.button}>Primary</button>
              <button style={styles.buttonSecondary}>Secondary</button>
              <button style={styles.buttonOutline}>Outline</button>
              <button style={styles.buttonDanger}>Danger</button>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button style={{...styles.button, padding: '8px 16px', fontSize: '14px'}}>Small</button>
              <button style={styles.button}>Default</button>
              <button style={{...styles.button, padding: '16px 32px', fontSize: '18px'}}>Large</button>
            </div>
          </div>

          {/* Form Elements Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Form Elements</h3>
            <p style={styles.cardDesc}>Input fields and form controls</p>
            <input style={styles.input} placeholder="Enter your email" type="email" />
            <textarea style={styles.textarea} placeholder="Type your message here..."></textarea>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div 
                style={{
                  ...styles.switch,
                  ...(switchValue ? styles.switchActive : {})
                }}
                onClick={() => setSwitchValue(!switchValue)}
              >
                <div 
                  style={{
                    ...styles.switchHandle,
                    ...(switchValue ? styles.switchHandleActive : {})
                  }}
                />
              </div>
              <label style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500' }}>
                Enable notifications
              </label>
            </div>
          </div>

          {/* Badges and Avatars Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Badges & Avatars</h3>
            <p style={styles.cardDesc}>User elements and status indicators</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{...styles.badge, ...styles.badgeDefault}}>Default</span>
              <span style={{...styles.badge, ...styles.badgeSuccess}}>Success</span>
              <span style={{...styles.badge, ...styles.badgeWarning}}>Warning</span>
              <span style={{...styles.badge, ...styles.badgeDanger}}>Danger</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={styles.avatar}>JD</div>
              <div style={styles.avatar}>AB</div>
              <div style={styles.avatar}>CD</div>
            </div>
          </div>

          {/* Alerts Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Alerts</h3>
            <p style={styles.cardDesc}>Information and status messages</p>
            <div style={{...styles.alert, ...styles.alertInfo}}>
              <strong>Info:</strong> This is an informational message.
            </div>
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              <strong>Success:</strong> Your changes have been saved successfully.
            </div>
            <div style={{...styles.alert, ...styles.alertWarning}}>
              <strong>Warning:</strong> Please review your input before submitting.
            </div>
          </div>

          {/* Sliders and Progress Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Sliders & Progress</h3>
            <p style={styles.cardDesc}>Interactive controls and progress indicators</p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Volume: {sliderValue}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Progress: {progress}%
              </label>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${progress}%`}} />
              </div>
            </div>
            <button 
              style={styles.button}
              onClick={() => setProgress(Math.min(progress + 10, 100))}
            >
              Increase Progress
            </button>
          </div>

          {/* Modal Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Modal Dialog</h3>
            <p style={styles.cardDesc}>Overlay dialogs and modals</p>
            <button style={styles.button} onClick={() => setIsModalOpen(true)}>
              Open Modal
            </button>
            
            {isModalOpen && (
              <div style={styles.modal} onClick={() => setIsModalOpen(false)}>
                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '24px', fontWeight: 'bold' }}>
                    Modal Title
                  </h3>
                  <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                    This is a modal dialog. Click outside or the close button to dismiss it.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button 
                      style={styles.buttonOutline} 
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      style={styles.button} 
                      onClick={() => setIsModalOpen(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tables Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Data Table</h3>
            <p style={styles.cardDesc}>Tabular data display</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' as const, borderBottom: '2px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' as const, borderBottom: '2px solid #e5e7eb' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' as const, borderBottom: '2px solid #e5e7eb' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>John Doe</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{...styles.badge, ...styles.badgeSuccess}}>Active</span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>Admin</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>Jane Smith</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{...styles.badge, ...styles.badgeWarning}}>Pending</span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>User</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}>Bob Johnson</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{...styles.badge, ...styles.badgeDefault}}>Inactive</span>
                  </td>
                  <td style={{ padding: '12px' }}>User</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cards Layout */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Card Layout</h3>
            <p style={styles.cardDesc}>Nested card components</p>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '600' }}>
                Nested Card
              </h4>
              <p style={{ margin: '0', color: '#6b7280' }}>
                This is a card inside another card to demonstrate nested layouts.
              </p>
            </div>
            <button style={styles.buttonOutline}>Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
} 