export const tasksInputHeaders = [
  { id: "repository", title: "repository" },
  { id: "title", title: "title" },
  { id: "issue_id", title: "issue_id" },
  { id: "pr_id", title: "pr_id" },
  { id: "completed_by", title: "completed_by" },
  { id: "amount_paid", title: "amount_paid" },
  { id: "bug_bounty", title: "bug_bounty" },
  { id: "account_number", title: "account_number" },
];

export const projectTeamsInputHeaders = [
  { id: "PROJECT NAME", title: "project_name" },
  { id: "DISPLAY NAME", title: "display_name" },
  { id: "PROJECT LEADER", title: "project_leader" },
  { id: "GITHUB USERNAME", title: "github_username" },
  { id: "ROLE", title: "role" },
  { id: "TEAM JOINING DATE", title: "date_joined" },
  { id: "Pay (YES / NO)", title: "pay" },
  { id: "ACCOUNT NUMBER", title: "account_number" },
];

export const tasksOutputHeaders = [
  { id: "repository", title: "Repository" },
  { id: "title", title: "Task" },
  { id: "issue_id", title: "Issue Id" },
  { id: "pr_id", title: "Pull Request Id" },
  { id: "completed_by", title: "Completed By (Github Username)" },
  { id: "amount_paid", title: "Amount Paid" },
  { id: "bug_bounty", title: "Compesated For Reporting Bug?" },
  { id: "account_number", title: "Account Number" },
];

export const teamsOutputHeaders = [
  { id: "team", title: "Team Name" },
  { id: "title", title: "Member's Role" },
  { id: "isLead", title: "isLead" },
  { id: "createdDate", title: "Date Joined" },
  { id: "github_username", title: "Github Username" },
  { id: "profile_image", title: "Profile Image" },
  { id: "slack_username", title: "Slack Username" },
  { id: "account_number", title: "Account Number" },
  { id: "net_balance", title: "Net Balance" },
  { id: "balance", title: "Balance" },
];

export const projectTeamsOutputHeaders = [
  { id: "project_name", title: "Project Name" },
  { id: "display_name", title: "Dislay Name" },
  { id: "project_leader", title: "Project Leader" },
  { id: "slack_ username", title: "Slack Username" },
  { id: "github_username", title: "Github Username" },
  { id: "linkedin_url", title: "LinkedIn URL" },
  { id: "role", title: "Member's Role" },
  { id: "pay_per_day", title: "Pay Per Day" },
  { id: "pay", title: "Is User Getting Paid?" },
  { id: "account_number", title: "Account Number" },
  { id: "net_balance", title: "Net Balance" },
  { id: "balance", title: "Balance" },
];
