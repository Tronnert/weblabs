const body = document.body

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]")

const title = document.createElement("h1")
title.textContent = "Todo List"

const input = document.createElement("input")
input.placeholder = "Task name"

const date = document.createElement("input")
date.type = "date"

const addBtn = document.createElement("button")
addBtn.textContent = "Add"

const search = document.createElement("input")
search.placeholder = "Search"

const filter = document.createElement("select")
filter.innerHTML = `
<option value="all">All</option>
<option value="done">Done</option>
<option value="todo">Todo</option>
`

const sortBtn = document.createElement("button")
sortBtn.textContent = "Sort by date"

const list = document.createElement("div")

body.append(title,input,date,addBtn,search,filter,sortBtn,list)

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function render(){

list.innerHTML=""

let data=[...tasks]

if(search.value)
data=data.filter(t=>t.text.toLowerCase().includes(search.value.toLowerCase()))

if(filter.value==="done")
data=data.filter(t=>t.done)

if(filter.value==="todo")
data=data.filter(t=>!t.done)

data.forEach((task,i)=>{

const div=document.createElement("div")
div.className="task"
div.draggable=true

const check=document.createElement("input")
check.type="checkbox"
check.checked=task.done

const text=document.createElement("span")
text.textContent=`${task.text} (${task.date})`
if(task.done) text.className="done"

const edit=document.createElement("button")
edit.textContent="Edit"

const del=document.createElement("button")
del.textContent="X"

check.onchange=()=>{
task.done=check.checked
save()
render()
}

del.onclick=()=>{
tasks.splice(i,1)
save()
render()
}

edit.onclick=()=>{
const newText=prompt("Edit task",task.text)
if(newText){
task.text=newText
save()
render()
}
}

// drag
div.ondragstart=e=>{
e.dataTransfer.setData("index",i)
}

div.ondragover=e=>e.preventDefault()

div.ondrop=e=>{
const from=e.dataTransfer.getData("index")
const item=tasks.splice(from,1)[0]
tasks.splice(i,0,item)
save()
render()
}

div.append(check,text,edit,del)
list.append(div)

})

}

addBtn.onclick=()=>{
if(!input.value) return

tasks.push({
text:input.value,
date:date.value,
done:false
})

input.value=""
date.value=""

save()
render()
}

sortBtn.onclick=()=>{
tasks.sort((a,b)=>new Date(a.date)-new Date(b.date))
save()
render()
}

search.oninput=render
filter.onchange=render

render()