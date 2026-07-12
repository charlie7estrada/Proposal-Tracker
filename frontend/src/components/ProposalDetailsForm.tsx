'use client';

import { useState } from 'react';
import type { ProposalDetails } from '@/types';

// Step 1 of the proposal request flow: the project details form.
// Owns its own field state and validation; on success it hands the
// values up to the parent via onNext, which advances to the account step.
export default function ProposalDetailsForm({
  onNext,
}: {
  onNext: (details: ProposalDetails) => void;
}) {
  // Field values
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [consent, setConsent] = useState(false);

  // Validation error messages (empty string means no error)
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [projectDetailsError, setProjectDetailsError] = useState('');
  const [consentError, setConsentError] = useState('');

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear all errors before re-validating
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setCompanyNameError('');
    setProjectDetailsError('');
    setConsentError('');

    let hasErrors = false;

    if (firstName.trim() === '') {
      setFirstNameError('First name is required.');
      hasErrors = true;
    }

    if (lastName.trim() === '') {
      setLastNameError('Last name is required.');
      hasErrors = true;
    }

    if (email.trim() === '') {
      setEmailError('Email is required.');
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasErrors = true;
    }

    if (companyName.trim() === '') {
      setCompanyNameError('Company name is required.');
      hasErrors = true;
    }

    if (projectDetails.trim() === '') {
      setProjectDetailsError('Project details are required.');
      hasErrors = true;
    }

    if (!consent) {
      setConsentError('You must accept this to submit.');
      hasErrors = true;
    }

    if (hasErrors) return;

    onNext({
      projectType,
      timeline,
      firstName,
      lastName,
      email,
      budget,
      companyName,
      projectDetails,
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      {/* Row 1: Project Type and Time Line */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-black text-sm mb-1">Project Type</label>
          <select
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            <option value="">Project Type</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile App</option>
            <option value="fullstack">Full Stack Web App</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-black text-sm mb-1">Time Line</label>
          <select
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          >
            <option value="">Time Line</option>
            <option value="asap">ASAP</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      {/* Row 2: First Name and Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-black text-sm mb-1">
            First Name <span className="text-red-300">*</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError && <p className="text-red-200 text-xs mt-1">{firstNameError}</p>}
        </div>
        <div>
          <label className="block text-black text-sm mb-1">
            Last Name <span className="text-red-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError && <p className="text-red-200 text-xs mt-1">{lastNameError}</p>}
        </div>
      </div>

      {/* Row 3: Email and Budget */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-black text-sm mb-1">
            Email <span className="text-red-300">*</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-200 text-xs mt-1">{emailError}</p>}
        </div>
        <div>
          <label className="block text-black text-sm mb-1">Budget</label>
          <select
            className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Budget</option>
            <option value="under-5k">Under $5k</option>
            <option value="5k-15k">$5k - $15k</option>
            <option value="15k-50k">$15k - $50k</option>
            <option value="50k-plus">$50k+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>
      </div>

      {/* Row 4: Company Name (full width) */}
      <div>
        <label className="block text-black text-sm mb-1">
          Company Name <span className="text-red-300">*</span>
        </label>
        <input
          type="text"
          placeholder="Company Name"
          className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        {companyNameError && <p className="text-red-200 text-xs mt-1">{companyNameError}</p>}
      </div>

      {/* Row 5: Project Details (full width, textarea) */}
      <div>
        <label className="block text-black text-sm mb-1">
          Project Details <span className="text-red-300">*</span>
        </label>
        <textarea
          placeholder="What can we help you with?"
          rows={4}
          className="w-full rounded-md px-3 py-2 bg-white text-gray-700 resize-none"
          value={projectDetails}
          onChange={(e) => setProjectDetails(e.target.value)}
        />
        {projectDetailsError && <p className="text-red-200 text-xs mt-1">{projectDetailsError}</p>}
      </div>

      {/* Consent checkbox */}
      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          id="consent"
          className="mt-1"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <div>
          <label htmlFor="consent" className="text-black text-xs">
            I consent to Proposal Tracker storing my information so they can respond to my inquiry
          </label>
          {consentError && <p className="text-red-200 text-xs mt-1">{consentError}</p>}
        </div>
      </div>

      {/* Next button */}
      <button
        type="submit"
        className="w-full bg-blue-950 text-white font-semibold py-3 rounded-md mt-2"
      >
        Next
      </button>

    </form>
  );
}
