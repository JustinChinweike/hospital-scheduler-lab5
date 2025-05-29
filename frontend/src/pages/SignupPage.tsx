import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: 'destructive', title: 'Signup failed', description: data.message });
      } else {
        toast({ title: 'User created', description: 'Scan the QR code with your authenticator app' });
        setQrCode(data.qrCode);
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Signup failed', description: 'Network error' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign Up</h1>
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
        <Button type="submit">Sign Up</Button>
      </form>
      {qrCode && (
        <div className="mt-6 text-center">
          <p>Scan this QR code with your 2FA app:</p>
          <img src={qrCode} alt="2FA QR Code" className="mx-auto mt-2" />
        </div>
      )}
    </div>
  );
};

export default SignupPage;
