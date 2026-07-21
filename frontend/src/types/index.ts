// Shapes shared between the dashboard proposal-request steps.
// Grow this file as backend models come online (Submission, Proposal, User, etc.).

export interface ProposalDetails {
  projectType: string;
  timeline: string;
  firstName: string;
  lastName: string;
  email: string;
  budget: string;
  companyName: string;
  projectDetails: string;
}

export interface AccountDetails {
  username: string;
  password: string;
}

// Which tab of the client portal a proposal shows under.
export type ProposalStatus = 'active' | 'completed' | 'declined';

export interface ProposalFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  // True when the signed-in client uploaded it (only their own are deletable)
  uploadedByClient: boolean;
}

// One entry in a proposal's message thread between the client and the team.
export interface ProposalMessage {
  id: string;
  from: 'team' | 'client';
  text: string;
  sent: string;
}

export interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  lastUpdated: string;
  budget: string;
  timeline: string;
  projectType: string;
  details: string;
  files: ProposalFile[];
  messages: ProposalMessage[];
}

export interface ClientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}
