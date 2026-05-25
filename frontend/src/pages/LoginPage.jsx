import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(formData);
      login(res.data);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-display font-bold tracking-tighter inline-block mb-6">
            B<span className="text-accent-highlight">.</span>
          </Link>
          <h1 className="text-2xl font-display font-semibold mb-2">Welcome back</h1>
          <p className="text-text-secondary">Sign in to continue writing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-accent-highlight hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-full text-base py-3.5">
            Sign In
          </Button>
        </form>

        <p className="text-center mt-8 text-text-secondary text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-highlight hover:underline underline-offset-4 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
