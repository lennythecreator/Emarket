'use client'; // Required for using hooks in Next.js pages

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();

      if (data.username) {
        // Store username information in localStorage (since userId is no longer needed)
        const userInfo = { username: data.username };
        localStorage.setItem('user', JSON.stringify(userInfo));

        router.push('/items'); // Redirect to items page on successful login
      } else {
        throw new Error('Username not found in the response');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className="bg-gradient-to-l from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col gap-4 w-full max-w-md p-8 rounded-lg shadow-md">
        <h1 className="font-semibold text-2xl">Welcome to E-market!</h1>
        
        <Label htmlFor="login">Login</Label>
        <Input
          type="text"
          placeholder="Login"
          id="login"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />
        
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        
        <Button type="submit">Login</Button>

        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error if login fails */}
      </form>
    </div>
  );
}
