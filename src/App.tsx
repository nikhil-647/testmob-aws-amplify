import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

import LoginPage from './components/LoginPage';
import TodosPage from './components/TodosPage';
import ShowcasePage from './components/ShowcasePage';

// Custom Phone Authenticator Component
function PhoneAuthenticator({ children }: { children: (props: { signOut: () => void }) => React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'welcome' | 'phone' | 'otp'>('welcome');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleStartAuth = () => {
    setStep('phone');
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      // Prepare user attributes
      const userAttributes: any = {
        phone_number: fullPhoneNumber,
      };
      
      // Add nickname if provided
      if (nickname.trim()) {
        userAttributes.nickname = nickname.trim();
      }

      // First try to sign up the user (this will send SMS)
      await signUp({
        username: fullPhoneNumber,
        password: 'TempPass123!', // Required but not used for phone auth
        options: {
          userAttributes
        }
      });
      setIsNewUser(true);
      setStep('otp');
    } catch (error: any) {
      console.error('❌ SignUp error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.name === 'UsernameExistsException') {
        // User exists, resend confirmation code
        try {
          await resendSignUpCode({
            username: fullPhoneNumber
          });
          setIsNewUser(false);
          setStep('otp');
        } catch (resendError: any) {
          console.error('❌ Resend error:', resendError);
          setError(`Resend failed: ${resendError.message || 'Failed to send verification code'}`);
        }
      } else {
        setError(`SMS Error: ${error.message || 'Failed to send verification code'}`);
      }
    }
    setIsSubmitting(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      if (isNewUser) {
        console.log('🔄 New user - Attempting confirmSignUp...');
        
        // Confirm the sign up with OTP for new users
        const confirmResult = await confirmSignUp({
          username: fullPhoneNumber,
          confirmationCode: otp,
        });
        
        console.log('✅ confirmSignUp successful:', confirmResult);

        // After successful confirmation, sign in the user
        console.log('🔄 Attempting signIn after confirmation...');
        const signInResult = await signIn({
          username: fullPhoneNumber,
          password: 'TempPass123!', // This should match what we used in signUp
        });

        console.log('✅ signIn result:', signInResult);

        if (signInResult.isSignedIn) {
          console.log('✅ User is signed in, checking auth state...');
          await checkAuthState();
        }
      } else {
        console.log('🔄 Existing user - Attempting direct signIn with OTP...');
        
        // For existing users, try to sign in directly with OTP as password
        // This is for phone-based authentication where OTP acts as a temporary password
        try {
          const signInResult = await signIn({
            username: fullPhoneNumber,
            password: otp, // Use OTP as password for existing users
          });

          console.log('✅ Direct signIn result:', signInResult);

          if (signInResult.isSignedIn) {
            console.log('✅ User is signed in, checking auth state...');
            await checkAuthState();
          } else if (signInResult.nextStep) {
            console.log('🔄 Sign in requires additional step:', signInResult.nextStep);
            // Handle additional steps if needed (like MFA)
          }
        } catch (signInError: any) {
          console.error('❌ Direct signIn failed, trying with temp password:', signInError);
          
          // Fallback: try with the temporary password
          const fallbackSignInResult = await signIn({
            username: fullPhoneNumber,
            password: 'TempPass123!',
          });

          console.log('✅ Fallback signIn result:', fallbackSignInResult);

          if (fallbackSignInResult.isSignedIn) {
            console.log('✅ User is signed in with fallback, checking auth state...');
            await checkAuthState();
          }
        }
      }
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.name === 'NotAuthorizedException' && error.message.includes('Current status is CONFIRMED')) {
        console.log('🔄 User is already confirmed, attempting direct sign in...');
        // User is already confirmed, just sign them in
        try {
          const signInResult = await signIn({
            username: fullPhoneNumber,
            password: 'TempPass123!',
          });
          console.log('✅ Direct signIn for confirmed user successful:', signInResult);
          
          if (signInResult.isSignedIn) {
            await checkAuthState();
          }
        } catch (signInError: any) {
          console.error('❌ Direct signIn for confirmed user failed:', signInError);
          setError(`Sign in failed: ${signInError.message || 'Unable to sign in'}`);
        }
      } else if (error.name === 'CodeMismatchException') {
        console.error('❌ Code mismatch - OTP is incorrect or expired');
        setError('Invalid or expired verification code. Please request a new code.');
      } else if (error.name === 'ExpiredCodeException') {
        console.error('❌ Code expired');
        setError('Verification code has expired. Please request a new code.');
      } else if (error.name === 'LimitExceededException') {
        console.error('❌ Too many attempts');
        setError('Too many failed attempts. Please wait and try again later.');
      } else if (error.name === 'UserNotConfirmedException') {
        console.log('🔄 User not confirmed, trying confirmSignUp...');
        try {
          const confirmResult = await confirmSignUp({
            username: fullPhoneNumber,
            confirmationCode: otp,
          });
          console.log('✅ Late confirmSignUp successful:', confirmResult);
          await checkAuthState();
        } catch (confirmError: any) {
          console.error('❌ Late confirmSignUp failed:', confirmError);
          setError(`Verification failed: ${confirmError.message || 'Invalid verification code'}`);
        }
      } else {
        console.error('❌ Unknown error type:', error.name);
        setError(`Verification failed: ${error.message || 'Invalid verification code'}`);
      }
    }
    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setPhoneNumber('');
      setNickname('');
      setOtp('');
      setStep('welcome');
      setError('');
      setIsNewUser(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setError('');
    
    const fullPhoneNumber = `+91${phoneNumber}`;
    console.log('🔄 DEBUG: Resending OTP');
    console.log('📱 Phone number:', fullPhoneNumber);
    console.log('⏰ Resend time:', new Date().toISOString());
    
    try {
      const resendResult = await resendSignUpCode({
        username: fullPhoneNumber
      });
      console.log('✅ Resend OTP successful:', resendResult);
      console.log('📱 New SMS should be sent to:', fullPhoneNumber);
      setError(''); // Clear any previous errors
      // You could show a success message here
    } catch (error: any) {
      console.error('❌ Resend OTP failed:', error);
      console.error('Resend error name:', error.name);
      console.error('Resend error message:', error.message);
      console.error('Resend error code:', error.code);
      setError(error.message || 'Failed to resend code');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children({ signOut: handleSignOut })}</>;
  }

  return (
    <LoginPage
      onPhoneSubmit={(phone, nickname) => {
        setPhoneNumber(phone);
        setNickname(nickname);
        handlePhoneSubmit({ preventDefault: () => {} } as any);
      }}
      onOtpSubmit={(otpValue) => {
        setOtp(otpValue);
        handleOtpSubmit({ preventDefault: () => {} } as any);
      }}
      onResendOtp={handleResendOtp}
      onStartAuth={handleStartAuth}
      step={step}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      nickname={nickname}
      setNickname={setNickname}
      otp={otp}
      setOtp={setOtp}
      error={error}
      isSubmitting={isSubmitting}
      onBack={() => setStep(step === 'otp' ? 'phone' : 'welcome')}
    />
  );
}

function App() {
  return (
    <PhoneAuthenticator>
      {({ signOut }) => (
        <Routes>
          <Route path="/" element={<TodosPage signOut={signOut} />} />
          <Route path="/ShadcnShowcase" element={<ShowcasePage signOut={signOut} />} />
        </Routes>
      )}
    </PhoneAuthenticator>
  );
}

export default App;
