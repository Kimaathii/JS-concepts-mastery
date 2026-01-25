//logger message will be an object that will
//1. a log method that takes two argument a message and type
//generate a timestamp using performance.now()

//include a clear method
let logger = { 
    log(message, type){
        //before we display we need to acquire the posistion where will place the output
        let outputContainer = document.getElementById('log-output');
        //we will need to create a div element that we will append message to
        let logElement = document.createElement('div');
        // we also need to create the timestamp using the performance.now()
        const timestamp = performance.now();
        logElement.textContent = `[${timestamp.toFixed(2)}ms] ${message}`;

        // we also have to logically delegate colors according to the type

        switch(type){
            case 'sync' :  logElement.style.color = 'black';
            break;
            case 'task' : logElement.style.color = 'blue';
            break;
            case 'microtask' : logElement.style.color = 'green';
            break;
            default : logElement.style.color = 'red';
        }
        //now we need to append child to the output container
        outputContainer.appendChild(logElement);
        
    },
    //include the clear method
    clear(){
        document.getElementById('log-output').innerHTML = '';
    }
}

