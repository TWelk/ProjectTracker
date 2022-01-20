// save reference to important DOM elements
var timeDisplayEl = $('#time-display');
var projectDisplayEl = $('#project-display');
var projectModalEl = $('#project-modal');
var projectFormEl = $('#project-form');
var projectNameInputEl = $('#project-name-input');
var projectTypeInputEl = $('#project-type-input');
var hourlyRateInputEl = $('#hourly-rate-input');
var dueDateInputEl = $('#due-date-input');
var inputs = JSON.parse(localStorage.getItem("inputs")) || [];

// handle displaying the time
function displayTime() {
  var rightNow = moment().format('MMM DD, YYYY [at] hh:mm:ss a');
  timeDisplayEl.text(rightNow);
}

// handle printing project data to the page
function printProjectData(name, type, hourlyRate, dueDate) {
  var projectRowEl = $('<tr>');

  var projectNameTdEl = $('<td>').addClass('p-2').text(name);

  var projectTypeTdEl = $('<td>').addClass('p-2').text(type);

  var rateTdEl = $('<td>').addClass('p-2').text(hourlyRate);

  var dueDateTdEl = $('<td>').addClass('p-2').text(dueDate);

  var daysToDate = moment(dueDate, 'MM/DD/YYYY').diff(moment(), 'days');
  var daysLeftTdEl = $('<td>').addClass('p-2').text(daysToDate);

  var totalEarnings = calculateTotalEarnings(hourlyRate, daysToDate);

  // You can also chain methods onto new lines to keep code clean
  var totalTdEl = $('<td>')
    .addClass('p-2')
    .text('$' + totalEarnings);

  var deleteProjectBtn = $('<td>')
    .addClass('p-2 delete-project-btn text-center')
    .text('X');

  // By listing each `<td>` variable as an argument, each one will be appended in that order
  projectRowEl.append(
    projectNameTdEl,
    projectTypeTdEl,
    rateTdEl,
    dueDateTdEl,
    daysLeftTdEl,
    totalTdEl,
    deleteProjectBtn
  );

  projectDisplayEl.append(projectRowEl);

  projectModalEl.modal('hide');
}

function calculateTotalEarnings(rate, days) {
  var dailyTotal = rate * 8;
  var total = dailyTotal * days;
  return total;
}

function handleDeleteProject(event) {
  console.log(event.target);
  var btnClicked = $(event.target);
  btnClicked.parent('tr').remove();
}

// handle project form submission
function handleProjectFormSubmit(event) {
  event.preventDefault();

  var projectTbl = {
    projectName: projectNameInputEl.val().trim(),
    projectType: projectTypeInputEl.val().trim(),
    hourlyRate: hourlyRateInputEl.val().trim(),
    dueDate: dueDateInputEl.val().trim(),
  }

  inputs.push(projectTbl)
  localStorage.setItem("inputs", JSON.stringify(inputs));

  printProjectData(projectTbl.projectName, projectTbl.projectType, projectTbl.hourlyRate, projectTbl.dueDate);

  projectFormEl[0].reset();
}

for (let i = 0; i < inputs.length; i++) {
  const projectData = inputs[i];
  
  printProjectData(projectData.projectName, projectData.projectType, projectData.hourlyRate, projectData.dueDate)
}

projectFormEl.on('submit', handleProjectFormSubmit);
projectDisplayEl.on('click', '.delete-project-btn', handleDeleteProject);
dueDateInputEl.datepicker({ minDate: 1 });

setInterval(displayTime, 1000);
