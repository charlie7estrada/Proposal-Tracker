'use client';

import { useState } from 'react';
import ProposalIntro from '@/components/ProposalIntro';
import ProposalDetailsForm from '@/components/ProposalDetailsForm';
import CreateAccountForm from '@/components/CreateAccountForm';
import ProposalSentModal from '@/components/ProposalSentModal';
import type { ProposalDetails, AccountDetails } from '@/types';

// Swap this out for a real fetch() call once the Flask backend exists.
// The real version will look roughly like:
//
//   async function submitToBackend(data: object): Promise<void> {
//     const response = await fetch('http://localhost:5000/api/submissions', {
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

export default function DashboardPage() {
  // Which step of the flow is showing: the project form, the create-account
  // card, or the "sent" confirmation popup
  const [step, setStep] = useState<'details' | 'account' | 'sent'>('details');
  const [details, setDetails] = useState<ProposalDetails | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  function handleNext(values: ProposalDetails) {
    setDetails(values);
    setStep('account');
  }

  async function handleSubmit(account: AccountDetails) {
    setSubmitError(false);
    setIsSubmitting(true);

    try {
      await fakeSubmit({ ...details, ...account });
      setStep('sent');
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-full bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-black">New Proposal Request</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2">

          <ProposalIntro />

          {/* Right column: the form card */}
          <section className="bg-blue-500 rounded-2xl p-8">
            {step === 'details' ? (
              <ProposalDetailsForm onNext={handleNext} />
            ) : (
              <CreateAccountForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </section>

        </div>
      </div>

      {/* Success popup */}
      <ProposalSentModal open={step === 'sent'} />
    </div>
  );
}
