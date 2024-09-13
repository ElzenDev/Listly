//                      VARIABLES
var inputArea = document.querySelector('#addTaskInput')
const AlarmConfig = document.querySelector(".alarmConfig")
var alarm
var taskList = document.querySelector("#taskList")

var btnInsert = document.querySelector("#btnInsert")
const btnSetAlarm = document.querySelector("#btnAlarm")

const addTaskDiv = document.querySelector('#addTaskDiv')
const searchDiv = document.querySelector('#searchDiv')

var clientDate

var searchInput = document.querySelector('#searchInput')

var tasksDB = []



//localStorage.clear()

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
btnSetAlarm.addEventListener('click', () => {
    if(AlarmConfig.style.display == 'none'){
        AlarmConfig.style.display = 'flex'
    } else{
        AlarmConfig.style.display = 'none'
    }
    
})
/*              Setting the alarms */

function setAlarm(){
    AlarmConfig.style.display = 'none'
    var hasAlarm = true
    alarm = {
        date: document.querySelector("#alarmDate").value,
        time: document.querySelector("#alarmTime").value
    }
    insertTaskDB(hasAlarm, alarm)
    updateAlarm(alarm)

}


//      ** Insert Task into the DataBase Function **

function insertTaskDB(hasA, a){
    const date = {
        day: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    }
    
    if(tasksDB.length >= 20){
        alert("você excedeu o limite de 20 Tarefas")
        return
    }

    if(hasA = true){
        tasksDB.push({'text': inputArea.value, 'status': '','date': date, 'alarm': a})
        updateDB(a)
    }else{
        tasksDB.push({'text': inputArea.value, 'status': '','date': date, 'alarm': undefined})
        updateDB()
    }
    
    
    
}

function updateDB(a){
    localStorage.setItem('todolist', JSON.stringify(tasksDB))
    if(a){
        loadTask(undefined, a) 
    }else(
        loadTask()
    )
    
}

function loadTask(e, a){
    taskList.innerHTML = ''
    tasksDB = JSON.parse(localStorage.getItem('todolist')) ?? []
    tasksDB.forEach((task, t) => {
        if(e == task.date.day){
            addTask(task.text, task.status, task.date, t)
        }
        if(e == undefined){
            addTask(task.text, task.status, task.date, t)
        }
        
    })
    
    

}


function addTask(text, status, date, t){
    const li = document.createElement(`li`)
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
    
    }
    
    if(inputArea){
        inputArea.value = ''
    }
    
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
    clientDate = new Date()
    const today = clientDate.getDate()
    loadTask(today)
    return loadTask(today)
}
//              **  Alarm Notification  **


let permission = Notification.permission

function updateAlarm(){
    
    var now = new Date()
    var nowDate = `${now.getFullYear()}-${now.toLocaleDateString([],{month:"2-digit"})}-${now.getDate()}`
    var nowTime = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})
    if(nowDate == alarm.date && nowTime == alarm.time){
        notificationPermission(bodyText)
        return
    }
    console.log("travou")
    setTimeout(updateAlarm, 1000)
    
    
}

function notificationPermission(){   

    if(permission == "granted"){
        showNoti()
    }
    else if (permission == "default"){
        requestAndShowPermission()
        
    }else{
        alert("Aguarde")
    }
}
function showNoti(body){
    let notiTittle = "TASKZ"
    let notiBody = "Time To Complete A Task"
    let noti = new Notification(notiTittle, {body: notiBody})
    console.log(noti)
    console.log(permission)
    
    noti.onclick = () => {
        noti.close()
        window.parent.focus()
    }
    
}
function requestAndShowPermission(taskText){
    
    Notification.requestPermission().then(function(permission){
        if (permission == "granted"){
            showNoti(taskText)
            console.log(permission)
        }
    })
}



loadTask()