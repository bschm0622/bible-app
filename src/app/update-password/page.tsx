'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold">Update Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input input-bordered"
            required
            minLength={6}
          />
          
          <button type="submit" className="w-full btn btn-primary">
            Update Password
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
} 