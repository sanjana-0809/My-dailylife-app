// pages/Login.jsx - Login & Register page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) { toast.error('Name is required'); setLoading(false); return; }
        await register(email, password, name);
        toast.success('Account created!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">⏰</span>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">LifeRemind</h1>
          <p className="text-gray-500 mt-1">Voice-driven life tracker</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-surface-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" autoFocus />
            )}
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoFocus={!isRegister} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters" />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your data stays on your server. No cloud lock-in.
        </p>
      </div>
    </div>
  );
};

export default Login;
