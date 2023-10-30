// src/index.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import createBanner from 'node-banner';
import * as fs from 'fs';
let todos: {
  text: any; done: boolean; 
}[] = [];
const todosFile = 'todos.json';
function loadTodos() {
    try {
        const data = fs.readFileSync(todosFile, 'utf-8');
        todos = JSON.parse(data);
        console.log(todos);
    }
    catch (err) {
        todos = [];
    }
}
function saveTodos() {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}
function showTodoTable() {
    if (todos.length === 0) {
        console.log(chalk.blue('No todos in the list.'));
    }
    else {
        console.log(chalk.yellowBright('To-Do Table:'));
        console.log(chalk.cyan('------------------------------------------'));
        console.log(chalk.cyan('|   Index   |   Status   |   To-Do Task   |'));
        console.log(chalk.cyan('------------------------------------------'));
        todos.forEach((todo, index) => {
            const status = todo.done ? chalk.green('  Done  ') : chalk.red('Not Done');
            console.log(`|    ${index + 1}      | ${status}   |     ${todo.text}       |`);
        });
        console.log(chalk.cyan('------------------------------------------'));
    }
}
async function addTodo() {
    const { todo } = await inquirer.prompt([
        {
            type: 'input',
            name: 'todo',
            message: 'Enter a new to-do task:',
        },
    ]);
    todos.push({ text: todo, done: false });
    saveTodos();
    console.log(chalk.green('To-Do task added!'));
}
async function markTodoAsDone() {
    showTodoTable();
    const { index } = await inquirer.prompt([
        {
            type: 'number',
            name: 'index',
            message: 'Enter the index of the completed to-do task:',
        },
    ]);
    if (index >= 1 && index <= todos.length) {
        todos[index - 1].done = true;
        saveTodos();
        console.log(chalk.green('To-Do task marked as done!'));
    }
    else {
        console.log(chalk.red('Invalid index. Please try again.'));
    }
}
async function deleteTodo() {
    showTodoTable();
    const { index } = await inquirer.prompt([
        {
            type: 'number',
            name: 'index',
            message: 'Enter the index of the to-do task to delete:',
        },
    ]);
    if (index >= 1 && index <= todos.length) {
        todos.splice(index - 1, 1);
        saveTodos();
        console.log(chalk.green('To-Do task deleted!'));
    }
    else {
        console.log(chalk.red('Invalid index. Please try again.'));
    }
}
async function main() {
    loadTodos();
    const banner = await createBanner("To-Do List", "A to-do list application with additional functionalities.", "yellow", "red");
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Add a to-do task', 'Show to-do table', 'Mark to-do task as done', 'Delete to-do task', 'Quit'],
            },
        ]);
        if (action === 'Add a to-do task') {
            await addTodo();
        }
        else if (action === 'Show to-do table') {
            showTodoTable();
        }
        else if (action === 'Mark to-do task as done') {
            await markTodoAsDone();
        }
        else if (action === 'Delete to-do task') {
            await deleteTodo();
        }
        else if (action === 'Quit') {
            console.log(chalkAnimation.rainbow('Goodbye!'));
            process.exit(0);
        }
    }
}
main();
