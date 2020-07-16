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

function main() {

}
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

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

function selectEmployee() {
    inquirer.prompt(employeeType).then((answers) => {
        if (answers.newEmployee === "Manager") {
            console.log("Adding a manager.");
        } else if (answers.newEmployee === "Engineer") {
            console.log("Adding an engineer.");
        } else {
            console.log("Adding an intern.");
        }
        newEmployee(answers.newEmployee);
    });
};
selectEmployee();


function newEmployee(selectedEmployeeType) {
    async function userInputs() {
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
        var generatedEmployee = [userInput.name, userInput.id, userInput.email];
        employees.push([generatedEmployee]);
        
        function anotherEmployeePrompt() {
            inquirer.prompt(anotherEmployee).then((answers) => {
                if (answers.anotherEmployee === "Yes") {
                    console.log("Adding another employee.");
                    selectEmployee();
                } else {
                    console.log("no more employees");
                    console.log(employees);
                    outputTeamHTML(employees);
                }
            });
        }
    }
    userInputs();
}

const outputTeamHTML = async (employees) => {
    try {
        const employeeHTML = await render(employees);
        fs.writeFile(outputPath, employeeHTML, (err) => {
            if (err) {
                throw err;
            } else {
                console.log("success");
            }
        } 
        )}catch (error) {
                throw error;
        };
};
