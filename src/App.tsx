import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendSignUpCode, confirmSignIn } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import './App.css';

const client = generateClient<Schema>();

// Custom Phone Authenticator Component
function PhoneAuthenticator({ children }: { children: (props: { signOut: () => void }) => React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const fullPhoneNumber = `+91${phoneNumber}`;
    console.log('🔄 Attempting to send SMS to:', fullPhoneNumber);
    console.log('👤 Nickname:', nickname || 'Not provided');

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
      const result = await signUp({
        username: fullPhoneNumber,
        password: 'TempPass123!', // Required but not used for phone auth
        options: {
          userAttributes
        }
      });
      console.log('✅ SignUp successful:', result);
      console.log('📱 SMS should have been sent to:', fullPhoneNumber);
      setIsNewUser(true);
      setStep('otp');
    } catch (error: any) {
      console.error('❌ SignUp error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.name === 'UsernameExistsException') {
        // User exists, resend confirmation code
        console.log('👤 User exists, attempting to resend code...');
        try {
          const resendResult = await resendSignUpCode({
            username: fullPhoneNumber
          });
          console.log('✅ Resend successful:', resendResult);
          console.log('📱 SMS should have been resent to:', fullPhoneNumber);
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
      // Confirm the sign up with OTP
      await confirmSignUp({
        username: fullPhoneNumber,
        confirmationCode: otp,
      });

      // After successful confirmation, sign in the user
      const signInResult = await signIn({
        username: fullPhoneNumber,
        password: 'TempPass123!', // This should match what we used in signUp
      });

      if (signInResult.isSignedIn) {
        await checkAuthState();
      }
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException' || error.name === 'UserNotConfirmedException') {
        // Try alternative approach for existing users
        try {
          await confirmSignUp({
            username: fullPhoneNumber,
            confirmationCode: otp,
          });
          await checkAuthState();
        } catch (confirmError: any) {
          setError(confirmError.message || 'Invalid verification code');
        }
      } else {
        setError(error.message || 'Invalid verification code');
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
      setStep('phone');
      setError('');
      setIsNewUser(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await resendSignUpCode({
        username: `+91${phoneNumber}`
      });
      setError(''); // Clear any previous errors
      // You could show a success message here
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="auth-container">Loading...</div>;
  }

  if (user) {
    return <>{children({ signOut: handleSignOut })}</>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In with Phone</h2>
        
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="phone-input-group">
              <span className="country-code">+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your phone number"
                maxLength={10}
                required
                className="phone-input"
              />
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname (optional)"
              className="nickname-input"
            />
            <small className="helper-text">Nickname is optional. We'll use your phone number if not provided.</small>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isSubmitting || phoneNumber.length < 10} className="auth-button">
              {isSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="success-message">
              📱 Verification code sent to +91{phoneNumber}
              <br />
              <small>Check your phone for SMS (may take 1-2 minutes)</small>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter OTP"
              maxLength={6}
              required
              className="otp-input"
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isSubmitting || otp.length < 6} className="auth-button">
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="back-button"
              style={{ marginBottom: '10px' }}
            >
              {isSubmitting ? 'Resending...' : 'Resend OTP'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('phone')} 
              className="back-button"
            >
              Back to Phone
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function App() {
  const [_, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <PhoneAuthenticator>
      {({ signOut }) => (
        <main>
          <UserAttributes />
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <div> ++Soup ++ </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </PhoneAuthenticator>
  );
}

function UserAttributes() {
  const [attributes, setAttributes] = useState<any>(null);

  useEffect(() => {
    fetchUserAttributes().then(setAttributes);
  }, []);

  const getDisplayName = () => {
    if (!attributes) return 'Loading...';
    
    if (attributes.nickname) {
      return attributes.nickname;
    }
    
    if (attributes.phone_number) {
      return attributes.phone_number;
    }
    
    return 'User';
  };

  return (
    <div>
      <h2>Welcome, {getDisplayName()}! 👋</h2>
      <details>
        <summary>View User Details</summary>
        <pre>{JSON.stringify(attributes, null, 2)}</pre>
      </details>
    </div>
  );
}


export default App;
