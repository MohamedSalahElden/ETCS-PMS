
function showNewStandardFloatingCard() {
  document.getElementById("NewStandardFloatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function hideNewStandardFloatingCard() {
  document.getElementById("NewStandardFloatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}


function addNewStandard(){
  // get standard name
  // get standard description
  // get atandard controls from xlsx file
  // call the add new standard function in flask
  console.log("add new standard");
  document.querySelector('form').submit();
}


function toggleRow(element) {
  // Find all expandable rows in the table
  const allExpandableRows = document.querySelectorAll('tr.expandable');

  // Find the next sibling row of the clicked element
  const expandableRow = element.closest('tr').nextElementSibling;

  // Loop through all expandable rows to hide them
  allExpandableRows.forEach(row => {
    if (row !== expandableRow) {
      row.style.display = "none"; // Hide other rows
    }
  });

  // Toggle visibility of the targeted row
  if (expandableRow.style.display === "none" || !expandableRow.style.display) {
    expandableRow.style.display = "table-row";
  } else {
    expandableRow.style.display = "none";
  }
}
