const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var employees = [];

//create questions for inquirer to prompt
const employeeType = {
    type: "rawlist",
    name: "newEmployee",
    message: "What kind of employee are you adding?",
    choices: ["Manager", "Engineer", "Intern"],
};

const anotherEmployee = {
    type: "rawlist",
    name: "anotherEmployee",
    message: "Want to add another employee?",
    choices: ["Yes", "No"],
};

//create and call a function allowing user to select employee type
function selectEmployee() {
    inquirer.prompt(employeeType).then((answers) => {
        if (answers.newEmployee === "Manager") {
            console.log("Adding a manager.");
        } else if (answers.newEmployee === "Engineer") {
            console.log("Adding an engineer.");
        } else {
            console.log("Adding an intern.");
        }
        //create an instance of the selected employee type
        newEmployee(answers.newEmployee);
    });
};
selectEmployee();

//gathers employee information from user
function newEmployee(selectedEmployeeType) {
    async function userInputs() {
        
        //generic questions for all employee types
        const userInput = await inquirer.prompt([
            {
                type: "input", message: "Employee name:", name: "name"
            },
            {
                type: "input", message: "Employee ID number:", name: "id"
            },
            {
                type: "input", message: "Employee email address:", name: "email"
            }]);

        //specialized questions per employee type
        //then pushes new employee to array to be rendered in HTML, then asks if user wants to add another employee
        if (selectedEmployeeType === "Manager") {
            const managerOffice = await inquirer.prompt([
                {
                    type: "input", message: "Office number:", name: "officeNumber"
                }])
            const newManager = new Manager(userInput.name, userInput.id, userInput.email, managerOffice.officeNumber);
            employees.push(newManager);
            anotherEmployeePrompt();
        } else if (selectedEmployeeType === "Engineer") {
            const engineerGithub = await inquirer.prompt([
                {
                    type: "input",
                    message: "Github:",
                    name: "github"
                }])
            const newEngineer = new Engineer(userInput.name, userInput.id, userInput.email, engineerGithub.github);
            employees.push(newEngineer);
            anotherEmployeePrompt();
        } else if (selectedEmployeeType === "Intern") {
            const internSchool = await inquirer.prompt([
                {
                    type: "input",
                    message: "Name of school or university:",
                    name: "school"
                }])
            const newIntern = new Intern(userInput.name, userInput.id, userInput.email, internSchool.school);
            employees.push(newIntern);
            anotherEmployeePrompt();
        }
        
        //asks if user wants to create another employee
        //if yes, does that; if not, sends the array of employees to outputTeamHTML
        function anotherEmployeePrompt() {
            inquirer.prompt(anotherEmployee).then((answers) => {
                if (answers.anotherEmployee === "Yes") {
                    console.log("Adding another employee.");
                    selectEmployee();
                } else {
                    outputTeamHTML(employees);
                }
            });
        }
    }
    userInputs();
}

//renders employee data as HTML
const outputTeamHTML = async (employees) => {
    try {
        const employeeHTML = await render(employees);
        fs.writeFile(outputPath, employeeHTML, (err) => {
            if (err) {
                throw err;
            } else {
                console.log("Success. See team.html");
            }
        } 
        )}catch (error) {
                throw error;
        };
};

// next steps before showcasing:
// after you answer "do you want to create another"
// create "view employees, edit employees, quit"
