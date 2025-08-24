import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Send, Key } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminLogin = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [resetData, setResetData] = useState({
    email: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        loginData.email, 
        loginData.password
      );
      
      // Check if user is admin (you can add admin role check here)
      if (userCredential.user) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onLoginSuccess(userCredential.user);
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendPasswordResetEmail(auth, resetData.email);
      setIsResetSent(true);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setResetData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (isResetSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to <strong>{resetData.email}</strong>
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setIsResetSent(false);
                setIsForgotPassword(false);
                setIsLogin(true);
              }}
              className="w-full btn-primary"
            >
              Back to Login
            </button>
            
            <button
              onClick={() => {
                setIsResetSent(false);
                setIsForgotPassword(true);
                setIsLogin(false);
              }}
              className="w-full btn-secondary"
            >
              Send Another Email
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="absolute top-8 left-8 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="mx-auto h-16 w-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {isForgotPassword ? 'Reset Password' : 'Admin Login'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : 'Sign in to access the admin panel'
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </motion.div>
        )}

        {/* Forms */}
        {isForgotPassword ? (
          // Forgot Password Form
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  value={resetData.email}
                  onChange={(e) => handleInputChange(e, 'reset')}
                  className="form-input pl-10"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="spinner w-5 h-5"></div>
              ) : (
                <>
                  <Send size={20} />
                  Send Reset Link
                </>
              )}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => handleInputChange(e, 'login')}
                  className="form-input pl-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={(e) => handleInputChange(e, 'login')}
                  className="form-input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setIsLogin(false);
                }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="spinner w-5 h-5"></div>
              ) : (
                <>
                  <Key size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* Demo Credentials */}
        {/* Demo Credentials */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Demo Credentials
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
