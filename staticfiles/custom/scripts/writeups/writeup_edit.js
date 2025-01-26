
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileListContainer");
const fileListContainer = document.getElementById("fileListContainer");
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
  updateFileList(added_files , fileList);
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
  updateFileList(added_files , fileList);
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

function showFloatingCard() {
  document.getElementById("floatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function hideFloatingCard() {
  document.getElementById("floatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}


function deletefile(fileName) {
  // Remove the file from all_files_list
  all_files_list = all_files_list.filter(file => file.name !== fileName);

  // Remove the corresponding DOM element
  const fileItem = document.querySelector(`.file-item[data-file-name="${fileName.toLowerCase()}"]`);
  if (fileItem) {
    fileItem.remove();
  }

  console.log("Updated all_files_list:", all_files_list);
}
