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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children({ signOut: handleSignOut })}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          {step === 'welcome' && (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Todo App</h1>
                <p className="text-lg text-gray-600">Organize your tasks and stay productive!</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <span className="text-gray-700 font-medium">Create and manage todos</span>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl mr-4">📱</span>
                  <span className="text-gray-700 font-medium">Secure phone authentication</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl mr-4">🔄</span>
                  <span className="text-gray-700 font-medium">Real-time sync</span>
                </div>
              </div>
              
              <button
                onClick={handleStartAuth}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
          )}
          
          {step === 'phone' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In with Phone</h2>
                <p className="text-gray-600">Enter your phone number to get started</p>
              </div>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter your phone number"
                      maxLength={10}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nickname (Optional)</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">We'll use your phone number if not provided</p>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || phoneNumber.length < 10}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back to Welcome
                </button>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">📱 Verification code sent to +91{phoneNumber}</p>
                  <p className="text-green-600 text-sm mt-1">Check your phone for SMS (may take 1-2 minutes)</p>
                </div>
              </div>
              
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length < 6}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-2"
                >
                  {isSubmitting ? 'Resending...' : 'Resend OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back to Phone
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <UserAttributes />
              
              <div className="mt-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">My todos</h1>
                
                <button
                  onClick={createTodo}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-6"
                >
                  + Add New Todo
                </button>
                
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <p className="text-gray-800">{todo.content}</p>
                    </div>
                  ))}
                  
                  {todos.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No todos yet. Create your first todo!</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={signOut}
                  className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
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
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome, {getDisplayName()}! 👋
      </h2>
      
      <details className="text-left">
        <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
          View User Details
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(attributes, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default App;
