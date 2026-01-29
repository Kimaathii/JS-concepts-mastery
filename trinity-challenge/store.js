//centralize state data closure

function createStore() {

    //helper function for local storage
    function loadStateFromLocalStorage(){
        try{
            // Step 1: Try to get data from localStorage
            const savedState = localStorage.getItem('todoState');
            
            // Step 2: If nothing saved, return defaults
            if (savedState === null) {
                console.log('No saved state found, using defaults');
                return {
                    tasks: [],
                    filter: 'all'
                };
            }
            
            // Step 3: Parse the JSON string into an object
            const parsedState = JSON.parse(savedState);
            
            console.log('Loaded state from localStorage:', parsedState);
            return parsedState;
            
        } catch (error) {
            // Step 4: If anything fails, return defaults
            console.error('Failed to load state from localStorage:', error);
            return {
                tasks: [],
                filter: 'all'
            };
        }
    };

    function saveHistory(){
        const stateCopy = structuredClone(state);

        history.push(stateCopy);
        future = [];

        const MAX_HISTORY_LENGTH = 10;
        if(history.length > MAX_HISTORY_LENGTH){
            history.shift();
        }
        console.log('History length', history.length);
    }
    //takes in private variable to store
    //state, subscriber, history 
    let state = loadStateFromLocalStorage();

    let subscribers = [];

    //implementing history.... 
    //save current copy of the state using structureClone() to history before updating state
    // i think a function will do here
    let history = [];
    let future = [];
    
    // Counter for generating unique task IDs
    let taskIdCounter = Date.now();



    //return an object with methods
    return {
        subscribe: function (callback) {
            subscribers.push(callback)
        },
        notify: function () {
            // Step 1: Notify all subscribers (your existing code)
            subscribers.forEach(callbackFunction => {
                callbackFunction();
            });
            
            // Step 2: Save state to localStorage
            try {
                // Convert state object to JSON string
                const stateString = JSON.stringify(state);
                
                // Save to localStorage with key 'todoState'
                localStorage.setItem('todoState', stateString);
                
                console.log('State saved to localStorage');
            } catch (error) {
                // If save fails, log it but don't crash the app
                console.error('Failed to save state to localStorage:', error);
            }
        },
        getState: function () {
            // Return a copy to prevent external mutations
            return structuredClone(state);
        },
        getTask: function () {
            switch (state.filter) {
                case 'all': return state.tasks;
                case 'active':
                    return state.tasks.filter(task => task.done === false);
                case 'completed':
                    return state.tasks.filter(task => task.done === true);
                default: return state.tasks;

            }
        },
        addTask: function (text) {
            //validate text input
            if (!text || text.trim() === "") {
                console.warn("Task field empty")
                return;
            }
            saveHistory();

            // Generate unique ID
            taskIdCounter++;
            let newTask = {
                id: taskIdCounter,
                text: text.trim(),
                done: false,
                createdAt: Date.now(),
            };
            //update immutable state
            state.tasks = [...state.tasks, newTask];

            this.notify();
        },
        toggleTask: function (id) {
            saveHistory();
            state.tasks = state.tasks.map(task => {
                if (task.id === id) {
                    return { ...task, done: !task.done };
                }
                return task;
            });
            this.notify();

        },
        deleteTask: function (id) {
            saveHistory();
            state.tasks = state.tasks.filter(task => task.id !== id)
            this.notify();
        },
        editTask: function (id, newText) {
            //validate text input
            if (!newText || newText.trim() === "") {
                console.warn("Task field empty")
                return;
            }
            const taskExists = state.tasks.some(task => task.id === id)
            if (!taskExists) {
                console.warn("Task not found")
                return false;
            }

            saveHistory();

            // Update the task
            state.tasks = state.tasks.map(task => {
                if (task.id === id) {
                    return { ...task, text: newText.trim() };
                }
                return task;
            });

            //  Notify and return success
            this.notify();
            return true;

        },
        setFilter: function (filter) {
            // Validate filter value
            const validFilters = ['all', 'active', 'completed'];
            
            if (!validFilters.includes(filter)) {
                console.warn(`Invalid filter: ${filter}. Using 'all' instead.`);
                filter = 'all'; // Default to 'all'
            }
            
            state.filter = filter;
            this.notify();
        },
        clearCompleted: function () {
            // Check if there are any completed tasks
            const hasCompleted = state.tasks.some(task => task.done === true);
            
            if (!hasCompleted) {
                console.log('No completed tasks to clear');
                return;
            }
            
            saveHistory();
            state.tasks = state.tasks.filter(task => task.done === false);
            this.notify();
        },
        //for undo 
        //pop last state from history
        //if history has that item restore state
        //notify subscriber
        undo: function () {
            // Can't undo if no history
            if (history.length === 0) {
                console.warn('Nothing to undo');
                return;
            }
            
            // Save current state to future (so we can redo)
            future.push(structuredClone(state));
            
            // Get the previous state
            const previousState = history.pop();
            
            // Restore it
            state = previousState;
            
            // Update UI and localStorage
            this.notify();
            
            console.log('Undo successful. History length:', history.length);
        },
        redo: function () {
            // Can't redo if no future
            if (future.length === 0) {
                console.warn('Nothing to redo');
                return;
            }
            
            // Save current state to history
            history.push(structuredClone(state));
            
            // Get the next state from future
            const nextState = future.pop();
            
            // Restore it
            state = nextState;
            
            // Update UI and localStorage
            this.notify();
            
            console.log('Redo successful. Future length:', future.length);
        }
    }


}
let storeData = createStore()

