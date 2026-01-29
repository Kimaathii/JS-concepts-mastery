// Trinity Challenge - UI Layer
// Connects the store to the DOM using the subscriber pattern

(function() {
    'use strict';

    // ============================================
    // STEP 1: GET DOM REFERENCES
    // ============================================
    // Cache all DOM elements we'll need
    const inputField = document.querySelector('input[type="text"]');
    const addButton = document.querySelector('#input-section button');
    const taskList = document.getElementById('display-taskList');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const undoBtn = document.getElementById('undo-cleared');
    const redoBtn = document.getElementById('redo-btn');
    const taskCount = document.getElementById('task-count');

    // ============================================
    // STEP 2: RENDER FUNCTION (The Heart of UI)
    // ============================================
    // This function reads from store and updates the DOM
    function render() {
        // Get filtered tasks from store
        const tasks = storeData.getTask();
        const state = storeData.getState();
        
        // Clear the task list
        taskList.innerHTML = '';
        
        // If no tasks, show a message
        if (tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks yet. Add one above!';
            emptyMessage.style.fontStyle = 'italic';
            emptyMessage.style.opacity = '0.6';
            taskList.appendChild(emptyMessage);
        } else {
            // Create a list item for each task
            tasks.forEach(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            });
        }
        
        // Update task count
        updateTaskCount(state.tasks);
        
        // Update active filter button
        updateFilterButtons(state.filter);
    }

    // ============================================
    // STEP 3: CREATE TASK ELEMENT
    // ============================================
    // Creates a single task list item with all controls
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id; // Store ID for reference
        
        // Create checkbox for toggle
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            storeData.toggleTask(task.id);
        });
        
        // Create text span (editable on double-click)
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        textSpan.className = task.done ? 'completed' : '';
        
        // Double-click to edit
        textSpan.addEventListener('dblclick', () => {
            editTask(li, task);
        });
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            storeData.deleteTask(task.id);
        });
        
        // Assemble the list item
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        
        return li;
    }

    // ============================================
    // STEP 4: EDIT TASK INLINE
    // ============================================
    function editTask(li, task) {
        const textSpan = li.querySelector('span');
        const originalText = textSpan.textContent;
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.className = 'edit-input';
        
        // Replace span with input
        li.replaceChild(input, textSpan);
        input.focus();
        input.select();
        
        // Save on Enter or blur
        function saveEdit() {
            const newText = input.value.trim();
            
            if (newText && newText !== originalText) {
                storeData.editTask(task.id, newText);
            } else if (!newText) {
                // If empty, delete the task
                storeData.deleteTask(task.id);
            } else {
                // No change, just re-render
                render();
            }
        }
        
        // Cancel on Escape
        function cancelEdit() {
            render();
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
    }

    // ============================================
    // STEP 5: UPDATE TASK COUNT
    // ============================================
    function updateTaskCount(tasks) {
        const total = tasks.length;
        const active = tasks.filter(t => !t.done).length;
        const completed = tasks.filter(t => t.done).length;
        
        taskCount.textContent = `Total: ${total} | Active: ${active} | Completed: ${completed}`;
    }

    // ============================================
    // STEP 6: UPDATE FILTER BUTTONS
    // ============================================
    function updateFilterButtons(currentFilter) {
        // Remove active class from all
        [filterAll, filterActive, filterCompleted].forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to current filter
        if (currentFilter === 'all') {
            filterAll.classList.add('active');
        } else if (currentFilter === 'active') {
            filterActive.classList.add('active');
        } else if (currentFilter === 'completed') {
            filterCompleted.classList.add('active');
        }
    }

    // ============================================
    // STEP 7: ADD TASK HANDLER
    // ============================================
    function handleAddTask() {
        const text = inputField.value.trim();
        
        if (text) {
            storeData.addTask(text);
            inputField.value = ''; // Clear input
            inputField.focus(); // Keep focus for next task
        } else {
            // Show visual feedback for empty input
            inputField.classList.add('error');
            setTimeout(() => {
                inputField.classList.remove('error');
            }, 300);
        }
    }

    // ============================================
    // STEP 8: EVENT LISTENERS
    // ============================================
    
    // Add task on button click
    addButton.addEventListener('click', handleAddTask);
    
    // Add task on Enter key
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });
    
    // Filter buttons
    filterAll.addEventListener('click', () => {
        storeData.setFilter('all');
    });
    
    filterActive.addEventListener('click', () => {
        storeData.setFilter('active');
    });
    
    filterCompleted.addEventListener('click', () => {
        storeData.setFilter('completed');
    });
    
    // Clear completed
    clearCompletedBtn.addEventListener('click', () => {
        const completedCount = storeData.getState().tasks.filter(t => t.done).length;
        
        if (completedCount > 0) {
            if (confirm(`Clear ${completedCount} completed task(s)?`)) {
                storeData.clearCompleted();
            }
        } else {
            alert('No completed tasks to clear!');
        }
    });
    
    // Undo button
    undoBtn.addEventListener('click', () => {
        storeData.undo();
    });
    
    // Redo button
    redoBtn.addEventListener('click', () => {
        storeData.redo();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Z or Cmd+Z for undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            storeData.undo();
        }
        
        // Ctrl+Shift+Z or Cmd+Shift+Z for redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            storeData.redo();
        }
    });

    // ============================================
    // STEP 9: SUBSCRIBE TO STORE
    // ============================================
    // This is the MAGIC - render automatically when state changes!
    storeData.subscribe(render);

    // ============================================
    // STEP 10: INITIAL RENDER
    // ============================================
    // Show any persisted tasks from localStorage
    render();
    
    // Focus input on load for better UX
    inputField.focus();
    
    console.log('✅ Trinity Todo App initialized!');
    console.log('Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)');
})();
