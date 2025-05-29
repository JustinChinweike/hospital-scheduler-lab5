import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: 'destructive', title: 'Login failed', description: data.message });
      } else {
        localStorage.setItem('token', data.token);
        toast({ title: 'Login successful' });
        navigate('/list-schedule');
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Login failed', description: 'Network error' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="2FA Token (if enabled)"
        />
        <Button type="submit">Log In</Button>
      </form>
    </div>
  );
};

export default LoginPage;
