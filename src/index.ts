import {v4 as uuidV4} from "uuid";

type Task = {
    id:string, 
    title:string,
    completed:boolean, 
    createdAt:Date
}

const list = document.querySelector<HTMLUListElement>('#task-list');
const form =  document.querySelector<HTMLUListElement>('#new-task-form');
const input = document.querySelector<HTMLInputElement>('#new-task-title');

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener('submit', e =>{
    e.preventDefault();
   
    if(input?.value == "" || input?.value == null ) return;

    const newTask: Task = {
        id: uuidV4(),
        title: input.value,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(newTask);
    addListItem(newTask)
    input.value="";
})

function addListItem(task: Task) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    const controlPanel = document.createElement('div');
    const deleteIcon = document.createElement('i');

    item.dataset.taskId = task.id;

    checkbox.type="checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener('change', () =>{
        task.completed = checkbox.checked;
        saveTasks();
    })
    
    deleteIcon.classList.add('fa-solid','fa-trash');
    deleteIcon.title='Delete Task';
    deleteIcon.addEventListener('click', e => {
        removeTask(task);
    })

    controlPanel.classList.add('control-panel');
    controlPanel.append(deleteIcon);

    label.append(checkbox, task.title);
    item.append(label, controlPanel);
    list?.append(item);
    saveTasks();
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");

    if(taskJSON == null) return []; 
    
    return JSON.parse(taskJSON);
     
}

function removeTask(task: Task){
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        removeListItem(task);
        saveTasks();
    }

}

function removeListItem(task: Task) {
    const elTask = document.querySelector(`li[data-task-id="${task.id}"]`);
    if (elTask) {
        elTask.remove();
    }
}