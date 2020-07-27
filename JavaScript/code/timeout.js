console.log("hi")

let promise = new Promise(resolve=>{
    setTimeout(()=>{
        console.log('promise')
        resolve('hello world');
    }, 1000)
});

setTimeout(()=>{
    promise.then(value=>{
       console.log(value) 
    })
}, 1000);
/*
hi
promise
hello world
*/