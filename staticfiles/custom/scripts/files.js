const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");

// Highlight dropzone on drag events
dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

// Handle file drop
dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");

  const file = event.dataTransfer.files[0];
  if (file) {
    displayFileInfo(file);
    upload_file(file);
  }
});

// Handle file selection through browse
dropzone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    displayFileInfo(file);
    upload_file(file);
  }
});

// Display file information
function displayFileInfo(file) {
//   fileInfo.textContent = `Selected file: ${file.name} (${Math.round(
//     file.size / 1024
//   )} KB)`;
}

if(document.getElementById("add_file_dropdown_botton")){
  // Handle file selection through browse
  add_file_dropdown_botton.addEventListener("click", () => {
    fileInput.click();
  });
}


function upload_file(file) {
  const formData = new FormData(); // Create a FormData object to store the file
  formData.append("file", file); // Append the file with the key "file"

  // Use Fetch API to send the file to the server
  fetch("/upload_file", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      return response.json();
    })
    .then((data) => {
      // Handle success response
      console.log("File uploaded successfully:", data);
      window.location.reload();
    })
    .catch((error) => {
      // Handle error
      console.error("Error uploading file:", error);
    });
}

function deletefile(button) {
  var file_id = button.getAttribute('fild_delete_id'); // Get the task ID
  var xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
  xhr.open("POST", "/delete_file", true); // Set up the request method and URL
  xhr.setRequestHeader("Content-Type", "application/json"); // Set content type as JSON

  // Set up the data to be sent
  var data = JSON.stringify({ id: file_id });

  // Set up the response handler
  xhr.onload = function() {
      if (xhr.status === 200) {
          // Reload the page if deletion is successful
          window.location.reload();
      } else {
          // Optionally, show an error message if the deletion fails
          alert("Error: Could not delete the file.");
      }
  };

  // Send the request with the data
  xhr.send(data);
}
