'use client';

import { useState } from 'react';
import type { AccountDetails } from '@/types';
import { UserIcon, EnvelopeIcon } from '@/components/icons';

// Step 2 of the proposal request flow: the "Create Account" card.
// Owns its own field state and validation; on success it hands the
// account details up to the parent, which performs the actual submit.
export default function CreateAccountForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (account: AccountDetails) => void;
  isSubmitting: boolean;
  submitError: boolean;
}) {
  // Field values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation error messages (empty string means no error)
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear all errors before re-validating
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasErrors = false;

    if (username.trim() === '') {
      setUsernameError('Username is required.');
      hasErrors = true;
    }

    if (password === '') {
      setPasswordError('Password is required.');
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      hasErrors = true;
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('Please confirm your password.');
      hasErrors = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      hasErrors = true;
    }

    if (hasErrors) return;

    onSubmit({ username, password });
  }

  return (
    <form className="max-w-sm mx-auto py-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-black text-center">Create Account</h2>

      {/* Avatar badge */}
      <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mx-auto my-6">
        <UserIcon className="w-16 h-16 text-blue-900" />
      </div>

      <p className="text-black text-center font-medium mb-6">
        You&apos;re Almost There
        <br />
        One Final Step!
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

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-black text-sm mb-1">
              Confirm Password <span className="text-red-300">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <p className="text-red-200 text-xs mt-1">{confirmPasswordError}</p>}
          </div>
        </div>
      </div>

      {/* Submission error */}
      {submitError && (
        <p className="text-red-200 text-sm mt-4">
          Something went wrong. Please try again.
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-950 text-white font-semibold py-3 rounded-md mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          'Submitting...'
        ) : (
          <>
            <EnvelopeIcon className="w-4 h-4" /> Submit
          </>
        )}
      </button>

    </form>
  );
}
