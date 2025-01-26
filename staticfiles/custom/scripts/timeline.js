



function openFolder(folderName) {
  $.ajax({
    url: "/open_folder",
    type: "GET",
    data: { folder_name: folderName },
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

function delete_event(event_id) {
$.ajax({
url: "/delete_event",
type: "GET",
data: { event_id: event_id },
success: function (response) {
  // Handle the success response here
  console.log("Folder opened successfully:", response.message);
  // Optionally, you can show a success message to the user
  location.reload();
},
error: function (xhr, status, error) {
  // Handle the error response here
  console.error("Error opening folder:", xhr.responseJSON.message);
  // Optionally, show an error message to the user
},
});
}

function toggleDropdown(element) {
const dropdown = element.nextElementSibling;
dropdown.style.display =
dropdown.style.display === "block" ? "none" : "block";
}



