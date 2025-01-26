const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("file-list");
const fileListContainer = document.getElementById("file-list-container");
var all_files_list = [];

// Highlight dropzone on drag events
dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

// Handle file selection through browse
dropzone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const added_files = fileInput.files; // Get all the selected files
  updateFileList(added_files);
});

if (document.getElementById("add_file_dropdown_botton")) {
  // Handle file selection through browse
  add_file_dropdown_botton.addEventListener("click", () => {
    fileInput.click();
  });
}

function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("csrftoken=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
  var added_files = event.dataTransfer.files;
  updateFileList(added_files);
});

function ControlShowFileList() {
  if (all_files_list.length > 0) {
    // To show the container
    fileListContainer.hidden = false;
  }
  else{
    fileListContainer.hidden = true;
  }
}

function updateFileList(added_files) {
  if (added_files.length > 0) {
    // Create a new array of files that should remain in added_files
    added_files = Array.from(added_files).filter((file) => {
      // Check if the file already exists in all_files_list
      const fileExists = all_files_list.some(existingFile => existingFile.name === file.name);
      
      // If it doesn't exist, add it to all_files_list and keep it in added_files
      if (!fileExists) {
        all_files_list.push(file);
        return true; // Keep the file in added_files
      }
      
      // If it exists, return false to exclude it from added_files
      return false; // Exclude the file from added_files
    });
  }
 


  // Add the new files to the list
  console.log("added files", added_files)
  
  Array.from(added_files).forEach((file) => {
    const li = document.createElement("li");
    li.style.display = "flex"; // To arrange the 'X' button and file name in a row
    li.style.alignItems = "center"; // Center align the items vertically
    li.style.cursor = "pointer"; // Make the whole list item clickable

    // Add hover effect for highlighting text
    li.addEventListener("mouseenter", () => {
      li.style.backgroundColor = "#f0f0f0"; // Light background color on hover
      li.style.transition = "background-color 0.3s ease"; // Smooth transition for background
    });

    li.addEventListener("mouseleave", () => {
      li.style.backgroundColor = ""; // Reset background color when hover ends
    });

    // Create the SVG element
    const removeButton = document.createElement("span"); // Using span instead of button for SVG
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M18 6l-12 12" /> <path d="M6 6l12 12" /> </svg>`;
    removeButton.style.marginRight = "10px"; // Add some space between the button and file name
    removeButton.style.cursor = "pointer"; // Pointer cursor for the "X"

    // Add click event to remove the file from the list
    removeButton.addEventListener("click", () => {
      
      // Remove the file from the DOM
      li.remove(); 

      // Remove the file from the all_files_list
      const fileName = file.name; // Get the file name (or use another unique identifier)
      all_files_list = all_files_list.filter(f => f.name !== fileName); // Remove the file from all_files_list

      console.log("Updated all_files_list:", all_files_list);
      ControlShowFileList();
    });


    // Add the SVG and file name to the list item
    li.appendChild(removeButton);
    li.appendChild(document.createTextNode(file.name));
    ControlShowFileList();
    // Append the list item to the file list
    fileList.appendChild(li);
    console.log(all_files_list)
  });

  
}

// function upload_file(file) {
//   const projectId = document.getElementById("projectId").value; // Get the project ID
//   const formData = new FormData(); // Create a FormData object

//   // Set form fields with exact names, using empty or default values for missing data
//   formData.append("name", file.name || ""); // Set the file name
//   formData.append("description", file.type || ""); // Set a default description (file.type used here, but you can change it)
//   formData.append("file", file); // Attach the file

//   // Add default values for the optional fields
//   formData.append("file_type", "other"); // Default file type if not provided
//   formData.append("file_status", "pending"); // Default file status
//   formData.append("confidentiality_level", "medium"); // Default confidentiality level
//   formData.append("tags", ""); // Empty tags field (default empty)
//   formData.append("related_vulnerabilities", ""); // Empty related_vulnerabilities field (default empty)

//   // Get CSRF token
//   const csrfToken = getCSRFToken();

//   // Create a new XMLHttpRequest
//   const xhr = new XMLHttpRequest();
//   xhr.open("POST", `/files/project/${projectId}/add/`, true);

//   // Add CSRF token to the headers
//   xhr.setRequestHeader("X-CSRFToken", csrfToken);

//   // Monitor progress
//   xhr.upload.addEventListener("progress", (event) => {
//     if (event.lengthComputable) {
//       const percent = Math.round((event.loaded / event.total) * 100);
//       document.getElementById("progress-bar").style.width = `${percent}%`;
//       document.getElementById(
//         "progress-text"
//       ).textContent = `uploading ${file.name}: ${percent}%`;
//     }
//   });

//   // On complete (success or error)
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       console.log("File uploaded successfully.");
//       const projectId = document.getElementById("projectId").value;
//       window.location.href = `/files/project/${projectId}/files/`;
//     } else {
//       console.error("Error uploading file:", xhr.statusText);
//       alert("An error occurred while uploading the file.");
//     }
//   };

//   xhr.onerror = function () {
//     console.error("Error uploading file.");
//     alert("An error occurred while uploading the file.");
//   };

//   // Send the file
//   xhr.send(formData);
// }





function showFloatingCard() {
  
  // Otherwise, show the floating card and overlay
  document.getElementById("floatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}




function hideFloatingCard() {
  document.getElementById("floatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
