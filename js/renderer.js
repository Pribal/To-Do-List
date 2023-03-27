const fs = require('fs');
const { ipcRenderer, app } = require("electron");
const Store = require("electron-store")

const storage = new Store({
    todo : {
        type: 'array'
    }
})

const priority_array = [
    {"name" : "Faible", "color": "#2003fc"},
    {"name" : "Modérée", "color" : "#f8fc03"},
    {"name" : "Importante", "color": "#fc9803"},
    {"name" : "Critique", "color" : "#fc0303"}
]

if(!storage.has("todo"))
{
    storage.set("todo", [])
}

if(!storage.has("theme"))
{
    theme = ""
    if(window.matchMedia('(prefers-color-scheme: dark)').matches)
    {
        theme = "dark"
    }
    else
    {
        theme = "light"
    }
    storage.set("theme", theme)
}

function add_data_if_button_clicked(e) {
    e.addEventListener("click", () => {
        data = {
            "id": last_id+1,
            "name": input_task_name.value,
            "date_echeance": date_tache_input.value,
            "priority": select_priority.value,
            "checked": 0
        }
        todo = storage.get("todo")
        todo.push(data)
        storage.set("todo", todo)
        ipcRenderer.send("reload")
    })
}

function DeleteElementById(e) {
    e.addEventListener("click", function () {
        id = e.parentElement.id
        storage.get("todo").forEach((element) => {
            console.log(element, element.id == id);
            if(element.id == id)
            {
                index = storage.get("todo").findIndex(function (obj) {
                    return obj.id == id
                })
                json = storage.get("todo")
                json.splice(index, 1)
                storage.set("todo", json)
                ipcRenderer.send("reload")
            }
        })
    })
}

function checkbox_check_input(e, element)
{
    e.addEventListener('click', function() {
        json = storage.get("todo")
        json.forEach((obj) => {
            if(element.id == obj.id)
            {
                if(obj.checked == 1)
                {
                    obj.checked = 0
                }
                else{
                    obj.checked = 1
                }
            }
        })
        storage.set("todo", json)
        ipcRenderer.send("reload")
    })
}

function get_today_date()
{
    today = new Date()
    if(today.getMonth() < 10)
    {
        tmonth = today.getMonth()+1
        month = "0"+tmonth
    }
    else {
        month = today.getMonth() + 1
    }
    if(today.getDate() < 10)
    {
        day = "0"+today.getDate()
    }
    else {
        day = today.getDate()
    }
    if(today.getHours() < 10)
    {
        hours = "0"+today.getHours()
    }
    else {
        hours = today.getHours()
    }if(today.getMinutes() < 10)
    {
        minutes = "0"+today.getMinutes()
    }
    else {
        minutes = today.getMinutes()
    }
    format_date = today.getFullYear()+"-"+month+"-"+day+"T"+hours+":"+minutes
    return format_date
}

function diff_date_maintenant(date)
{
    now = get_today_date()
    now_date = now.split("T")[0]
    date_date = date.split("T")[0]
    var [now_year, now_month, now_day] = now_date.split("-")
    var [date_year, date_month, date_day] = date_date.split("-")

    diff_year = date_year - now_year
    diff_month = date_month - now_month
    diff_day = date_day - now_day

    var return_string = ""

    if(diff_year <= 0 && diff_month <= 0 && diff_day <= 0)
    {
        return_string += "Échéance passée"
        return return_string
    }
    else
    {
        return_string += "Échéance dans "

        if(diff_year > 0)
        {
            return_string += diff_year + " an "
        }
        if(diff_month > 0)
        {
            return_string += diff_month + " mois "
        }
        if(diff_day == 1)
        {
            return_string += diff_day + " jour "
        }
        if(diff_day > 1)
        {
            return_string += diff_day + " jours "
        }
        return return_string
    }
}

function display_todo(todo_array)
{
    todo_array.forEach(element => {
        div = document.createElement("div")
        div.setAttribute("id", element.id)
        div.setAttribute("class", "todo")
        checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        if(element.checked)
        {
            div.setAttribute("class", "todo checked")
            checkbox.checked = 1
        }
        checkbox_check_input(checkbox, element)
        p_name = document.createElement("p")
        p_name.innerHTML = element.name
        p_priority = document.createElement("p")
        p_echeance = document.createElement("p")
        p_echeance.innerHTML = diff_date_maintenant(element.date_echeance)
        p_priority_span = document.createElement("span")
        p_priority.innerHTML = "Priorité: "
        p_priority_span.innerHTML = priority_array[element.priority].name
        p_priority_span.style.color = priority_array[element.priority].color
        trash_img = document.createElement("button")
        trash_img.innerHTML = "<img src='../images/trash.png' height=30 width=30>"
        trash_img.width = 30
        trash_img.height = 30
        p_priority.append(p_priority_span)
        checkbox.style.marginLeft = "10px"
        div.append(checkbox)
        div.append(p_name)
        div.append(p_priority)
        div.append(p_echeance)
        div.append(trash_img)
        var parent = document.getElementById("prio-"+element.priority)
        parent.append(div)
        DeleteElementById(trash_img)
    });  
}

const todo_list = document.getElementById("todo_list");
const todo_buttons = document.getElementById("todo_buttons");
const no_task = document.getElementById("no_task")
const add_task_button = document.getElementById("add_task")
const input_task_name = document.getElementById("name_tache_input")
const date_tache_input = document.getElementById("date_tache_input")
const select_priority = document.getElementById("task_priority")

date_tache_input.value = get_today_date()

add_data_if_button_clicked(add_task_button)
input_task_name.addEventListener('input', function(e) {
    if(input_task_name.value == "")
    {
        add_task_button.setAttribute("disabled", 1)
    }
    else
    {
        add_task_button.removeAttribute("disabled")
    }
})

if(storage.get("todo").length > 0)
{
    last_id = storage.get("todo").slice(-1)[0].id
    no_task.style.display = "none";
    display_todo(storage.get("todo"));
}
else
{
    last_id = -1
    no_task.style.display = "block";
}







