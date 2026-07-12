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
