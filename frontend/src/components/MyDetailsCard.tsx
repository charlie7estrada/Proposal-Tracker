import { PencilIcon, UserIcon } from '@/components/icons';
import type { ClientProfile } from '@/types';

// Right-hand card on the client portal showing the signed-in client's
// contact info. Read-only until account editing exists on the backend.
export default function MyDetailsCard({ client }: { client: ClientProfile }) {
  const fields = [
    { label: 'First Name', value: client.firstName },
    { label: 'Last Name', value: client.lastName },
    { label: 'Email', value: client.email },
    { label: 'Phone', value: client.phone },
    { label: 'Company Name', value: client.companyName },
  ];

  return (
    <aside className="rounded-2xl overflow-hidden shadow-md">
      <div className="bg-blue-950 px-6 py-4 flex items-center gap-3">
        <UserIcon className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">My Details</h2>
      </div>

      <div className="bg-gradient-to-b from-blue-500 to-blue-400 px-6 py-6 space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="flex items-center gap-1.5 font-bold text-black text-sm">
              <PencilIcon className="w-3 h-3" /> {field.label}
            </p>
            <p className="text-white text-sm ml-5 break-words">{field.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
