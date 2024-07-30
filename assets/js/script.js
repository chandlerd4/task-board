// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

    return new Date().getTime().toString();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();

    // ? Empty existing task cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // ? Loop through tasks and create task cards for each status
    for (let task of tasks) {
      if (task.status === 'to-do') {
        todoList.append(createtaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createtaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createtaskCard(task));
      }
    }
  
    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
      helper: function (e) {
        // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
localStorage.setItem("tasks" ,JSON.stringify(taskList));
renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
     
    taskList = taskList.filter(task => task.id !== selectedTaskid )
    localStorage.setItem("tasks" ,JSON.stringify(taskList));
renderTaskList()
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $( function() {
        $( "#datepicker" ).datepicker();
      } );
});

// ? Adds a Task to local storage and prints the Task data
function handleTaskFormSubmit(event) {
  event.preventDefault();

  // ? Read user input from the form
  const TaskName = TaskNameInputEl.val().trim();
  const TaskType = TaskTypeInputEl.val(); // don't need to trim select input
  const TaskDate = TaskDateInputEl.val(); // yyyy-mm-dd format

  const newTask = {
    // ? Here we use a Web API called `crypto` to generate a random id for our Task. This is a unique identifier that we can use to find the Task in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    name: TaskName,
    type: TaskType,
    dueDate: TaskDate,
    status: 'to-do',
  };

  // ? Pull the Tasks from localStorage and push the new Task to the array
  const Tasks = readTasksFromStorage();
  Tasks.push(newTask);

  // ? Save the updated Tasks array to localStorage
  saveTasksToStorage(Tasks);

  // ? Print Task data back to the screen
  printTaskData();

  // ? Clear the form inputs
  TaskNameInputEl.val('');
  TaskTypeInputEl.val('');
  TaskDateInputEl.val('');
}