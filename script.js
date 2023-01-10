let toDoItems = [];

// Functia care afiseaza elementele, dupa ce le da anumite atribute
function displayToDo(todo) {
    localStorage.setItem('todoItemsRef', JSON.stringify(toDoItems));

    const list = document.querySelector(".todoList");
    const item = document.querySelector(`[data-key='${todo.id}']`);
    
    if (todo.deleted) {
        item.remove();
        calculateTasks();
        return;
    }

    const isChecked = todo.checked ? 'checked' : '';
    const node = document.createElement("li");
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
    <input id="${todo.id}" type="checkbox" class="check"/>
    <span class="text_list">${todo.text}</span>
    <button class=deleteButton>X</button>`;

    if (item) {
        list.replaceChild(node, item);
    }
    else {
        list.append(node);
    }
    
    calculateTasks();
}

// Functia care creeaza un element nou, care trebuie afisat
function addToDo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };
    toDoItems.push(todo);
    displayToDo(todo);
}

// Functia care face un element completat
function toggleDone(key) {
    const index = toDoItems.findIndex(item => item.id === Number(key));
    toDoItems[index].checked = !toDoItems[index].checked;
    displayToDo(toDoItems[index]);
}

// Functia care sterge un element din toDoItems, si afiseaza restul
function deleteTodo(key) {
    const index = toDoItems.findIndex(item => item.id === Number(key));
    const todo = {
        deleted: true,
        ...toDoItems[index]     // preia toate atributele elementului curent
    };
    toDoItems = toDoItems.filter(item => item.id !== Number(key));
    displayToDo(todo);
}

// Event care preia textul introdus in input
const form = document.querySelector(".todo-form");
form.addEventListener('submit', event => {
    event.preventDefault();
    const inputText = document.querySelector(".todo-form input");
    const text = inputText.value;

    if (text !== '') {
        addToDo(text);
        inputText.value = '';
        inputText.focus();
    }
    else {
        alert("You must write something in the textbox!");
    }
});

// Event care verifica care buton este apasat (checkbox sau delete)
const list = document.querySelector("ul");
list.addEventListener('click', event => {
    if (event.target.classList.contains('check')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if (event.target.classList.contains('deleteButton')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
});

// Local Storage
document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItemsRef');
    if (ref) {
        toDoItems = JSON.parse(ref);
        toDoItems.forEach(t => {
            displayToDo(t);
        });
    }
});

// Functia pentru filtrare ALL
function showAll() {
    let items = document.getElementsByClassName('todo-item');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'block';
    }
}

// Functia pentru filtrare ACTIVE
function showActive() {
    let items = document.getElementsByClassName('todo-item');
    let dones = document.getElementsByClassName('checked');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'block';
    }
    for (let i = 0; i < dones.length; i++) {
        dones[i].style.display = 'none';
    }
}

// Functia pentru filtrare COMPLETED
function showCompleted() {
    let items = document.getElementsByClassName('todo-item');
    let dones = document.getElementsByClassName('checked');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'none';
    }
    for (let i = 0; i < dones.length; i++) {
        dones[i].style.display = 'block';
    }
}

// Functia pentru stergerea tuturor elementelor "checked"
function clearCompleted() {
    let dones = document.getElementsByClassName('checked');
    for (let i = 0; i < dones.length; i++) {
        const itemKey = dones[i].dataset.key;
        i--;
        deleteTodo(itemKey);
    }
}

// Functie care verifica numarul de task-uri in functie de starea lor
function calculateTasks() {
    let total = 0;
    let completed = 0;
    let myNodeList = document.getElementsByTagName("li");
    for (let i = 0; i < myNodeList.length; i++) {
        total++;
        if (myNodeList[i].className === "todo-item checked") {
            completed++;
        }
    }
    let status = document.querySelector(".tasks")
    if (total === completed) {
        status.innerHTML = `All tasks are done, congratulations!`;
    } else {
        status.innerHTML = `${total} Total, ${completed} Complete and ${total - completed} Pending`;
    }
}