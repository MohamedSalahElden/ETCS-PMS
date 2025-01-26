
  
function generate_report(event) {
  event.preventDefault(); // Prevent default link behavior

  // Trigger file download by redirecting the browser
  window.location.href = "/generate_report";
}
  

  function openProjectFolder(task_id) {
    $.ajax({
    url: "/open_project_folder",
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