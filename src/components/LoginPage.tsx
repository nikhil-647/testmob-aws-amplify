import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onPhoneSubmit: (phone: string, nickname: string) => void;
  onOtpSubmit: (otp: string) => void;
  onResendOtp: () => void;
  onStartAuth: () => void;
  onProfileSubmit: (nickname: string, email: string) => void;
  onProfileLater: () => void;
  step: 'welcome' | 'phone' | 'otp' | 'profile';
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  email: string;
  setEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  error: string;
  isSubmitting: boolean;
  onBack: () => void;
}

// Hook to detect screen size
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet };
};

const getResponsiveStyles = (isMobile: boolean, isTablet: boolean) => ({
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: isMobile ? 'stretch' : 'center',
    padding: isMobile ? '0' : isTablet ? '2rem' : '3rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: isMobile ? '0' : isTablet ? '12px' : '16px',
    padding: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem',
    width: '100%',
    maxWidth: isMobile ? '100%' : isTablet ? '450px' : '600px',
    boxShadow: isMobile 
      ? 'none' 
      : isTablet 
      ? '0 10px 25px rgba(0,0,0,0.1)'
      : '0 15px 35px rgba(0,0,0,0.12)',
    textAlign: 'center' as const,
    margin: isMobile ? '0' : '0 auto'
  },
  header: {
    marginBottom: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem'
  },
  title: {
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '40px',
    fontWeight: 'bold',
    color: '#00BE76',
    textAlign: 'center' as const,
    marginBottom: isMobile ? '0.5rem' : isTablet ? '1rem' : '1.5rem',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
    color: '#6b7280',
    textAlign: 'center' as const,
    marginBottom: isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem',
    lineHeight: '1.4'
  },
  form: {
    textAlign: 'left' as const
  },
  formGroup: {
    marginBottom: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '2rem'
  },
  label: {
    display: 'block',
    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: isMobile ? '8px' : isTablet ? '10px' : '12px'
  },
  input: {
    width: '100%',
    padding: isMobile ? '14px 16px' : isTablet ? '16px 18px' : '18px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: isMobile ? '8px' : isTablet ? '10px' : '12px',
    fontSize: isMobile ? '16px' : isTablet ? '16px' : '18px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s ease',
    WebkitAppearance: 'none' as 'none'
  },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  phonePrefix: {
    padding: isMobile ? '14px 12px' : isTablet ? '16px 16px' : '18px 18px',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRight: 'none',
    borderRadius: isMobile ? '8px 0 0 8px' : isTablet ? '10px 0 0 10px' : '12px 0 0 12px',
    fontSize: isMobile ? '16px' : isTablet ? '16px' : '18px',
    fontWeight: '600',
    color: '#374151',
    whiteSpace: 'nowrap'
  },
  phoneInput: {
    flex: 1,
    padding: isMobile ? '14px 16px' : isTablet ? '16px 18px' : '18px 20px',
    border: '2px solid #e5e7eb',
    borderLeft: 'none',
    borderRadius: isMobile ? '0 8px 8px 0' : isTablet ? '0 10px 10px 0' : '0 12px 12px 0',
    fontSize: isMobile ? '16px' : isTablet ? '16px' : '18px',
    outline: 'none',
    WebkitAppearance: 'none' as 'none'
  },
  button: {
    width: '100%',
    padding: isMobile ? '18px' : isTablet ? '18px' : '20px',
    backgroundColor: '#00BE76',
    color: 'white',
    border: 'none',
    borderRadius: isMobile ? '8px' : isTablet ? '10px' : '12px',
    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    transition: 'all 0.2s ease',
    minHeight: isMobile ? '52px' : isTablet ? '56px' : '60px'
  },
  buttonSecondary: {
    width: '100%',
    padding: isMobile ? '14px' : isTablet ? '16px' : '18px',
    backgroundColor: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: isMobile ? '8px' : isTablet ? '10px' : '12px',
    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: isMobile ? '1rem' : isTablet ? '1rem' : '1.5rem',
    transition: 'all 0.2s ease',
    minHeight: isMobile ? '48px' : isTablet ? '52px' : '56px'
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: isMobile ? '8px' : isTablet ? '10px' : '12px',
    padding: isMobile ? '10px' : isTablet ? '12px' : '16px',
    color: '#dc2626',
    fontSize: isMobile ? '12px' : isTablet ? '14px' : '16px',
    marginBottom: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    textAlign: 'left' as const
  },
  progressBar: {
    width: '100%',
    height: isMobile ? '6px' : isTablet ? '8px' : '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: isMobile ? '4px' : isTablet ? '6px' : '8px',
    marginBottom: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BE76',
    borderRadius: isMobile ? '4px' : isTablet ? '6px' : '8px',
    transition: 'width 0.3s ease'
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: isMobile ? '0.75rem' : isTablet ? '1rem' : '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: isMobile ? '8px' : isTablet ? '10px' : '12px',
    marginBottom: isMobile ? '0.75rem' : isTablet ? '1rem' : '1.5rem',
    textAlign: 'left' as const
  },
  featureIcon: {
    width: isMobile ? '28px' : isTablet ? '32px' : '40px',
    height: isMobile ? '28px' : isTablet ? '32px' : '40px',
    backgroundColor: '#00BE76',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isMobile ? '0.75rem' : isTablet ? '1rem' : '1.5rem',
    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    color: 'white',
    flexShrink: 0
  },
  featureContent: {
    flex: 1,
    minWidth: 0
  },
  featureTitle: {
    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: isMobile ? '4px' : isTablet ? '6px' : '8px'
  },
  featureDesc: {
    fontSize: isMobile ? '12px' : isTablet ? '14px' : '16px',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  welcomeTitleContainer: {
    display: 'flex',
    flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '0.25rem' : isTablet ? '0.5rem' : '0.75rem',
    marginBottom: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    flexWrap: 'wrap' as 'wrap'
  },
  welcomeTitle: {
    fontSize: isMobile ? '40px' : isTablet ? '40px' : '52px',
    fontWeight: 'bold',
    color: '#00BE76',
    margin: '0',
    lineHeight: '1.2'
  },
  welcomeSubTitle: {
    fontSize: isMobile ? '28px' : isTablet ? '28px' : '40px',
    fontWeight: 'bold',
    color: '#00BE76',
     margin: '0',
    lineHeight: '1.2'
  }
});

export default function LoginPage({
  onPhoneSubmit,
  onOtpSubmit,
  onResendOtp,
  onStartAuth,
  onProfileSubmit,
  onProfileLater,
  step,
  phoneNumber,
  setPhoneNumber,
  nickname,
  setNickname,
  email,
  setEmail,
  otp,
  setOtp,
  error,
  isSubmitting,
  onBack
}: LoginPageProps) {
  const { isMobile, isTablet } = useResponsive();
  const styles = getResponsiveStyles(isMobile, isTablet);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPhoneSubmit(phoneNumber, nickname);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOtpSubmit(otp);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileSubmit(nickname, email);
  };

  const getProgress = () => {
    if (step === 'welcome') return 25;
    if (step === 'phone') return 50;
    if (step === 'otp') return 75;
    return 100;
  };

  return (
    <div style={styles.container}>
      <div style={{width: '100%', padding: '0 1rem'}}>

        {step === 'welcome' && (
          <>
            <div style={styles.header}>
              <div style={styles.welcomeTitleContainer}>
                <h1 style={styles.welcomeTitle}>Green Turf</h1>
              </div>
              <div style={styles.welcomeTitleContainer}>
                <h1 style={styles.welcomeSubTitle}>Play</h1>
                <h1 style={styles.welcomeSubTitle}>Chat</h1>
                <h1 style={styles.welcomeSubTitle}>Challenge</h1>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: isMobile ? '2rem' : '3rem',
              marginTop: isMobile ? '1rem' : '2rem'
            }}>
              <img 
                src="/src/assets/cricket.svg" 
                alt="Cricket player" 
                style={{
                  width: isMobile ? '280px' : isTablet ? '320px' : '360px',
                  height: 'auto',
                  maxWidth: '100%'
                }}
              />
            </div>
            
            <button 
              style={styles.button}
              onClick={onStartAuth}
            >
              Get Started
            </button>
            
            <p style={{
              fontSize: isMobile ? '18px' : isTablet ? '20px' : '22px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginTop: isMobile ? '1rem' : '1.5rem',
              marginBottom: 0,
              textAlign: 'center'
            }}>
              Have Fun with Friends!
            </p>
          </>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Login / Sign In</h1>
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

        {/* Profile Step */}
        {step === 'profile' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>What should we call you?</h1>
              <p style={styles.subtitle}>
                Help us personalize your experience (both fields are optional)
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nickname</label>
                <input
                  style={styles.input}
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="How should we call you?"
                />
                <p style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  color: '#6b7280', 
                  marginTop: '4px',
                  lineHeight: '1.4'
                }}>
                  We'll use your phone number if not provided
                </p>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  style={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <p style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  color: '#6b7280', 
                  marginTop: '4px',
                  lineHeight: '1.4'
                }}>
                  For important updates and notifications
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
              
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={onProfileLater}
              >
                Later
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 