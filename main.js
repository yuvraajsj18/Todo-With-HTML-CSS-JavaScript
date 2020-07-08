'use strict';

// Contains attributes of form
const todoForm = {
    form: document.querySelector('#todo-form'),
    taskInput: document.querySelector('#task-input'),
    addBtn: document.querySelector('#add-btn'),
};

// contains the html element of todos list and an array containing the all tasks in todo list
const todoList = {
    listElement: document.querySelector('#todo-list'),
    listArray: new Array(),
    number_of_tasks: 0,
};

// represent todo list item with its task its completion and controls and the associated HTML list element
class TodoListItem {
    static li_classes = ['todo-list-item','list-group-item', 'rounded-lg', 'mb-3','d-flex', 'align-items-center', 'justify-content-between', 'animate__animated', 'animate__fadeInDown'];

    constructor(task, isDone = false, id = todoList.number_of_tasks) {
        todoList.number_of_tasks++;
        this.listItem = {
            task,
            isDone, 
            id,
        }

        todoList.listArray.push(this.listItem);

        this.li = document.createElement('li');
        // add classes to li
        this.constructor.li_classes.forEach((item) => {
            this.li.classList.add(item);
        });
        this.ifDone(this.listItem.isDone);


        // add task to the list item element
        this.taskElement = this.makeTask();
        this.li.appendChild(this.taskElement);

        // add controls to the list item element
        this.controls = new Controls(this.li, this);
        this.controlDiv = this.controls.getControls();
        this.li.appendChild(this.controlDiv);

        // adding item to listElement(ul)
        todoList.listElement.appendChild(this.li);
    }

    // creates span element with task in it
    makeTask() {
        const span = document.createElement('span');
        span.classList.add('todo-list-task', 'lead');
        span.innerText = this.listItem.task;
        span.id = `task-${this.listItem.id}`

        return span;
    }

    ifDone(check) {
        if (check) {
            this.li.classList.add('list-group-item-success');
            this.li.style.textDecoration = "line-through";
        }
        else
        {
            this.li.classList.remove('list-group-item-success');
            this.li.style.textDecoration = "none";
            // creates span element with task in it
        }
    }
}

class Controls {
    // needs id to create a unique label for each checkbox
    // create the controls for marking a task done and removing a task
    constructor(parentElement, item) {
        this.parentElement = parentElement;
        this.item = item;
        this.controlDiv = this.createControlDiv();
        
        this.doneCheckbox = this.createDoneCheckbox();
        this.controlDiv.appendChild(this.doneCheckbox);

        this.removeBtn = this.createRemoveBtn();
        this.controlDiv.appendChild(this.removeBtn);
    }

    getControls() {
        return this.controlDiv;
    }

    createControlDiv() {
        const div = document.createElement('div');
        div.classList.add('controls');
        return div;
    }

    createDoneCheckbox() {
        // container for checkbox
        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('custom-control', 'd-inline', 'custom-checkbox');

        // creates checkbox input
        const checkboxInput = document.createElement('input');
        checkboxInput.setAttribute('type', 'checkbox');
        checkboxInput.classList.add('custom-control-input', 'done-checkbox');
        checkboxInput.setAttribute('name', 'done-btn');
        checkboxInput.id = `done-${this.item.listItem.id}`

        // event listener for checkbox
        checkboxInput.addEventListener('click', (e) => {
            if (checkboxInput.checked)
            {
                this.item.listItem.isDone = true;
            }
            else
            {
                this.item.listItem.isDone = false;
            }
            this.item.ifDone(this.item.listItem.isDone);
        });

        // checkbox label
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('custom-control-label', 'done-label');
        checkboxLabel.setAttribute('for', checkboxInput.id);

        checkboxContainer.appendChild(checkboxInput);
        checkboxContainer.appendChild(checkboxLabel);

        return checkboxContainer;
    }

    createRemoveBtn() {
        const removeBtn = document.createElement('span');
        removeBtn.classList.add('material-icons', 'text-danger', 'remove-btn');
        removeBtn.innerText = "remove_circle_outline";
        removeBtn.id = `remove-${this.item.listItem.id}`

        removeBtn.addEventListener('click', (e) => {
            this.parentElement.classList.add('animate__fadeOutDown');

            this.parentElement.addEventListener('animationend', (e) => {
                const index_of_item = todoList.listArray.indexOf(this.item.listItem);
                todoList.listArray.splice(index_of_item, 1);
                localStorage.setItem('todoList', JSON.stringify(todoList.listArray));
                this.parentElement.remove();
            });
        });

        return removeBtn;
    }
}

// updating todo list on new entry/refresh
// adding existing list items to todo list when page opened/refreshed

if (localStorage.getItem('todoList'))
{
    const previousArray = JSON.parse(localStorage.getItem('todoList'));
    previousArray.forEach((item) => {
        new TodoListItem(item.task, item.isDone);
    });
}

todoForm.form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (todoForm.form.checkValidity() === false) {
        form.classList.add('was-validated');
        return;
    }

    const todoItem = new TodoListItem(todoForm.taskInput.value);
    localStorage.setItem('todoList', JSON.stringify(todoList.listArray));

    todoForm.taskInput.value = "";
    todoForm.form.classList.remove('was-validated');
});