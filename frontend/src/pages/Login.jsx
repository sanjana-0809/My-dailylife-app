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
    } catch (err) { toast.error(err.response?.data?.error || 'Authentication failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/logo.jpg" alt="LifeRemind" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg shadow-brand-green/30 object-contain" />
          <h1 className="text-3xl font-bold text-white tracking-tight font-display">LifeRemind</h1>
          <p className="text-dark-300 mt-1.5 text-sm">Voice-driven life tracker</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 rounded-3xl border border-dark-600 p-7 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus />}
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus={!isRegister} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-brand-green hover:text-brand-greenDark font-medium transition-colors">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-dark-400 mt-6">Your data stays on your server. No cloud lock-in.</p>
      </div>
    </div>
  );
};

export default Login;
