import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, X, ArrowLeft, CheckCircle, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { MessagingFlowAnimation } from './MessagingFlowAnimation';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setForgotSuccess(true);
    } catch {
      setForgotError('Failed to send reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotSuccess(false);
    setForgotError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate confirm password for signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const fullName = `${firstName} ${lastName}`.trim();
        await register(fullName, email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : (isLogin ? 'Invalid credentials' : 'Failed to create account');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setIsLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google sign-in failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in failed');
    },
  });

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right Section - Brand / Visual */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2420 0%, #2F5D3E 100%)',
        }}
      >
        {/* Abstract background shapes - messaging flow curves */}
        <div className="absolute inset-0">
          {/* Curved flow lines inspired by messaging */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.05 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>
            {/* Flowing curves */}
            <path
              d="M -100 200 Q 200 100, 400 200 T 800 200"
              stroke="white"
              strokeWidth="2"
              fill="none"
              filter="url(#blur)"
            />
            <path
              d="M -50 350 Q 250 280, 450 350 T 850 350"
              stroke="white"
              strokeWidth="2"
              fill="none"
              filter="url(#blur)"
            />
            <path
              d="M 100 500 Q 350 420, 550 500 T 900 500"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
              filter="url(#blur)"
            />
            <path
              d="M -80 650 Q 180 570, 420 650 T 820 650"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              filter="url(#blur)"
            />
          </svg>

          {/* Subtle glow orbs */}
          <div
            className="absolute top-20 -left-20 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute bottom-32 right-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 250, 0.03) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full h-full">
          {/* Main content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl text-white mb-6 leading-[1.1]">
              All your social conversations.<br />One inbox.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Manage Instagram, WhatsApp, and Facebook DMs in one powerful AI-driven CRM.
            </p>

            {/* Subtle illustration - messaging flow */}
            <div className="mt-16 opacity-30 flex justify-center">
              <MessagingFlowAnimation />
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-12 flex items-center gap-8 text-sm opacity-40">
            <span className="text-gray-300">© 2025 Inboop</span>
            <span className="text-gray-400">•</span>
            <button className="text-gray-300 hover:text-white transition-colors">Privacy Policy</button>
            <span className="text-gray-400">•</span>
            <button className="text-gray-300 hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </div>

      {/* Left Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 bg-gray-50">
        {/* Logo - Top Left */}
        <Link href="/" className="flex items-center gap-1.5 mb-8">
          <Image
            src="/images/SolidLogo.png"
            alt="Inboop"
            width={36}
            height={36}
          />
          <span className="text-xl text-gray-900">Inboop</span>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Toggle */}
            <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  isLogin
                    ? 'bg-white shadow-md text-gray-900 ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={isLogin ? {
                  backgroundColor: 'rgba(47, 93, 62, 0.02)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(47, 93, 62, 0.08)'
                } : {}}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-white shadow-md text-gray-900 ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={!isLogin ? {
                  backgroundColor: 'rgba(47, 93, 62, 0.02)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(47, 93, 62, 0.08)'
                } : {}}
              >
                Sign up
              </button>
            </div>

            {/* Welcome text */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-gray-500">
                {isLogin
                  ? 'Enter your credentials to continue'
                  : 'Get started with Inboop today'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields (signup only) */}
              {!isLogin && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700 mb-1.5">First name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700 mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your data is encrypted and secure
                </p>
              </div>

              {/* Confirm Password field (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password (login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                  boxShadow: '0 2px 8px rgba(47, 93, 62, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = 'linear-gradient(180deg, #3a7150 0%, #2F5D3E 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)';
                }}
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isLoading ? 'Please wait...' : (isLogin ? 'Continue' : 'Create account')}
              </button>

              {/* Helper text */}
              {!isLogin && (
                <p className="text-center text-sm text-gray-500">
                  No credit card required
                </p>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google login button */}
            <div>
              <button
                onClick={() => googleLogin()}
                className="w-full py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-600">Continue with Google</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                We never post without permission
              </p>
            </div>

            {/* Switch mode */}
            <p className="text-center text-gray-600 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="hover:underline transition-colors"
                style={{ color: '#2F5D3E' }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeForgotPassword}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            {/* Close button */}
            <button
              onClick={closeForgotPassword}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!forgotSuccess ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Reset your password</h3>
                  <p className="text-sm text-gray-500">
                    Enter your email and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                {/* Error message */}
                {forgotError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{forgotError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 rounded-xl text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                      boxShadow: '0 2px 8px rgba(47, 93, 62, 0.2)'
                    }}
                  >
                    {forgotLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {forgotLoading ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>

                {/* Back to login */}
                <button
                  onClick={closeForgotPassword}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 mb-6">
                  We&apos;ve sent a password reset link to<br />
                  <span className="font-medium text-gray-700">{forgotEmail}</span>
                </p>
                <button
                  onClick={closeForgotPassword}
                  className="w-full py-3 rounded-xl text-white transition-all shadow-md hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                    boxShadow: '0 2px 8px rgba(47, 93, 62, 0.2)'
                  }}
                >
                  Back to login
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setForgotSuccess(false)}
                    className="text-gray-700 hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}