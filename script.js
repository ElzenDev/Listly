var inputArea = document.querySelector('#addTaskInput')
var btnInsert = document.querySelector("#btnInsert")
var taskList = document.querySelector("#taskList")


const addTaskDiv = document.querySelector('#addTaskDiv')
const searchDiv = document.querySelector('#searchDiv')

var searchInput = document.querySelector('#searchInput')


   






// Like Social Media apps, To DO Lists are made using or based in the CRUD system
// CRUD (Create, Read, Update, Delete)
// Create is a simple task, but for the other one we'll need to use Arrays
// We use Arrays in order to easily Store multiple values
 
/* Fucntions Map :
  When adding a Task:
    1. EventHandlers
    2. insertTaskDB() 
    3. updateDB() - Update
    4. loadTaks()
    5. addTask - Create
    6. loadTasks()

  When removing / completing a Task:
    1. removeTask() - Delete / done()
    2. updateDB() - Update
    3. loadTasks()
*/

var tasksDB = []


//          ** Event Handlers **
if(inputArea){
    inputArea.addEventListener('keypress', e => {
        if(e.key == 'Enter' && inputArea.value != ''){
            insertTaskDB()
        }
    }) 
    
    btnInsert.onclick = () => {
        if (inputArea.value != '') {
            insertTaskDB()
        }
    }
}

if(inputArea == null){
    searchInput.oninput = ()=>{
        taskList.innerHTML = ''
        console.log(taskList.innerHTML)
        tasksDB
            .filter((task) =>
                task.text.toLowerCase().includes(searchInput.value.toLowerCase())
            )
            .forEach((task) => addTask(task.text, task.status, task.t, task.date))
    }
}


//      ** Insert Task into the DataBase Function **

function insertTaskDB(){
    
    if(tasksDB.length >= 20){
        alert("você excedeu o limite de 20 Tarefas")
        return
    }
    tasksDB.push({'text': inputArea.value, 'status': '' , '_date': new Date(Date.now())})
    updateDB()
}

function updateDB(){
    localStorage.setItem('todolist', JSON.stringify(tasksDB))
    loadTask()
}

function loadTask(e){
    const taskDate = new Date()
    const day = taskDate.getDate()
    const month = taskDate.getMonth()
    const year = taskDate.getYear()
    if(e == day){
        taskList.innerHTML = ''
        tasksDB = JSON.parse(localStorage.getItem('todolist')) ?? []
        tasksDB.forEach((task, t) => {
            addTask(task.text, task.status, task._date, t)
        })
    }
    if(e == undefined){
        taskList.innerHTML = ''
        tasksDB = JSON.parse(localStorage.getItem('todolist')) ?? []
        tasksDB.forEach((task, t) => {
            addTask(task.text, task.status, task._date, t)
        })
    }
    
   

}


function addTask(text, status, _date, t){
    const li = document.createElement(`li`)
    li.id = _date
    li.innerHTML = `
    <section class="divLi " data-st=${t}> 
        <label>
        <input type='checkbox' ${status} data-t=${t} onchange= "done(this, ${t}) ;">
        <span class='check'><i class="bi bi-check-circle"></i></span>
        </label>
        
        <span>${text}</span>
        <button onclick = "removeTask(${t})" data-t=${t} ><i id='dltIcon' class="bi bi-trash-fill btn"></i></button>
    </section>`
    taskList.appendChild(li)
    li.style.order = t + 1


    if (status){
        li.style.backgroundColor = 'green'
        li.style.color ='whitesmoke'
        li.style.order = 0
        
        //document.querySelector(`[data-st="${t}"]`).classList.add('completed')
    }
    /*else{
        //document.querySelector(`[data-st="${t}"]`).classList.remove('completed')
    }*/
    if(inputArea){
        inputArea.value = ''
    }
    

    return li
}


function removeTask(t){
    tasksDB.splice(t, 1)
    updateDB()
}

function done(chk, t){
    if(chk.checked){
        tasksDB[t].status = 'checked'
    } else {
        tasksDB[t].status = ''
    }

    updateDB()

}

function todayTasks(){
    inputArea = ''
    btnInsert = ''
    todayDate = new Date()
    today = todayDate.getDate()
    loadTask(today)
    return loadTask(today)
    
}


loadTask()