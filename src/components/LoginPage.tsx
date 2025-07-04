

interface LoginPageProps {
  onPhoneSubmit: (phone: string, nickname: string) => void;
  onOtpSubmit: (otp: string) => void;
  onResendOtp: () => void;
  onStartAuth: () => void;
  step: 'welcome' | 'phone' | 'otp';
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  error: string;
  isSubmitting: boolean;
  onBack: () => void;
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '2rem'
  },
  form: {
    textAlign: 'left' as const
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const
  },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  phonePrefix: {
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  phoneInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  buttonSecondary: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '1rem'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'left' as const
  },
  featureIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '16px',
    color: 'white',
    flexShrink: 0
  },
  featureContent: {
    flex: 1
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  featureDesc: {
    fontSize: '14px',
    color: '#6b7280'
  }
};

export default function LoginPage({
  onPhoneSubmit,
  onOtpSubmit,
  onResendOtp,
  onStartAuth,
  step,
  phoneNumber,
  setPhoneNumber,
  nickname,
  setNickname,
  otp,
  setOtp,
  error,
  isSubmitting,
  onBack
}: LoginPageProps) {

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPhoneSubmit(phoneNumber, nickname);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOtpSubmit(otp);
  };

  const getProgress = () => {
    if (step === 'welcome') return 33;
    if (step === 'phone') return 66;
    return 100;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${getProgress()}%`
            }}
          />
        </div>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Welcome to TodoMaster</h1>
              <p style={styles.subtitle}>Your powerful task management companion</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>✓</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Smart Organization</div>
                  <div style={styles.featureDesc}>Organize tasks with priority levels and categories</div>
                </div>
              </div>
              
              <div style={styles.feature}>
                <div style={styles.featureIcon}>🛡</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Secure & Private</div>
                  <div style={styles.featureDesc}>Your data is encrypted and stored securely</div>
                </div>
              </div>
              
              <div style={styles.feature}>
                <div style={styles.featureIcon}>📱</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Quick Phone Login</div>
                  <div style={styles.featureDesc}>Sign in seamlessly with just your phone number</div>
                </div>
              </div>
            </div>
            
            <button 
              style={styles.button}
              onClick={onStartAuth}
            >
              Get Started →
            </button>
          </>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Enter Your Phone Number</h1>
              <p style={styles.subtitle}>We'll send you a verification code via SMS</p>
            </div>

            <form onSubmit={handlePhoneSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <div style={styles.phoneInputContainer}>
                  <div style={styles.phonePrefix}>+91</div>
                  <input
                    style={styles.phoneInput}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Nickname (Optional)</label>
                <input
                  style={styles.input}
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="How should we call you?"
                />
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  We'll use your phone number if not provided
                </p>
              </div>
              
              {error && (
                <div style={styles.error}>
                  ⚠️ {error}
                </div>
              )}
              
              <button
                type="submit"
                style={styles.button}
                disabled={isSubmitting || phoneNumber.length !== 10}
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
              
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={onBack}
              >
                ← Back
              </button>
            </form>
          </>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Enter Verification Code</h1>
              <p style={styles.subtitle}>
                We've sent a 6-digit code to +91{phoneNumber}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Verification Code</label>
                <input
                  style={styles.input}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              
              {error && (
                <div style={styles.error}>
                  ⚠️ {error}
                </div>
              )}
              
              <button
                type="submit"
                style={styles.button}
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
              </button>
              
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={onResendOtp}
                disabled={isSubmitting}
              >
                Resend OTP
              </button>
              
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={onBack}
              >
                ← Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 