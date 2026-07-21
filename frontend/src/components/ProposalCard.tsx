'use client';

import { useState } from 'react';
import FileManager from '@/components/FileManager';
import MessageModal from '@/components/MessageModal';
import { ChatIcon, CircleDotIcon, EyeIcon, PencilIcon } from '@/components/icons';
import type { Proposal, ProposalStatus } from '@/types';

const STATUS_STYLES: Record<ProposalStatus, { label: string; className: string }> = {
  active: { label: 'In Progress', className: 'bg-sky-400' },
  completed: { label: 'Completed', className: 'bg-green-500' },
  declined: { label: 'Declined', className: 'bg-red-500' },
};

// One editable field inside the expanded proposal details
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-bold text-black">
        <PencilIcon className="w-3.5 h-3.5" /> {label}
      </p>
      <p className="text-black text-sm mt-0.5 ml-5">{value}</p>
    </div>
  );
}

// One proposal on the client portal: a summary header that's always visible,
// and a details panel (project info plus the file manager) that "View Details"
// expands and collapses so several projects fit on the page.
export default function ProposalCard({
  proposal,
  defaultExpanded = false,
}: {
  proposal: Proposal;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [messageOpen, setMessageOpen] = useState(false);
  const status = STATUS_STYLES[proposal.status];

  return (
    <section className="rounded-2xl overflow-hidden shadow-md">

      {/* Summary header: always visible */}
      <div className="bg-gray-100 p-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-black">{proposal.title}</h2>
          <p className="text-sm text-gray-600 mt-1">#{proposal.id}</p>
          <p className="text-sm text-black mt-6">
            Last updated: {proposal.lastUpdated}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-40 shrink-0">
          <span
            className={`${status.className} text-white font-semibold text-sm py-1.5 rounded-full flex items-center justify-center gap-2`}
          >
            <CircleDotIcon className="w-4 h-4" /> {status.label}
          </span>
          <button
            type="button"
            onClick={() => setMessageOpen(true)}
            className="bg-gray-300 text-black font-semibold text-sm py-1.5 rounded-full flex items-center justify-center gap-2"
          >
            <ChatIcon className="w-4 h-4" /> Message
          </button>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="bg-gray-300 text-black font-semibold text-sm py-1.5 rounded-full flex items-center justify-center gap-2"
          >
            <EyeIcon className="w-4 h-4" /> {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {/* Details panel: project info and the file manager */}
      {expanded && (
        <div className="bg-gradient-to-b from-blue-400 to-blue-300 p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <Field label="Budget" value={proposal.budget} />
            <Field label="Time Line" value={proposal.timeline} />
            <Field label="Project Type" value={proposal.projectType} />
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-1.5 font-bold text-black">
              <PencilIcon className="w-3.5 h-3.5" /> Project Details
            </p>
            <p className="bg-gray-100 text-gray-700 text-sm rounded-md p-4 mt-2">
              {proposal.details}
            </p>
          </div>

          <FileManager proposalId={proposal.id} initialFiles={proposal.files} />
        </div>
      )}

      {/* Message thread popup */}
      {messageOpen && (
        <MessageModal proposal={proposal} onClose={() => setMessageOpen(false)} />
      )}

    </section>
  );
}
