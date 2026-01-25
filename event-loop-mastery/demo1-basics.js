//goal demonstrate execution order 
//wait for DOM to load
// make sure we acquire all the button element from DOM
//add event listeners ... when click add the basic demo functions
//wire up the clear log button


//basic demo functions
function basicDemo(){
    //log without time out 
    console.log('log without time out');
    logger.log('START-synchronous', 'sync')


    console.log('log wait for 0ms to display');
    setTimeout(()=>{
        logger.log('START-task', 'task')
    },0)

    console.log('logging with promise')

    Promise.resolve().then( () => {
        logger.log('Microtask with promise', 'microtask')
    });

    logger.log('END- sychronous', 'sync')


   
    
}
//clear log function 
function clearLog(){
    //clear log
    logger.clear();
    console.log('clear log');
    
}
//promiseDEMO function 
function promiseDemo(){
    //log to console
    console.log('Starting timer precision test');
    const startElapse = performance.now();

    for (let i = 0; i < 100; i++){
        Promise.resolve().then(()=>{
            logger.log(`Promise ${i}`, 'microtask')
        });
    }

    setTimeout(()=>{
        const timeElapse = performance.now() - startElapse;
        logger.log(`setTimeout(0) actual delay: ${timeElapse.toFixed(2)}ms`, 'task')
        // console.log('setTimeout(0) actual delay:', timeElapse)
    }, 0);
    setTimeout(() => {
        const timeElapse = performance.now() - startElapse;
        logger.log(`setTimeout(100) actual delay: ${timeElapse.toFixed(2)}ms`, 'task')
        // console.log('setTimeout(100) actual delay:', timeElapse)
    }, 100)
}
//for best practice check if the DOM is ready 
function init(){
//acquire all button and add event listeners here
    const basicButton = document.getElementById('btn-basic'); 
    const clearButton = document.getElementById('btn-clear');
    const promiseButton = document.getElementById('btn-promise');

    // add event listener 
    basicButton.addEventListener('click', basicDemo);
    clearButton.addEventListener('click', clearLog);
    promiseButton.addEventListener('click', promiseDemo);

}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
}else{
    init();
}
