import React, { useState } from 'react';
import { Eye, EyeOff, ExternalLink, MessageSquare, X } from 'lucide-react';
import ImageMarquee from './ImageMarquee';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../assets/logo/logo.png';

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
import topImage13 from '../assets/acm/13.png';
import topImage14 from '../assets/acm/14.png';
import topImage15 from '../assets/acm/15.png';
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
import bottomImage36 from '../assets/alumni/36.jpg';
import bottomImage37 from '../assets/alumni/37.png';
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

const SignupModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  
  const handleDiscordClick = () => {
    window.open('https://discord.gg/your-server-invite', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-colors duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background dark:bg-dark-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-colors duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 pt-12 space-y-6"> 
          {/* Welcome Message */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-primary dark:text-dark-primary">
              Follow these simple steps to get access to our recruitment portal
            </h3>
          </div>

          {/* Steps Card */}
          <div className="border-2 border-secondary/30 dark:border-dark-secondary/30 rounded-xl p-6 bg-secondary/5 dark:bg-dark-secondary/5">
            <h4 className="text-lg font-bold mb-4 text-center text-primary dark:text-dark-primary">
              How to Get Access
            </h4>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <h5 className="font-semibold mb-1 text-text dark:text-dark-text">
                    Join Our Discord Server
                  </h5>
                  <p className="text-sm text-text/70 dark:text-dark-text/70">
                    Connect with our vibrant community of developers and get to know the team
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h5 className="font-semibold mb-1 text-text dark:text-dark-text">
                    Get Your Credentials
                  </h5>
                  <p className="text-sm text-text/70 dark:text-dark-text/70">
                    Our team members will provide you with recruitment portal credentials
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h5 className="font-semibold mb-1 text-text dark:text-dark-text">
                    Access the Portal
                  </h5>
                  <p className="text-sm text-text/70 dark:text-dark-text/70">
                    Return here with your credentials and start your journey with us
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Discord Button */}
          <button
            onClick={handleDiscordClick}
            className="w-full py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 shadow-lg bg-[#5865F2] text-white"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-lg">Join Discord Server</span>
            <ExternalLink className="w-5 h-5" />
          </button>

          {/* Footer Note */}
          <div className="text-center p-4 rounded-lg bg-secondary/10 dark:bg-dark-secondary/10">
            <p className="text-sm text-primary dark:text-dark-primary">
              <strong>Note:</strong> This ensures we maintain a quality community and proper onboarding process for all new members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const { login } = useAuth(); 
  const { theme } = useTheme();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rollno, setRollno] = useState(''); 
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!rollno || !password) {
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
          rollno: rollno,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - store token and user data
        login(data.token, data.user);

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

  return (
    <>
      <div className="min-h-screen flex p-8 bg-background dark:bg-dark-background transition-colors duration-300">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center pr-8">
          <div className="w-full max-w-md mx-auto">
            {/* Welcome Text */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-3 text-text dark:text-dark-text">
                Sup?<br />Hey, welcome back to ACM recruitment portal
              </h1>
            </div>
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Roll Number Input */}
              <div>
                <input
                  type="text"
                  value={rollno}
                  onChange={(e) => setRollno(e.target.value)}
                  className="w-full px-4 py-3 border border-secondary/50 dark:border-dark-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 focus:border-transparent transition-all duration-200 bg-background dark:bg-dark-background text-text dark:text-dark-text placeholder-text/50 dark:placeholder-dark-text/50"
                  placeholder="12345"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border rounded focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary accent-primary dark:accent-dark-primary"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-text/80 dark:text-dark-text/80">Remember me</span>
                </label>
                <a href="#" className="text-sm hover:opacity-80 transition-opacity duration-200 text-secondary dark:text-dark-secondary">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-primary dark:bg-dark-primary text-background dark:text-dark-background"
              >
                {isLoading ? 'Logging In...' : 'Login In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-text/70 dark:text-dark-text/70">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="font-semibold hover:opacity-80 transition-opacity duration-200 text-primary dark:text-dark-primary"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>

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

        {/* Right Side - Enhanced content */}
        <div className="flex-1 relative overflow-hidden ml-8 rounded-3xl shadow-2xl bg-gradient-to-r from-primary dark:from-dark-primary to-secondary dark:to-dark-secondary">

          {/* Top Section */}
          <div className="h-1/2 flex flex-col">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-3 text-background dark:text-dark-background">
                Fueling Curiosity Igniting Ideas
              </h2>
              <p className="text-lg font-medium mb-2 text-secondary dark:text-dark-secondary">
                Join us Now!
              </p>
              <p className="text-sm opacity-90 text-background dark:text-dark-background">
                Welcome to the realm of ACM, where the boundaries of technology are pushed to the limits. Here, every idea has the potential to bring about change. Together, we are not just adapting to the future; we are actively shaping it, as a FAMILY.
              </p>
            </div>
            <div className="flex-1">
              <ImageMarquee images={topImages} speed="medium" />
            </div>
          </div>

          {/* Middle Section - Additional Content */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10">
            <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm mx-8 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-background dark:text-dark-background">
                Join 50+ Developers
              </h3>
              <p className="text-sm opacity-90 text-background dark:text-dark-background">
                Build your network • Learn new skills • Create impact
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="h-1/2 flex flex-col justify-end">
            <div className="p-8 text-center">
              <img src={Logo} alt="Logo" className="w-60 h-auto mx-auto mb-12" />

              <h3 className="text-2xl font-bold mb-2 text-background dark:text-dark-background">
                About us
              </h3>
              <p className="text-base text-secondary dark:text-dark-secondary">
                We are a group of computer science enthusiasts promoting self-education and group-based learning through Student Interest Groups (SIGs) focused on topics such as AI, Cybersecurity, Game Dev, App and Web Development, Blockchain Dev and more.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary dark:bg-dark-secondary"></div>
                  <span className="text-sm text-background/80 dark:text-dark-background/80">Events</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary dark:bg-dark-secondary"></div>
                  <span className="text-sm text-background/80 dark:text-dark-background/80">Workshops</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary dark:bg-dark-secondary"></div>
                  <span className="text-sm text-background/80 dark:text-dark-background/80">Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );
};

export default Login;