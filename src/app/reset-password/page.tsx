'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the password reset link');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold">Reset Password</h2>
        
        <form onSubmit={handleReset} className="space-y-6">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input input-bordered"
            required
          />
          
          <button type="submit" className="w-full btn btn-primary">
            Send Reset Link
          </button>
        </form>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
} 