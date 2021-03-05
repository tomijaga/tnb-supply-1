import neatCsv from "neat-csv";
import csvWriter from "csv-writer";
import fs from "fs";
import {
  Account,
  PrimaryValidator,
  ConfirmationValidator,
} from "../thenewboston-js/dist/index.js";

import {
  projectTeamsOutputHeaders,
  tasksOutputHeaders,
  teamsOutputHeaders,
} from "./csvs/headers.js";

import { readCsv, writeCsv } from "./utils/csv.js";
import { isAccountValid } from "./utils/account.js";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paymentAccounts = [
  "23676c35fce177aef2412e3ab12d22bf521ed423c6f55b8922c336500a1a27c5", //TREASURY (new)
  "6ad6deef2a65642a130fb081dacc2010c7521678986ed44b53a845bc00dd3924", //TREASURY
  "9bfa37627e2dba0ae48165b219e76ceaba036b3db8e84108af73a1cce01fad35", //TREASURY (old)
  "f0fe0fdff41db888a0938882502ee809f6874c015aa09e11e38c8452d4175535", // Payments (Taiwo Odetola)
  "addf211d203c077bc5c6b78f41ddc68481804539de4bd3fd736fa853514551c0", // Payments (Rajput Usman)
  "c536b7717f4c3e3b864e384c2156a44f952223326bc0eab4f2f8be1a34bc2e6d", // Payments (Nikhil Taneja)
  "9cb647da9ea1445c361e6d734a6ee0fce4896230392947713686697dd586495b", // Payments (Tawanda Makunike)
  "0d304450eae6b5094240cc58b008066316d9f641878d9af9dd70885f065913a0", // Held lot of value in past, now has 0
  "ca85c141c945866dd32af37ad669855458eb3f9e5d1a4530d852c3c745de11a7", // Held lot of value in past, now has 0
  "a7381dce0249efc26130dd226ecc0df3154009a0210adc4cac869e4a2cb92d65", // Held lot of value in past, now has 0
  "0c9e43fd6630e213a088bf816425c294248ae496129dadb03137c151a2a22ff6", // Held lot of value in past, now has 0
  "67077b2397f99fb6c63185af25cdf49d43736b22b7ea5dd68089a04cd4dbf8cf",
];

let allAccounts = [];
let tasks = [];
let projectTeams = [];
let teams = [];
let accountsOnBothTeams = [];

const errorAccounts = [];

const tnbSupply = [];

const accountsForTeamMembers = {};
const accountsForNonTeamMembers = {};

const pvURL = "http://54.241.124.162";
const pv = new PrimaryValidator(pvURL);

runScript();

async function runScript() {
  //read Csvs
  tasks = await readCsv(path.join(__dirname, "csvs/input/tasks.csv"));
  teams = await readCsv(path.join(__dirname, "csvs/input/teams.csv"));
  projectTeams = await readCsv(
    path.join(__dirname, "csvs/input/project-teams.csv")
  );

  //Get All Accounts on the Network
  await getAllAccounts();

  console.log("Looking for account on Both Teams:");
  searchForProjectsAndTeamAccounts();

  getAccountsForTeamMembers();
  getAccountsForNonTeamMembers();

  console.log(
    "non team members length",
    Object.values(accountsForNonTeamMembers).length
  );

  //
  subtractAmountPaidForTasks();

  calculateTnbSupply();

  const verifyErrorAccounts = () => {
    console.log(errorAccounts);
    errorAccounts.map((account) => {
      Promise.all(
        allAccounts.map((pvAccount) => {
          if (pvAccount.account_number == account) {
            pv.get;
            console.log("found", pvAccount);
          }
        })
      );
    });
  };

  verifyErrorAccounts();

  //write output csv files
  await writeCsv(
    "src/csvs/output/tnb-supply.csv",
    [
      { id: "section", title: "Section" },
      { id: "amount", title: "Amount" },
      { id: "percentage", title: "Percentage" },
    ],
    tnbSupply
  );

  await writeCsv(
    "src/csvs/output/accounts-on-both-teams.csv",
    [
      { id: "github_username", title: "Github Username" },
      { id: "teams", title: "Teams" },
      { id: "account_number", title: "Account Number" },
      { id: "net_balance", title: "Net Balance" },
      { id: "balance", title: "Balance" },
    ],
    accountsOnBothTeams
  );

  await writeCsv("src/csvs/output/teams.csv", teamsOutputHeaders, teams);

  await writeCsv(
    "src/csvs/output/project-teams.csv",
    projectTeamsOutputHeaders,
    projectTeams
  );
}

async function getAllAccounts() {
  const options = pv.options.defaultPagination;
  options.limit = 100;

  const getNext = async (next) => {
    next = next.split(pvURL)[1];
    return await pv.getData(next);
  };

  let data = await pv.getAccounts(options);
  allAccounts = [...allAccounts, ...data.results];

  while (data.next !== null) {
    data = await getNext(data.next);
    allAccounts = [...allAccounts, ...data.results];
  }
}

function filterArrayByIndexes(arr, indexes) {
  return arr.filter((element, i) => {
    // if (indexes.includes(i)) console.log("deleted", element.github_username);
    return !indexes.includes(i);
  });
}

function searchForProjectsAndTeamAccounts() {
  const projectTeamAccounts = {};
  const onBothObject = {};

  const teamsFilterList = [];
  const projectTeamsFilterList = [];

  projectTeams.map((project, projectIndex) => {
    //if user appears on two or more projects
    if (projectTeamAccounts.hasOwnProperty(project.account_number)) {
      if (onBothObject.hasOwnProperty(project.account_number)) {
        const onBoth = onBothObject[project.account_number];
        onBoth.teams.push(project.project_name);
        projectTeamsFilterList.push(projectIndex);
        console.log("onBothTeams:", project.github_username);
      } else {
        const previousIndex = projectTeamAccounts[project.account_number];

        const onBoth = {
          teams: [
            project.project_name,
            projectTeams[previousIndex].project_name,
          ],
          github_username: project.github_username,
          account_number: project.account_number,
        };

        accountsOnBothTeams.push(onBoth);
        onBothObject[project.account_number] = onBoth;
        console.log("onBothTeams:", project.github_username);
        projectTeamsFilterList.push(projectIndex);
        projectTeamsFilterList.push(previousIndex);
      }
    }

    if (isAccountValid(project.account_number)) {
      projectTeamAccounts[project.account_number] = projectIndex;
    }
  });

  teams.map((team, teamIndex) => {
    if (projectTeamAccounts.hasOwnProperty(team.account_number)) {
      if (onBothObject.hasOwnProperty(team.account_number)) {
        const onBoth = onBothObject[team.account_number];
        onBoth.teams.push(team.team);
        projectTeamsFilterList.push(teamindex);
        console.log("onBothTeams:", project.github_username);
      } else {
        const projectIndex = projectTeamAccounts[team.account_number];
        const onBoth = {
          teams: [team.team, projectTeams[projectIndex].project_name],
          github_username: team.github_username,
          account_number: team.account_number,
        };

        accountsOnBothTeams.push(onBoth);
        console.log("onBothTeams:", team.github_username);
        teamsFilterList.push(teamIndex);
        projectTeamsFilterList.push(projectIndex);
      }
    }
  });

  //remove accounts that show up on both teams list and projectTeams
  teams = filterArrayByIndexes(teams, teamsFilterList);
  projectTeams = filterArrayByIndexes(projectTeams, projectTeamsFilterList);
}

function getAccountsForTeamMembers() {
  const addToContributors = (data) => {
    let contributor = accountsForTeamMembers[data.account_number];
    if (contributor === undefined) {
      accountsForTeamMembers[data.account_number] = data;
    }
  };

  teams.map((team) => {
    addToContributors(team);
  });

  projectTeams.map((projectTeam) => {
    addToContributors(projectTeam);
  });

  accountsOnBothTeams.map((onBoth) => {
    addToContributors(onBoth);
  });
}

function getAccountsForNonTeamMembers() {
  allAccounts.map((tnbAccount) => {
    const contributorAccount =
      accountsForTeamMembers[tnbAccount.account_number];
    const isNotAPaymentAccount = !paymentAccounts.includes(
      tnbAccount.account_number
    );
    if (isNotAPaymentAccount) {
      if (contributorAccount === undefined) {
        accountsForNonTeamMembers[tnbAccount.account_number] = {
          ...tnbAccount,
          net_balance: tnbAccount.balance,
        };
      } else {
        contributorAccount.balance = tnbAccount.balance;
        contributorAccount.net_balance = tnbAccount.balance;
      }
    }
  });
}

function subtractAmountPaidForTasks() {
  tasks.map((task) => {
    const teamMember = accountsForTeamMembers[task.account_number];
    if (teamMember !== undefined) {
      teamMember.net_balance -= Number(task.amount_paid);
    } else {
      const nonTeamMember = accountsForNonTeamMembers[task.account_number];
      if (nonTeamMember) {
        nonTeamMember.net_balance -= Number(task.amount_paid);
      } else {
        // console.log("ERROR: Cannot Find Account", task);
        errorAccounts.push(task.account_number);
      }
    }
  });
}

function calculateTotal(arr, key) {
  let total = 0;
  arr.map((item) => {
    if (Number.isNaN(Number(item[key]))) {
      console.log(
        "ERROR while calculating total: ",
        item,
        item.github_username,
        item[key]
      );
      errorAccounts.push(item.account_number);
    } else {
      total += Number(item[key]);
    }
  });
  return total;
}

const calculatePercentage = (total, share) =>
  Number(((share * 100) / total).toFixed(2));

function calculateTnbSupply() {
  console.log("calculating Supply for tasks...");
  tnbSupply[0] = {
    section: "tasks",
    amount: calculateTotal(tasks, "amount_paid"),
  };

  console.log("calculating Supply for teams...");
  tnbSupply[1] = {
    section: "teams",
    amount: calculateTotal(teams, "net_balance"),
  };

  console.log("calculating Supply for accountsOnBothTeams...");
  tnbSupply[2] = {
    section: "onBothTeams",
    amount: calculateTotal(accountsOnBothTeams, "net_balance"),
  };

  console.log("calculating Supply for projectTeams...");
  tnbSupply[3] = {
    section: "projectTeams",
    amount: calculateTotal(projectTeams, "net_balance"),
  };

  console.log("calculating Supply for nonTeamMemebers...");
  tnbSupply[4] = {
    section: "nonTeamMembers",

    amount: calculateTotal(
      Object.values(accountsForNonTeamMembers),
      "net_balance"
    ),
  };

  const total = Object.values(tnbSupply).reduce(
    (acc, section) => acc + section.amount,
    0
  );

  //CalculatePercentages
  tnbSupply.map((section) => {
    section.percentage = calculatePercentage(total, section.amount);
  });

  console.log(tnbSupply);
  console.log({ total });

  const all = allAccounts.reduce((acc, account) => {
    if (paymentAccounts.includes(account.account_number)) {
      return acc;
    }
    return acc + account.balance;
  }, 0);

  console.log({ accTotal: all });
}
