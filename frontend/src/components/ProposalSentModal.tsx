'use client';

import Link from 'next/link';
import { EnvelopeIcon, ChevronRightIcon } from '@/components/icons';

// Confirmation popup shown after the proposal is submitted. Renders nothing
// until the parent flips `open` to true, then covers the page with a dimmed
// overlay and the "Proposal Sent" card. When the client created an account
// (`signedIn`), it links to their portal; otherwise it just closes via `onDone`.
export default function ProposalSentModal({
  open,
  signedIn,
  onDone,
}: {
  open: boolean;
  signedIn: boolean;
  onDone: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-gradient-to-b from-gray-100 via-blue-200 to-gray-400 rounded-2xl border border-gray-300 max-w-md w-full p-10 text-center">
        <h2 className="text-3xl font-bold text-black">Proposal Sent</h2>

        {/* Envelope badge */}
        <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center mx-auto my-8">
          <EnvelopeIcon className="w-12 h-12 text-white" />
        </div>

        {/* Confirmation message */}
        <h3 className="text-xl font-bold text-black mb-3">
          Your proposal has been sent!
        </h3>
        <p className="text-black mb-8">
          We&apos;ll be in touch if you have any questions.
          <br />
          Thank you for the opportunity!
        </p>

        {/* With an account, go to the portal; without one, just close */}
        {signedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            <ChevronRightIcon className="w-4 h-4" /> VIEW PROPOSAL
          </Link>
        ) : (
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            <ChevronRightIcon className="w-4 h-4" /> DONE
          </button>
        )}
      </div>
    </div>
  );
}
