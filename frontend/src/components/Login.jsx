import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ImageMarquee from './ImageMarquee';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../assets/logo/logo.png';
import { Instagram, Linkedin, Github, Globe } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import topImage1 from '../assets/acm/1.png';
import topImage2 from '../assets/acm/2.png';
import topImage3 from '../assets/acm/3.png';
import topImage4 from '../assets/acm/4.png';
import topImage5 from '../assets/acm/5.png';
import topImage6 from '../assets/acm/6.png';
import topImage7 from '../assets/acm/7.png';
import topImage8 from '../assets/acm/8.png';
import topImage9 from '../assets/acm/9.png';
import topImage10 from '../assets/acm/10.png';
import topImage11 from '../assets/acm/11.png';
import topImage12 from '../assets/acm/12.png';
import topImage13 from '../assets/acm/13.jpg';
import topImage14 from '../assets/acm/14.jpg';
import topImage15 from '../assets/acm/15.jpg';
import topImage16 from '../assets/acm/16.png';
import topImage17 from '../assets/acm/17.png';
import topImage18 from '../assets/acm/18.png';
import topImage19 from '../assets/acm/19.png';
import topImage20 from '../assets/acm/20.png';

import bottomImage21 from '../assets/alumni/21.png';
import bottomImage22 from '../assets/alumni/22.avif';
import bottomImage23 from '../assets/alumni/23.png';
import bottomImage24 from '../assets/alumni/24.png';
import bottomImage25 from '../assets/alumni/25.png';
import bottomImage26 from '../assets/alumni/26.png';
import bottomImage27 from '../assets/alumni/27.png';
import bottomImage28 from '../assets/alumni/28.png';
import bottomImage29 from '../assets/alumni/29.png';
import bottomImage30 from '../assets/alumni/30.png';
import bottomImage31 from '../assets/alumni/31.png';
import bottomImage32 from '../assets/alumni/32.png';
import bottomImage33 from '../assets/alumni/33.png';
import bottomImage34 from '../assets/alumni/34.png';
import bottomImage35 from '../assets/alumni/35.png';
import bottomImage36 from '../assets/alumni/36.png';
import bottomImage37 from '../assets/alumni/37.svg';
import bottomImage38 from '../assets/alumni/38.avif';
import bottomImage39 from '../assets/alumni/39.png';

const topImages = [
  topImage1, topImage2, topImage3, topImage4, topImage5,
  topImage6, topImage7, topImage8, topImage9, topImage10,
  topImage11, topImage12, topImage13, topImage14, topImage15,
  topImage16, topImage17, topImage18, topImage19, topImage20
];

const bottomImages = [
  bottomImage21, bottomImage22, bottomImage23, bottomImage24, bottomImage25,
  bottomImage26, bottomImage27, bottomImage28, bottomImage29, bottomImage30,
  bottomImage31, bottomImage32, bottomImage33, bottomImage34, bottomImage35,
  bottomImage36, bottomImage37, bottomImage38, bottomImage39
];

function MyComponent() {
  return (
    <img src={Logo} alt="Logo" />
  );
}

const Login = ({ onLogin }) => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [formType, setFormType] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    rollno: '',
    password: '',
    rememberMe: false
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    rollno: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot password form state
  const [forgotData, setForgotData] = useState({
    email: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setFormType('reset');
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!loginData.rollno || !loginData.password) {
      setError('Roll number and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://aseam.acm.org/LMS/roadmaps/auth.php/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollno: loginData.rollno,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - store token and user data
        login(data.token, data.user);
        console.log(data.user);

        // Call the onLogin prop if provided
        if (onLogin) {
          onLogin();
        }
      } else {
        // Handle error responses
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Basic validation
    if (!signupData.rollno || !signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://aseam.acm.org/LMS/roadmaps/auth.php/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollno: signupData.rollno,
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! You can now login.');
        setSignupData({
          rollno: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          setFormType('login');
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!forgotData.email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://aseam.acm.org/LMS/roadmaps/auth.php/forgot_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotData.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password reset link has been sent to your email.');
        setForgotData({ email: '' });
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Basic validation
    if (!newPassword || !confirmNewPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://aseam.acm.org/LMS/roadmaps/auth.php/reset_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          password: newPassword,
          confirmPassword: confirmNewPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password reset successful! You can now login with your new password.');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          setFormType('login');
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const renderForm = () => {
    if (formType === 'login') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-text dark:text-dark-text">
              Hey there!, <br></br> welcome back to ACM recruitment portal
            </h1>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Roll Number Input */}
            <div>
              <input
                type="text"
                value={loginData.rollno}
                onChange={(e) => setLoginData({ ...loginData, rollno: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="12345"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loginData.rememberMe}
                  onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                  className="w-4 h-4 border rounded focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary accent-primary dark:accent-dark-primary"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-text/80 dark:text-dark-text/80">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setFormType('forgot')}
                className="text-sm hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-primary dark:bg-dark-primary text-background dark:text-dark-background"
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text/70 dark:text-dark-text/70">
              Don't have an account?{' '}
              <button
                onClick={() => setFormType('signup')}
                className="font-semibold hover:opacity-80 transition-opacity duration-200 text-primary dark:text-dark-primary"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      );
    } else if (formType === 'signup') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-text dark:text-dark-text">
              Join the ACM family
            </h1>
            <p className="text-text/70 dark:text-dark-text/70">Create your account to get started</p>
          </div>
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            {/* Roll Number Input */}
            <div>
              <input
                type="text"
                value={signupData.rollno}
                onChange={(e) => setSignupData({ ...signupData, rollno: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Roll Number (e.g., 12345)"
                disabled={isLoading}
              />
            </div>

            {/* Name Input */}
            <div>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Full Name"
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Email Address"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Confirm Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-primary dark:bg-dark-primary text-background dark:text-dark-background"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text/70 dark:text-dark-text/70">
              Already have an account?{' '}
              <button
                onClick={() => setFormType('login')}
                className="font-semibold hover:opacity-80 transition-opacity duration-200 text-primary dark:text-dark-primary"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      );
    } else if (formType === 'reset') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-text dark:text-dark-text">
              Set your new password
            </h1>
            <p className="text-text/70 dark:text-dark-text/70">Enter your new password below</p>
          </div>
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {/* New Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="New Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm New Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                placeholder="Confirm New Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-primary dark:bg-dark-primary text-background dark:text-dark-background"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text/70 dark:text-dark-text/70">
              Remember your password?{' '}
              <button
                onClick={() => setFormType('login')}
                className="font-semibold hover:opacity-80 transition-opacity duration-200 text-primary dark:text-dark-primary"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex p-2 bg-background dark:bg-dark-background transition-colors duration-300">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center pr-8">
        <div className="w-full max-w-md mx-auto">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300">
              {successMessage}
            </div>
          )}

          {renderForm()}

          {/* Alumni Section */}
          <div className="mt-12 w-full max-w-md mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2 text-primary dark:text-dark-primary">
                Our Alumni Are At
              </h3>
            </div>
            <div className="h-20 overflow-hidden rounded-lg">
              <ImageMarquee images={bottomImages} speed="fast" compact={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced content */}
      <div className="flex-1 relative overflow-hidden ml-8 rounded-3xl shadow-2xl bg-gradient-to-r from-purple-700 to-gray-900 dark:from-purple-900 dark:to-black">
        {/* Top Section - Moderately increased height for photos */}
        <div className="h-[50%] flex flex-col">
          <div className="p-6 text-center">
            <img src={Logo} alt="Logo" className="w-52 h-auto mx-auto" />
            <h2 className="text-2xl font-bold mb-2 text-background dark:text-dark-background">
              ACM Amritapuri
            </h2>
            <p className="text-base font-medium text-background dark:text-dark-background">
              Learn, Build, Belong
            </p>
          </div>
          <div className="flex-1">
            <ImageMarquee images={topImages} speed="medium" />
          </div>
        </div>
        {/* Middle Section - Centered overlay */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10">
          <div className="bg-gradient-to-r from-purple-900/80 to-purple-900/80 backdrop-blur-sm mx-8 rounded-2xl p-4 text-center">
            <h3 className="text-xl font-bold mb-2 text-background dark:text-dark-background">
              Welcome to the ACM family
            </h3>

          </div>
        </div>


        {/* Bottom Section - Better aligned */}
        <div className="h-[45%] flex flex-col">
          {/* Spacer to push content down from middle overlay */}
          <div className="flex-1"></div>

          {/* About and Discord Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-6 sm:space-y-8 lg:space-y-12 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-background dark:text-dark-background">
                About us
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-background dark:text-dark-background leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
                A community of tech enthusiasts exploring AI, Cybersecurity, Web & App Development, Blockchain, Game Development, and more — learn, create, and grow with us!
              </p>
            </div>

            {/* Discord Section */}
            <div className="text-center">
              <p className="text-xs sm:text-sm lg:text-base text-background dark:text-dark-background leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
                To get the latest updates on the recruitment process and have your questions answered, join our Discord server.
              </p>
            </div>
          </div>

          {/* Social Media Section - Fixed at bottom */}
          <div className="px-4 sm:px-6 lg:px-8 pb-2 sm:pb-3 lg:pb-4 mt-4 sm:mt-1">
            <div className="text-center max-w-md mx-auto">
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-background dark:text-dark-background">
                Connect with us
              </h4>
              <div className="flex justify-center items-center space-x-4 sm:space-x-6 lg:space-x-8">
                <a
                  href="#"
                  className="group flex flex-col items-center space-y-1 hover:scale-110 transition-all duration-300"
                >
                  <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-background/20 dark:bg-dark-background/20 group-hover:bg-background/30 dark:group-hover:bg-dark-background/30 transition-all duration-300">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-background dark:text-dark-background" />
                  </div>
                  <span className="text-xs sm:text-xs lg:text-sm text-background/80 dark:text-dark-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    Instagram
                  </span>
                </a>
                <a
                  href="#"
                  className="group flex flex-col items-center space-y-1 hover:scale-110 transition-all duration-300"
                >
                  <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-background/20 dark:bg-dark-background/20 group-hover:bg-background/30 dark:group-hover:bg-dark-background/30 transition-all duration-300">
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-background dark:text-dark-background" />
                  </div>
                  <span className="text-xs sm:text-xs lg:text-sm text-background/80 dark:text-dark-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    LinkedIn
                  </span>
                </a>

                <a
                  href="#"
                  className="group flex flex-col items-center space-y-1 hover:scale-110 transition-all duration-300"
                >
                  <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-background/20 dark:bg-dark-background/20 group-hover:bg-background/30 dark:group-hover:bg-dark-background/30 transition-all duration-300">
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-background dark:text-dark-background" />
                  </div>
                  <span className="text-xs sm:text-xs lg:text-sm text-background/80 dark:text-dark-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    GitHub
                  </span>
                </a>

                <a
                  href="#"
                  className="group flex flex-col items-center space-y-1 hover:scale-110 transition-all duration-300"
                >
                  <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-background/20 dark:bg-dark-background/20 group-hover:bg-background/30 dark:group-hover:bg-dark-background/30 transition-all duration-300">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-background dark:text-dark-background" />
                  </div>
                  <span className="text-xs sm:text-xs lg:text-sm text-background/80 dark:text-dark-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    Website
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;