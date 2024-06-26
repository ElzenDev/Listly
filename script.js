var inputArea = document.querySelector('#addTaskInput')
var btnInsert = document.querySelector("#btnInsert")
var taskList = document.querySelector("#taskList")


const addTaskDiv = document.querySelector('#addTaskDiv')
const searchDiv = document.querySelector('#searchDiv')

var searchInput = document.querySelector('#searchInput')
var currentTab = 3




function enableAddTask(){
    addTaskDiv.style.display = 'block'
    searchDiv.style.display = 'none'
    currentTab = 1
    console.log(currentTab)

}
function enableSearch(){
    searchDiv.style.display = 'block'
    addTaskDiv.style.display = 'none'
    currentTab = 2

    console.log(currentTab)
    searchInput.oninput = ()=>{
        taskList.innerHTML = ''
        console.log(taskList.innerHTML)
        tasksDB
            .filter((task) =>
                task.text.toLowerCase().includes(searchInput.value.toLowerCase())
            )
            .forEach((task) => addTask(task.text, task.status, task.t))
    }
}





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

//      ** Inset Task into the DataBase Function **

function insertTaskDB(){
    
    if(tasksDB.length >= 20){
        alert("você excedeu o limite de 20 Tarefas")
        return
    }
    tasksDB.push({'text': inputArea.value, 'status': '' })
    updateDB()
}

function updateDB(){
    localStorage.setItem('todolist', JSON.stringify(tasksDB))
    loadTask()
}

function loadTask(){
    taskList.innerHTML = ''
    tasksDB = JSON.parse(localStorage.getItem('todolist')) ?? []
    tasksDB.forEach((task, t) => {
        addTask(task.text, task.status, t)
        
    })

}


function addTask(text, status, t){
    const li = document.createElement("li")

    li.innerHTML = `
    <section class="divLi " data-st=${t}> 
        <input type='checkbox' ${status} data-t=${t} onchange= "done(this, ${t});"/>
        <span>${text}</span>
        <button onclick = "removeTask(${t})" data-t=${t} ><i id='dltIcon' class="bi bi-trash-fill btn"></i></button>
    </section>`
    taskList.appendChild(li)


    if (status){
        li.style.backgroundColor = 'green'
        li.style.color ='whitesmoke'
        
        //document.querySelector(`[data-st="${t}"]`).classList.add('completed')
    }
    else{
        li.style.order = tasksDB.length
        //document.querySelector(`[data-st="${t}"]`).classList.remove('completed')

    }

    inputArea.value = ''
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


loadTask()