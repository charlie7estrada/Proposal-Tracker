'use client';

import { useState } from 'react';

// Swap this out for a real fetch() call once the Flask backend exists.
// The real version will look roughly like:
//
//   async function submitToBackend(data: object): Promise<void> {
//     const response = await fetch('http://localhost:5000/api/intake', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) throw new Error('Server error');
//   }
//
function fakeSubmit(data: object): Promise<void> {
  void data;
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
}

export default function IntakeForm() {
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

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function resetForm() {
    setProjectType('');
    setTimeline('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setBudget('');
    setCompanyName('');
    setProjectDetails('');
    setConsent(false);
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setCompanyNameError('');
    setProjectDetailsError('');
    setConsentError('');
    setIsSubmitting(false);
    setSubmitStatus('idle');
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear all errors and any previous submission status before re-validating
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setCompanyNameError('');
    setProjectDetailsError('');
    setConsentError('');
    setSubmitStatus('idle');

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

    setIsSubmitting(true);

    try {
      await fakeSubmit({
        projectType,
        timeline,
        firstName,
        lastName,
        email,
        budget,
        companyName,
        projectDetails,
      });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">

        {/* Left column: marketing copy and feature highlights */}
        <section>
          <p className="text-sm text-black">New Proposal Request</p>
          <h1 className="text-5xl font-bold mt-2 text-black">
            Tell Us About<br />Your Project
          </h1>
          <p className="mt-4 text-black">
            Fill out the form below and our team will review it and get back to you shortly.
          </p>
          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">Personalized Proposal</h3>
                <p className="text-sm text-black">We tailor every proposal to your needs</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">Fast Response</h3>
                <p className="text-sm text-black">Typically responds within 1 business day</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">Secure & Confidential</h3>
                <p className="text-sm text-black">Your information and ideas are safe with us</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: the form card */}
        <section className="bg-blue-500 rounded-2xl p-8">
          {submitStatus === 'success' ? (

            /* Confirmation screen */
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center mb-6">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Thank you, {firstName}!
              </h2>
              <p className="text-blue-100 mb-8">
                We&apos;ve received your request and will be in touch within 1 business day.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="bg-blue-900 text-white font-semibold py-3 px-6 rounded-md"
              >
                Submit another request
              </button>
            </div>

          ) : (

            /* The form */
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Row 1: Project Type and Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black text-sm mb-1">Project Type</label>
                  <select
                    className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option value="">Select a service</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="fullstack">Full Stack Web App</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black text-sm mb-1">Timeline</label>
                  <select
                    className="w-full rounded-md px-3 py-2 bg-white text-gray-700"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="">Select timeline</option>
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
                    <option value="">Select budget</option>
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

              {/* Submission error */}
              {submitStatus === 'error' && (
                <p className="text-red-200 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white font-semibold py-3 rounded-md mt-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>

            </form>

          )}
        </section>

      </div>
    </main>
  );
}
