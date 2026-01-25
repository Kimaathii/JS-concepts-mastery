
//global variable
let eventLogContainer;
let stopPropagationCheckbox;

//create a callback function that handle color assignment to event
function phaseIndicator(phase){
    switch(phase){
        case 'CAPTURING': 
            return 'blue';
        case 'TARGET': 
            return'green';
        case 'BUBBLING': 
            return 'orange';
            default: return 'black';
    }
}

//create logEvent function pass elementName, phase and event as parameter
        //in function block get current time stamp with performance.now()
        //create new div element to log entries
        //set time stamp to 2 decimal place using toFixed(2)
        //add timestamp, element name, phase name, where handle is attached 
        //append to created div

function logEvent(elementName, phase, event) { 
     
    const timeStamp = performance.now();
    const logElement = document.createElement('div')
    const color = phaseIndicator(phase);
    logElement.style.color = color;
    logElement.textContent = `${timeStamp.toFixed(2)}ms 
    Element Name: ${elementName} 
    Phase Name: ${phase} 
    Target ID: ${event.target.id}
    handler's position: ${event.currentTarget.id}
    `;
    eventLogContainer.appendChild(logElement)




}
//create all handler functions
    //handleGrandparent(event)
    //handleParent(event)
    //handleChild(event)
    //handleTarget(event)

function handleGrandparentClicks(event) { 
    logEvent('GRANDPARENT', 'BUBBLING', event);
   


}
function handleParentClicks(event) { 
    logEvent('PARENT', 'BUBBLING', event);

}
function handleChildClicks(event) { 
    logEvent('CHILD', 'BUBBLING', event);

    stopPropagationCheckbox = document.getElementById('stop-propagation');
    if (stopPropagationCheckbox.checked) {
        event.stopPropagation();
    }



}
function handleTargetBtnClicks(event){
    logEvent('TARGET', 'TARGET', event)
}
function clearContent(){
    eventLogContainer.innerHTML = '';
}
//create an init function
    //create local variable of  reference to all elements using document.getElementById
    //add event listener
   
function init() {
    const grandParentContainer = document.getElementById('grandparent');
    const parentContainer = document.getElementById('parent');
    const childContainer = document.getElementById('child');
    const targetBtn = document.getElementById('target');
    const captureToggleCheckBox = document.getElementById('capture-toggle');
    const clearBtn = document.getElementById('clear-log');
    eventLogContainer = document.getElementById('event-log');
    console.log(eventLogContainer)

    //INITIAL SETUP FOR BUBBLING PHASE

    const useCapture = captureToggleCheckBox.checked

    grandParentContainer.addEventListener('click', handleGrandparentClicks, useCapture);
    parentContainer.addEventListener('click', handleParentClicks, useCapture);
    childContainer.addEventListener('click', handleChildClicks, useCapture);
    targetBtn.addEventListener('click', handleTargetBtnClicks, useCapture);

    clearBtn.addEventListener('click', clearContent);

    

  
    
    


}



//wait for dom to load
//check if DOM is loaded pass init function set up

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init )
    
}else{
    init()
}
