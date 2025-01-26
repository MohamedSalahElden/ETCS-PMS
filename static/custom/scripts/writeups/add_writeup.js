function get_tagify_selected_values () {
    // Select all elements with the class 'tagify__tag'
    const tags = document.querySelectorAll('.tagify__tag');

    // Map over the NodeList to extract attributes and construct objects
    const tagsData = Array.from(tags).map(tag => ({
        value: tag.getAttribute('value') || null,
        name: tag.getAttribute('name') || null,
        file_type: tag.getAttribute('file_type') || 'unknown',
        email: tag.getAttribute('email') || 'unassigned'
    }));

    // Convert the array of objects to a JSON-like string
    const tagsJsonString = JSON.stringify(tagsData);

    console.log(tagsJsonString);

};


function SubmitForm() {

    const form = document.getElementById("myForm");
    const formData = new FormData(form);

    const projectId = document.getElementById("projectId").value; // Get the project ID
    
    all_files_list.forEach((file, index) => {
        formData.append('evidence_files', file, file.name); 
      });

    // Get CSRF token
    const csrfToken = getCSRFToken();

    // Create a new XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/projects/${projectId}/writeups/add/`, true);

    // Add CSRF token to the headers
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    
    
    // On complete (success or error)
    xhr.onload = function () {
    if (xhr.status === 200) {
        console.log("File uploaded successfully.");
        const projectId = document.getElementById("projectId").value;
        window.location.href = `/projects/${projectId}/writeups/`;
    } else {
        console.error("Error uploading file:", xhr.statusText);
        alert("An error occurred while uploading the file.");
        }
    };

    xhr.onerror = function () {
        console.error("Error uploading file.");
        alert("An error occurred while uploading the file.");
    };

    // Send the file
    xhr.send(formData);
  }
  


