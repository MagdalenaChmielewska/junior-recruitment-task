const backendUrl = "../backend/tasks",
      addTaskButton = document.getElementById("add"),
      inputTask = document.getElementById("input-task");

function sendRequest(url, method, requestBody, onFailureMessage, onFinish) {
    $.ajax({
        url: url,
        type: method,
        headers: {
            "Content-Type":"application/json"
        },
        data: requestBody
    })
    .done(function() {
        onFinish();
    })
    .fail(function(){
        console.log(onFailureMessage);
    })

    return true;
}

class TodoList {
    completeTask(id, onFinish) {
        const url = backendUrl + "/" + id;
        sendRequest(url, 'PATCH', JSON.stringify({"completed": 1}), "Completed Task Failed", onFinish);
    }
    
    uncompleteTask(id, onFinish) {
        const url = backendUrl + "/" + id;
        sendRequest(url, 'PATCH', JSON.stringify({"completed": 0}), "Uncompleted Task Failed", onFinish);
    }
    
    addTask(task, onFinish) {
        sendRequest(backendUrl, 'POST', JSON.stringify(task), "Add Task Failed", onFinish);
    }
    
    removeTask(id, onFinish) {
        const url = backendUrl + "/" + id;
        sendRequest(url, 'DELETE', null, "Remove Task Failed", onFinish);
    }
    
    allTasks() {
        const response = $.ajax({
            url: backendUrl,
            async: false,
            type: 'GET'
        });

        const parsed_response = JSON.parse(response.responseText);

        return parsed_response;
    }
}

const todoList = new TodoList();

/** 
 * Function allows to add task with description to TodoList
 */
function addTask(event) {
    event.preventDefault();

    const description = document.getElementById('input-task').value,
          error = document.querySelector(".error").classList;

    if (description === '') {
        error.add("wrong-input");
        return;
    } 
    
    todoList.addTask({'description': description}, renderTaskList);
    error.remove("wrong-input");
}

function changeTaskStatus(task) {   
    if (task.completed == 1) {
        todoList.uncompleteTask(task.id, renderTaskList)
    } else {
        todoList.completeTask(task.id, renderTaskList)
    }
}

/** 
 * Function allows to delete task
 */
function removeTask() {
    const id = this.getAttribute('id');

    todoList.removeTask(id, renderTaskList);
}

addTaskButton.addEventListener('click', addTask);

inputTask.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        addTaskButton.click();
    }
});

inputTask.addEventListener('focus', function() {
  if (inputTask.value != null)
    inputTask.value = "";
});

function renderTask(todo, todos) {

    let li = document.createElement('li');
    li.className = 'single-task';
    todos.appendChild(li);
    
    let span = document.createElement('span');
    li.appendChild(span);

    let input = document.createElement('input');
    input.id = todo.id;
    input.setAttribute('type', "checkbox");
    input.checked = todo.completed;
    input.addEventListener('click', () => {changeTaskStatus(todo)});
    li.appendChild(input);

    let label = document.createElement('label');
    label.id = todo.id;
    label.className = 'description';
    label.setAttribute('for', todo.id);
    label.innerHTML = todo.description;
    li.appendChild(label);

    let button = document.createElement('button');
    button.id = todo.id;
    button.className = 'remove';
    button.setAttribute('aria-label', "Remove-task");
    button.addEventListener('click', removeTask);
    li.appendChild(button);

    let img = document.createElement('img');
    img.src = 'images/trash.png';
    img.className = 'remove-icon';
    img.alt = 'remove icon';
    button.appendChild(img);
} 

function renderTaskList() {
    let todos = document.getElementById('todos')
    todos.innerHTML = '';

    for (const todo of todoList.allTasks()) {
        renderTask(todo, todos);
    }
}   

renderTaskList();
