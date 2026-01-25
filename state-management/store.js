//create the createStore function
    //private variables- state, subscribe and history
        //state{task[] and filter:"all"}
        //subscribers[]
        //history[]
    //return {
    //add subscribe(callback(parameter)){}
    //add notify method {loops through subscriber array, call each subscriber function}
    //add getstate(return state variable)
    //add getTasks(return different task basued on state.filter
    // use if statement to check all, active and completed task)
    //addtask(task text){create new task object, add task to the state.tasks, call this.notify}
    //
    //}

function createStore(){
    let state = {
        tasks: [],
        filter: 'all',
    };
    let subscribers = [];
    let history = [];
    
    return {
        //subscribe method
        subscribe: function(callback){
            subscribers.push(callback)
        },
        //notify method
        notify: function(){
            subscribers.forEach(callbackFunction => {
                callbackFunction();
            })
        },
        //add getState method
        getState: function(){
            return state;
        },
        //add getTask
        getTasks: function(){

            switch(state.filter){
                case 'all' : return state.tasks;
                case 'active' : 
                    return state.tasks.filter(task => task.done === false);
                case 'completed' :
                    return state.tasks.filter(task => task.done === true);
                default : return state.tasks;

                        
            }
           
        },
        addTask: function(text){
            let newTask = {
                id: Date.now(),
                text: text,
                done: false
            };
            state.tasks = [...state.tasks, newTask];
            this.notify()

        },
        toggleTask: function (id) {
            state.tasks = state.tasks.map(task => {  // ← ASSIGN!
                if (task.id === id) {
                    return { ...task, done: !task.done };  // ← NEW OBJECT!
                }
                return task;
            });
            this.notify();
        },
        deleteTask: function(id){
            state.tasks = state.tasks.filter(task => task.id !== id);
            this.notify();
        },
        clearCompleted: function(){
            state.tasks = state.tasks.filter(task => task.done === false);
            this.notify();
        },
        setFilter: function (filterValue) {
            state.filter = filterValue;
            this.notify();
        }

    };
    
}
// Create store
const store = createStore();

// Subscribe to changes
store.subscribe(() => {
    console.log('📢 State changed!');
    console.log('Tasks:', store.getTasks());
    console.log('---');
});

// Test 1: Add tasks
console.log('TEST 1: Adding tasks');
store.addTask('Learn State Management');
store.addTask('Build Todo App');
store.addTask('Master JavaScript');

// Test 2: Toggle task
console.log('TEST 2: Toggle first task');
const firstTaskId = store.getTasks()[0].id;
store.toggleTask(firstTaskId);

// Test 3: Filter completed
console.log('TEST 3: Filter to completed');
store.setFilter('completed');

// Test 4: Filter active
console.log('TEST 4: Filter to active');
store.setFilter('active');

// Test 5: Filter all
console.log('TEST 5: Back to all');
store.setFilter('all');

// Test 6: Delete task
console.log('TEST 6: Delete second task');
const secondTaskId = store.getTasks()[1].id;
store.deleteTask(secondTaskId);

// Test 7: Clear completed
console.log('TEST 7: Clear completed tasks');
store.clearCompleted();

console.log('✅ ALL TESTS COMPLETE!');
console.log('Final state:', store.getState());