
function openFolder(folderName) {
  $.ajax({
    url: "/open_folder_from_events",
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
