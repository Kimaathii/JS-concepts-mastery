//initiating the instance of store
const storedData = createStore();

//initiate all the DOM required element
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterAllBtn = document.getElementById('filter-all');
const filterActiveBtn = document.getElementById('filter-active');
const filterCompletedBtn = document.getElementById('filter-completed');
const undoBtn = document.getElementById('undo-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const taskCount = document.getElementById('task-count');

// After getting DOM elements
filterAllBtn.classList.add('active');

function render(){
    taskList.innerHTML = '';
    let currentTask = storedData.getTasks();
    currentTask.forEach(taskItems => {
        let newTaskItemList = document.createElement('li');
        newTaskItemList.className = "task-item";

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.id = `${taskItems.id}`;

        if(taskItems.done === true){
            checkbox.checked = true;
            newTaskItemList.classList.add('completed');  // ✅ Add this
        }

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = `${taskItems.text}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.dataset.id = `${taskItems.id}`;
        deleteBtn.textContent = 'Delete';

        newTaskItemList.appendChild(checkbox);
        newTaskItemList.appendChild(span);
        newTaskItemList.appendChild(deleteBtn);
        taskList.appendChild(newTaskItemList);

       
    })
    //update count
    const activeCount = storedData.getState().tasks.filter(t => !t.done).length;
    taskCount.textContent = `${activeCount} task(s) remaining`
}


storedData.subscribe(render)

function handleAddTask(){
    let inputValue = taskInput.value.trim();
    if(inputValue !== ""){
        storedData.addTask(inputValue);
        taskInput.value = '';
        taskInput.focus();
    }

}

addBtn.addEventListener('click', handleAddTask);

//handle enter key

taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        handleAddTask();
    }
})


//toggle

taskList.addEventListener('click', (e)=> {
    if(e.target.type === 'checkbox'){
        const clickedId = Number(e.target.dataset.id);
        storedData.toggleTask(clickedId)


    }
    if(e.target.classList.contains('delete-btn')){
        const clickedId = Number(e.target.dataset.id);
        storedData.deleteTask(clickedId)
    }
})

function handleFilter(filterValue){
   let filtered =  storedData.setFilter(filterValue);
   //update button style
   filterAllBtn.classList.remove('active');
   filterActiveBtn.classList.remove('active');
   filterCompletedBtn.classList.remove('active')

    // Add active class to clicked button
    if (filterValue === 'all') filterAllBtn.classList.add('active');
    if (filterValue === 'active') filterActiveBtn.classList.add('active');
    if (filterValue === 'completed') filterCompletedBtn.classList.add('active');
}

// Attach listeners
filterAllBtn.addEventListener('click', () => handleFilter('all'));
filterActiveBtn.addEventListener('click', () => handleFilter('active'));
filterCompletedBtn.addEventListener('click', () => handleFilter('completed'));

clearCompletedBtn.addEventListener('click', () => {
    storedData.clearCompleted();
});


// At the bottom of app.js
render();