'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserIcon } from '@/components/icons';

// Sign-in page for returning users, reached from the "Sign in" link on
// the dashboard. Styled to match the proposal request cards.
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Placeholder until backend auth exists: validates the fields but doesn't
  // sign anyone in yet.
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');

    if (username.trim() === '') {
      setUsernameError('Username is required.');
    }

    if (password === '') {
      setPasswordError('Password is required.');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <section className="bg-blue-500 rounded-2xl p-8 max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-black text-center">Sign In</h1>

          {/* Avatar badge */}
          <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mx-auto my-6">
            <UserIcon className="w-16 h-16 text-blue-900" />
          </div>

          <p className="text-black text-center font-medium mb-6">
            Welcome Back!
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-black text-sm mb-1">
                Username <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <p className="text-red-200 text-xs mt-1">{usernameError}</p>}
            </div>

            <div>
              <label className="block text-black text-sm mb-1">
                Password <span className="text-red-300">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-200 text-xs mt-1">{passwordError}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white font-semibold py-3 rounded-md mt-6"
          >
            Sign In
          </button>

          <p className="text-black text-xs text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/" className="text-blue-100 underline">
              Request a proposal
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
