import { TodoItem } from "./todoItem";
import { TodoCollection } from "./todoCollection";
import { JsonTodoCollection } from "./jsonTodoCollection";
import * as inquirer from 'inquirer'

let todos = [
    new TodoItem(1, "Kupic kwaity"), new TodoItem(2,"Odebrac buty"),
    new TodoItem(3,"Zamowic bilety"), new TodoItem(4,"Zadzownic do Janka", true)];


let collection: TodoCollection = new JsonTodoCollection("Adam",todos);
let showCompleted = true;
console.clear();

function displayTodoList(): void {
    console.log(`Lista ${collection.userName}'a`
            + ` (lista zadan pozostalych do zrobienia: ${ collection.getItemsCounts().incomplete})`);
            collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
        }
enum Commands{
    Add = "Dodaj nowe zadanie",
    Complete = "Wykonanie zadanie",
    Toggle = "Pokaz lub ukryj wykonane",
    Purge = "Usun wykonane zadania",
    Quit = "Koniec"
}

function promptAdd(): void{
    console.clear();
    inquirer.prompt({type: "input", name: "add", message:"Podaj zadanie:"})
        .then(answers => {if(answers["add"] !== ""){
            collection.addTodo(answers["add"]);
        }
        promptUser();
    })
}

function promptComplete(): void {
    console.clear();
    inquirer.prompt({type: "checkbox", name:"complete", message:"Oznaczenie zadan jako wykonanych",
        choices: collection.getTodoItems(showCompleted).map(item => ({ name: item.task, value: item.id, checked: item.complete}))})
        .then(answers => {
            let completedTasks = answers["complete"] as number [];
            collection.getTodoItems(true).forEach(item => collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
            promptUser();
        })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Wybierz opcje",
        choices: Object.values(Commands)
    }).then(answers => {
        switch(answers["command"]){
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if(collection.getItemsCounts().incomplete > 0){
                    promptComplete();
                }else{
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;    
        }
    })
}
promptUser();