import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { validateEmail, validatePassword } from '../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, and special character';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(res.data);
      addToast('Account created! Welcome aboard.', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
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
          <h1 className="text-2xl font-display font-semibold mb-2">Create your account</h1>
          <p className="text-text-secondary">Join the community of thoughtful writers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" error={errors.name} required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="8+ characters" error={errors.password} required />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" error={errors.confirmPassword} required />

          <Button type="submit" isLoading={loading} className="w-full text-base py-3.5">
            Create Account
          </Button>
        </form>

        <p className="text-center mt-8 text-text-secondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-highlight hover:underline underline-offset-4 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
