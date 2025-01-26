function edit_issue(issue) {
  const url = `/edit_issue?issue=${issue}`;
  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      // Handle the success response here
      console.log("Folder opened successfully:", response.message);
      // Optionally, show a success message to the user
    },
    error: function (xhr, status, error) {
      // Handle the error response here
      console.error(
        "Error opening folder:",
        xhr.responseJSON.message || "An error occurred"
      );
      // Optionally, show an error message to the user
    },
  });
}

function deleteTask(button) {
  var taskId = button.getAttribute("data-id"); // Get the task ID
  var xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
  xhr.open("POST", "/delete_task", true); // Set up the request method and URL
  xhr.setRequestHeader("Content-Type", "application/json"); // Set content type as JSON

  // Set up the data to be sent
  var data = JSON.stringify({ id: taskId });

  // Set up the response handler
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Reload the page if deletion is successful
      window.location.reload();
    } else {
      // Optionally, show an error message if the deletion fails
      alert("Error: Could not delete the task.");
    }
  };

  // Send the request with the data
  xhr.send(data);
}

function updateCheckboxValue(checkbox) {
  // Get the task ID and checkbox state (checked or unchecked)
  var taskId = checkbox.getAttribute("data-id");
  var isChecked = checkbox.checked;

  // Create an XMLHttpRequest to send data to the server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/change_state", true); // Set up the request method and URL
  xhr.setRequestHeader("Content-Type", "application/json"); // Set content type as JSON

  // Prepare the data to be sent
  var data = JSON.stringify({
    id: taskId,
    state: isChecked ? "on" : "off", // Send "on" if checked, "off" if unchecked
  });

  // Send the request with the data
  xhr.send(data);

  // Optional: Handle the response from the server if needed
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("State updated successfully");
    } else {
      console.log("Failed to update state");
    }
  };
}

function openTaskFolder(task_id) {
  $.ajax({
    url: "/open_task_folder",
    type: "GET",
    data: { task_id: task_id },
    success: function (response) {
      // Handle the success response here
      console.log("Folder opened successfully:", response.message);
      // Optionally, you can show a success message to the user
    },
    error: function (xhr, status, error) {
      // Handle the error response here
      console.error("Error opening folder:", xhr.responseJSON.message);
      // Optionally, show an error message to the user
    },
  });
}

function openInVsCode(task_id) {
  $.ajax({
    url: "/open_task_vscode",
    type: "GET",
    data: { task_id: task_id },
    success: function (response) {
      // Handle the success response here
      console.log("Folder opened successfully:", response.message);
      // Optionally, you can show a success message to the user
    },
    error: function (xhr, status, error) {
      // Handle the error response here
      console.error("Error opening folder:", xhr.responseJSON.message);
      // Optionally, show an error message to the user
    },
  });
}

function toggleRow(element) {
  // Find all expandable rows in the table
  const allExpandableRows = document.querySelectorAll("tr.expandable");

  // Find the next sibling row of the clicked element
  const expandableRow = element.closest("tr").nextElementSibling;

  // Loop through all expandable rows to hide them
  allExpandableRows.forEach((row) => {
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
