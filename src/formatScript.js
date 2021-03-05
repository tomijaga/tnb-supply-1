import { readCsv, writeCsv } from "./utils/csv.js";
import { tasksInputHeaders, projectTeamsInputHeaders } from "./csvs/headers.js";
import { isAccountValid } from "./utils/account.js";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tasksObject = {};

const runScript = async () => {
  //get and Store all contributors
  await storeContributors();

  //Add the Account Number to Each Task
  await formatTasks();

  //Replace TNB MEMBER with the user's account number
  await formatProjectTeams();
};

runScript();

async function storeContributors() {
  let contributorsArray = await readCsv(
    path.join(__dirname, "csvs/input/contributors.csv")
  );

  for (let i = 0; i < contributorsArray.length; i++) {
    const contributor = contributorsArray[i];
    const username = contributor.github_username.toLowerCase();
    tasksObject[username] = contributor.account_number;
  }
}

async function formatTasks() {
  let tasks = await readCsv(path.resolve(__dirname, "csvs/input/tasks.csv"));

  // console.log(tasksObject);
  tasks.map((task) => {
    const username = task.completed_by.toLowerCase();
    if (tasksObject[username]) {
      task.account_number = tasksObject[username];
    }
    if (!task.bug_bounty) {
      task.bug_bounty = "TRUE";
    }
  });

  await writeCsv(
    path.resolve(__dirname, "csvs/input/tasks.csv"),
    tasksInputHeaders,
    tasks
  );
}

async function formatProjectTeams() {
  let projectTeams = await readCsv(
    path.resolve(__dirname, "csvs/input/project-teams.csv")
  );
  const teams = await readCsv(path.resolve(__dirname, "csvs/input/teams.csv"));

  const projectsObject = {};
  const teamsObject = {};

  const filterAndVerifyAccounts = (projectTeam) => {
    if (!projectTeam["PROJECT NAME"]) {
      //removes this projectTeam because it is empty
      return false;
    }

    projectTeam["GITHUB USERNAME"] = projectTeam["GITHUB USERNAME"].replace(
      "@",
      ""
    );

    const gitub_username = projectTeam["GITHUB USERNAME"].toLowerCase();

    //If account number is not valid
    if (!isAccountValid(projectTeam["ACCOUNT NUMBER"])) {
      //Check for user's account on contributors list
      if (isAccountValid(tasksObject[gitub_username])) {
        //get account number from prvios contributions
        projectTeam["ACCOUNT NUMBER"] = tasksObject[gitub_username];

        //Check if user is one two projects
      } else if (projectsObject[gitub_username]) {
        //get account number from oter projects
        projectTeam["ACCOUNT NUMBER"] = username[gitub_username];
      } else {
        if (Object.values(teamsObject).length === 0) {
          for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            teamsObject[team.github_username.toLowerCase()] =
              team.account_number;
          }

          // console.log(teamsObject);
        }

        if (teamsObject[gitub_username]) {
          projectTeam["ACCOUNT NUMBER"] = teamsObject[gitub_username];
        }
      }

      //If account number is valid store it
    } else {
      projectsObject[gitub_username] = projectTeam["ACCOUNT NUMBER"];
    }

    return true;
  };

  projectTeams = projectTeams.filter(filterAndVerifyAccounts);

  await writeCsv(
    path.resolve(__dirname, "csvs/input/project-teams.csv"),
    projectTeamsInputHeaders,
    projectTeams
  );
}
