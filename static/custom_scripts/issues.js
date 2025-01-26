// used to handle options from file xlsx
var dropdownItems = [];
var uploaded_file = false;

// listener for options files xlsx
document.getElementById("list_file_upload").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Get the first sheet's name
      const sheetName = workbook.SheetNames[0];

      // Get the first sheet's data
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log(jsonData); // Array of arrays representing the sheet
      uploaded_file = true;
      dropdownItems = jsonData;
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
});

// delete field from form
function deleteField(elementId) {
  // If the elementId ends with "_item", remove the "_item" part

  elementId = elementId + "_div";

  console.log(elementId);

  // Find the element by its ID
  const element = document.getElementById(elementId);

  // Check if the element exists before removing it
  if (element) {
    element.remove(); // Remove the element from the DOM
  }

  if (elementId.includes("_item")) {
    list_elementId = elementId.replace("_item", "_list");
    // Find the element by its ID
    const list_element = document.getElementById(list_elementId);
    console.log(list_element);

    // Check if the element exists before removing it
    if (list_element) {
      list_element.remove(); // Remove the element from the DOM
    }
  }
}

// get all the fields ids to avoid duplication
function check_if_exist(id_to_be_checked) {
  const f = document.getElementById("issue_form");

  // Select all form elements (input, select, textarea, etc.)
  const form_elements = f.querySelectorAll("*"); // This selects all child elements

  // Loop through the elements
  for (let element of form_elements) {
    if (id_to_be_checked === element.id) {
      console.log(`${id_to_be_checked} === ${element.id}`);
      return true; // Exit and return true if IDs match
    }
  }

  return false; // Return false if no match is found
}


function getFirstInputFieldId(formId) {
  // Get the form element by its ID
  const form = document.getElementById(formId);

  // Ensure the form exists
  if (!form) {
      console.log("Form not found.");
      return null;
  }

  // Get the first input field in the form
  const firstInput = form.querySelector("input");

  // Check if the first input field exists and has an ID
  if (firstInput && firstInput.id) {
      return firstInput.id; // Return the ID of the first input field
  } else {
      console.log("No input field with an ID found.");
      return null; // Return null if no input field with an ID is found
  }
}




// add new field to form
function addField_v2() {
  const added_field_name = document.getElementById("added_field_name").value;
  const added_field_id   = document.getElementById("added_field_id").value;
  const added_field_type = document.getElementById("added_field_type").value;
  const added_field_description = document.getElementById("added_field_description").value;

  if(check_if_exist(added_field_id + "_input")){
    alert(`Field id "${added_field_id}" already exists`);
    return;
  }
    

  const firstInputId = getFirstInputFieldId("issue_form");
  if (firstInputId === "title_input") {
  } else {
    if(added_field_id === "title" && added_field_type === "slt"){

    }
    else{
      alert("The field ID must 'title' and of type 'slt' ");
    return;
    } 
  }
  

  // Regular expression to check for alphanumeric characters only (no spaces)
  const isValid = /^[a-zA-Z0-9_]+$/.test(added_field_id);
  if (!isValid) {
      alert("The field ID must be alphanumeric and cannot contain spaces.");
      return;
  } 



  // Retrieve the form element location
  const issue_form = document.getElementById("other_fields");

  // Create a div element
  const field_div = document.createElement("div");
  field_div.className = "mb-3";
  field_div.setAttribute("related_to" , added_field_id)
  field_div.id = added_field_id + "_div";

  // Create a label element
  const form_label_div = document.createElement("div");
  form_label_div.className = "form-group";
  form_label_div.setAttribute("related_to" , added_field_id)
  const label = document.createElement("label");
  label.for = added_field_name;
  label.className = "form-label";
  label.textContent = added_field_name;
  const delete_icon = document.createElement("i");
  delete_icon.className = "ti ti-trash delete-icon";
  delete_icon.onclick = function () {
    deleteField(added_field_id);
  };
  form_label_div.appendChild(label);
  form_label_div.appendChild(delete_icon);

  if (added_field_type === "slt") {
    const input = document.createElement("input");
    input.setAttribute("data-role", "important");
    input.setAttribute("custom_type", "slt");
    input.setAttribute("include_in_report", true);
    input.setAttribute("include_in_database", true);
    input.setAttribute("required", true);
    input.setAttribute("related_to" , added_field_id)
    input.name = added_field_name;
    input.id = added_field_id + "_input";
    input.type = "text";
    input.className = "form-control";
    input.placeholder = added_field_description;

    field_div.appendChild(form_label_div);
    field_div.appendChild(input);

    issue_form.appendChild(field_div);
    hideFloatingCard();
    return;
  } else if (added_field_type === "mlt") {
    const input = document.createElement("textarea");
    input.name = added_field_name;
    input.id = added_field_id + "_input";
    input.className = "form-control";
    input.placeholder = added_field_description;
    input.rows = "4";
    input.setAttribute("include_in_report", true);
    input.setAttribute("include_in_database", true);
    input.setAttribute("required", true);
    input.setAttribute("related_to" , added_field_id)
    input.setAttribute("data-role", "important");
    input.setAttribute("custom_type", "mlt");

    field_div.appendChild(form_label_div);
    field_div.appendChild(input);

    issue_form.appendChild(field_div);
    hideFloatingCard();
    return;
  }

  // single select
  else if (added_field_type === "ss") {
    input = document.createElement("select");
    input.name = added_field_name;
    input.id = added_field_id + "_input";
    input.className = "form-control";
    input.placeholder = added_field_description;
    input.setAttribute("data-role", "important");
    input.setAttribute("custom_type", "ss");
    input.setAttribute("include_in_report", true);
    input.setAttribute("include_in_database", true);
    input.setAttribute("required", true);
    input.setAttribute("related_to" , added_field_id)

    if (!uploaded_file) {
      dropdownItems = []
      // get options from list
      const dropdownList = document.querySelectorAll("#dropdownList li");
      dropdownList.forEach((item) => {
        dropdownItems.push(item.textContent);
      });
      // Add dropdown items as options in the select element
      dropdownItems.forEach((text) => {
        const option = document.createElement("option");
        option.value = text; // Use the item text as the value
        option.textContent = text; // Set the visible text for the option
        input.appendChild(option);
      });
    } else {

      //  get options from file 
      dropdownItems.forEach((text) => {
        const option = document.createElement("option");
        option.value = text; // Use the item text as the value
        option.textContent = text; // Set the visible text for the option
        input.appendChild(option);
      });
      uploaded_file = false;
    }

    field_div.appendChild(form_label_div);
    field_div.appendChild(input);

    issue_form.appendChild(field_div);

    hideFloatingCard();
    return;
  }

  // multi select
  else if (added_field_type === "ms") {
    input = document.createElement("div");
    input.className = "d-flex align-items-center";
    input.name = added_field_name;
    input.id = added_field_id + "_input";
    

    const input_field = document.createElement("select");
    input_field.type = "text";
    input_field.id = added_field_id + "_item";
    input_field.className = "form-control me-2";
    input_field.name = added_field_name;
    input_field.placeholder = "Enter item";
    input_field.setAttribute("custom_type", "ms");
    input_field.setAttribute("data-role", "important");
    input_field.setAttribute("include_in_report", false);
    input_field.setAttribute("include_in_database", true);
    input_field.setAttribute("required", true);
    input_field.setAttribute("related_to" , added_field_id)

    const dropdownList_ = document.createElement("ul");
    dropdownList_.setAttribute("data-role", "important");
    dropdownList_.setAttribute("include_in_report", true);
    dropdownList_.setAttribute("include_in_database", true);
    dropdownList_.setAttribute("required", true);
    dropdownList_.setAttribute("related_to" , added_field_id);
    dropdownList_.setAttribute("name_in_report", added_field_name);
    dropdownList_.name = added_field_name;

    const dropdownList = document.querySelectorAll("#dropdownList li");
    dropdownList_.id = added_field_id + "_list";
    dropdownList_.className = "list-group mt-2";

    if (uploaded_file) {
      dropdownItems.forEach((text) => {
        const option = document.createElement("option");
        option.value = text; // Use the item text as the value
        option.textContent = text; // Set the visible text for the option
        input_field.appendChild(option);
      });
      uploaded_file = false
    } else {
      dropdownItems = []
      const dropdownList = document.querySelectorAll("#dropdownList li");
      dropdownList.forEach((item) => {
        dropdownItems.push(item.textContent);
      });
      // Add dropdown items as options in the select element
      dropdownItems.forEach((text) => {
        const option = document.createElement("option");
        option.value = text; // Use the item text as the value
        option.textContent = text; // Set the visible text for the option
        input_field.appendChild(option);
      });
    }

    const addBtn = document.createElement("i");
    addBtn.id = "add-button";
    addBtn.className = "ti ti-plus";
    addBtn.onclick = function () {
      addDropdownItemInIssuesForm(
        added_field_id + "_item",
        added_field_id + "_list"
      );
    };

    input.appendChild(input_field);
    input.appendChild(addBtn);

    input.placeholder = document.getElementById(
      "added_field_description"
    ).value;

    field_div.appendChild(form_label_div);
    field_div.appendChild(input);
    field_div.appendChild(dropdownList_);

    issue_form.appendChild(field_div);

    console.log(issue_form);

    hideFloatingCard();
    return;
  }
}

// add item when selecting element from multi select "ms" field {used in issues form}
function addDropdownItemInIssuesForm(dropdown_item, drop_down_list) {
  console.log("dropdown_item = " + dropdown_item);
  console.log("drop_down_list = " + drop_down_list);
  const dropdownItem = document.getElementById(dropdown_item).value;
  const dropdownList = document.getElementById(drop_down_list);

  if (dropdownItem.trim() !== "") {
    // Create a new list item
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = dropdownItem;

    // Add delete button
    const deleteBtn = document.createElement("i");
    deleteBtn.className = "ti ti-trash";
    deleteBtn.textContent = "";
    deleteBtn.onclick = function () {
      li.remove();
    };

    li.appendChild(deleteBtn);
    dropdownList.appendChild(li);

    // Clear the input field
    document.getElementById(dropdown_item).value = "";
  }
}

// function for floating card that shows the "add options" in single select and multi select fields
function toggleDropdownField() {
  const fieldType = document.getElementById("added_field_type").value;
  const dropdownField = document.getElementById("dropdownField");

  if (fieldType === "ss" || fieldType === "ms") {
    dropdownField.style.display = "block"; // Show dropdown-related fields
  } else {
    dropdownField.style.display = "none"; // Hide dropdown-related fields
  }
}

// add item when selecting element from multi select "ms" field {used in floating card}
function addDropdownItem() {
  const dropdownItem = document.getElementById("dropdown_item").value;
  const dropdownList = document.getElementById("dropdownList");

  if (dropdownItem.trim() !== "") {
    // Create a new list item
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = dropdownItem;

    // Add delete button
    const deleteBtn = document.createElement("i");
    deleteBtn.className = "ti ti-trash";
    deleteBtn.textContent = "";
    deleteBtn.onclick = function () {
      li.remove();
    };

    li.appendChild(deleteBtn);
    dropdownList.appendChild(li);

    // Clear the input field
    document.getElementById("dropdown_item").value = "";
  }
}

// function to show the floating card or add new fields
function showFloatingCard() {
  document.getElementById("floatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// function to hide the floating card or add new fields
function hideFloatingCard() {
  document.getElementById("floatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// function to validate that no field is left blank
function validateForm() {
  const formElements = document.querySelectorAll('[include_in_report="true"]');
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    if (element.localName === "ul") {
      const dropdownList = element.querySelectorAll("li");
      if (dropdownList.length === 0) {
        alert(`Please add at least one item to the ${element.name} field.`);
        return false;
      }
    }
    // else
    // if (element.value.trim() === "") {
    //   alert(`Please fill out the ${element.name} field.`);
    //   return false;
    // }
  }
  return true;
}

// // function to send issue data and issue template to the server
// function submitForm() {
//   // /////////////// get data ////////////////////////
//   if (!validateForm()) {
//     return;
//   }

//   const form = document.getElementById("issue_form");
//   const addedFields = [];
//   const formElements = form.querySelectorAll('[data-role="important"]');
//   for (let i = 0; i < formElements.length; i++) {
//     const element = formElements[i];
//     console.log(element);
//     if (element.localName === "ul") {
//       const dropdownItems = [];
//       const dropdownList = element.querySelectorAll("li");
//       dropdownList.forEach((item) => {
//         dropdownItems.push(item.textContent);
//       });
//       const field = {
//         name: element.id,
//         value: dropdownItems,
//       };
//       addedFields.push(field);
//     } else if (element.localName === "select") {
//       const field = {
//         name: element.name,
//         value: element.value,
//       };
//       addedFields.push(field);
//     } else {
//       const field = {
//         name: element.name,
//         value: element.value,
//       };
//       addedFields.push(field);
//     }
//   }

//   console.log(addedFields);

//   // /////////////// get template ////////////////////////

//   // Retrieve the form element or the container that holds your fields
//   const form_for_template = document.getElementById("issue_form");

//   // Create an array to hold the field data
//   const addedFields_for_template = [];

//   // Loop through all the form elements and get the attributes
//   const formElements_for_template = form.querySelectorAll(
//     "input, select, textarea, ul"
//   ); // Select the relevant elements
//   for (let i = 0; i < formElements.length; i++) {
//     const element = formElements[i];
//     var inner_html = element.innerHTML;
//     var dropdownItems = [];
//     if (inner_html) {
//       const options = element.querySelectorAll("option");
//       options.forEach((option) => {
//         console.log(option);
//         const optionValue = option.value; // Extract value attribute
//         const optionText = option.textContent; // Extract text inside the option

//         // Print the value and text
//         console.log(`Value: ${optionValue}, Text: ${optionText}`);
//         dropdownItems.push({ value: optionValue, text: optionText });
//       });
//       inner_html = dropdownItems;
//     }

//     const field = {
//       tagName: element.tagName.toLowerCase(),
//       id: element.id || "",
//       name: element.name || "",
//       classList: [...element.classList], // Get the classes as an array
//       attributes: {}, // Store all attributes of the element
//       value: element.value || "", // Get value for input, select, textarea elements
//       innerHTML: inner_html || "", // For ul elements, get the inner content
//     };

//     // Loop through all attributes of the element and add them to the field object
//     Array.from(element.attributes).forEach((attr) => {
//       field.attributes[attr.name] = attr.value;
//     });

//     // Push the field data into the addedFields array
//     addedFields_for_template.push(field);
//   }

//   // Send AJAX request with form data
//   fetch("/add_issue", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json", // Specify JSON content type
//     },
//     body: JSON.stringify({
//       data: addedFields,
//       template: addedFields_for_template,
//     }), // Serialize the addedFields array to JSON
//   })
//     .then((response) => response.json()) // Expecting JSON from server
//     .then((data) => {
//       if (data.redirect_url) {
//         window.location.href = data.redirect_url; // Redirect to the new page
//       }
//     })
//     .catch((error) => console.error("Error:", error));
// }

// function to save the form as a template
function saveAsTemplate() {
  // Retrieve the form element or the container that holds your fields
  const form = document.getElementById("issue_form");
  const template_name = document.getElementById(
    "template_name_input_field"
  ).value;

  if (
    !document.getElementById("template_name_input_field").style.display ===
    "none"
  ) {
  } else {
    if (document.getElementById("template_name_input_field").value === ""){
      alert("Please enter a template name.");
      return;
    }
  }
  hideNamingFloatingCard();
  // Create an array to hold the field data
  const addedFields = [];

  // Loop through all the form elements and get the attributes
  const formElements = form.querySelectorAll("input, select, textarea, ul"); // Select the relevant elements
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    var inner_html = element.innerHTML;
    var dropdownItems = [];
    if (inner_html) {
      const options = element.querySelectorAll("option");
      options.forEach((option) => {
        console.log(option);
        const optionValue = option.value; // Extract value attribute
        const optionText = option.textContent; // Extract text inside the option

        // Print the value and text
        console.log(`Value: ${optionValue}, Text: ${optionText}`);
        dropdownItems.push({ value: optionValue, text: optionText });
      });
      inner_html = dropdownItems;
    }

    const field = {
      tagName: element.tagName.toLowerCase(),
      id: element.id || "",
      name: element.name || "",
      classList: [...element.classList], // Get the classes as an array
      attributes: {}, // Store all attributes of the element
      value: element.value || "", // Get value for input, select, textarea elements
      innerHTML: inner_html || "", // For ul elements, get the inner content
    };

    // Loop through all attributes of the element and add them to the field object
    Array.from(element.attributes).forEach((attr) => {
      field.attributes[attr.name] = attr.value;
    });

    // Push the field data into the addedFields array
    addedFields.push(field);
  }

  // Log the fields to the console (you can replace this with your saving logic)
  // console.log(addedFields);

  // Optionally, send this data to the server or store it locally
  // For example, send the data via an AJAX request (you can replace this with your actual server URL)
  fetch("/save_template", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: template_name, fields: addedFields }), // Send the field data as JSON
  })
    .then((response) => {
      // Check if the response is ok and if it's a JSON response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Check for valid JSON response
      return response.json();
    })
    .then((data) => {
      console.log("Template saved:", data);
    })
    .catch((error) => {
      // Log errors in case of any issues
      console.error("Error saving template:", error);
    });
}

// function to show the floating card for naming the template
function showNamingFloatingCard() {
  document.getElementById("namingFloatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// function to hide the floating card for naming the template
function hideNamingFloatingCard() {
  document.getElementById("namingFloatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}



function getFieldsData(){
  const form = document.getElementById("issue_form");
  const addedFields = [];
  const formElements = form.querySelectorAll('[data-role="important"]');
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    console.log(element);
    if (element.localName === "ul") {
      const dropdownItems = [];
      const dropdownList = element.querySelectorAll("li");
      dropdownList.forEach((item) => {
        text = item.textContent.replace(/\n/g, '').trim()
        dropdownItems.push(text);
      });
      const field = {
        name: element.id,
        value: dropdownItems,
      };
      addedFields.push(field);
    } else if (element.localName === "select") {
      const field = {
        name: element.name,
        value: element.value,
      };
      addedFields.push(field);
    } else {
      const field = {
        name: element.name,
        value: element.value,
      };
      addedFields.push(field);
    }
  }

  console.log(addedFields);
  return addedFields;
}


function getTemplate(){
    // /////////////// get template ////////////////////////

  // Retrieve the form element or the container that holds your fields
  const form_for_template = document.getElementById("issue_form");

  // Create an array to hold the field data
  const addedFields_for_template = [];

  // Loop through all the form elements and get the attributes
  const formElements_for_template = form_for_template.querySelectorAll("input, select, textarea, ul"); // Select the relevant elements
  for (let i = 0; i < formElements_for_template.length; i++) {
    const element = formElements_for_template[i];
    var inner_html = element.innerHTML;
    var dropdownItems = [];
    if (inner_html) {
      const options = element.querySelectorAll("option");
      options.forEach((option) => {
        // console.log(option);
        const optionValue = option.value; // Extract value attribute
        const optionText = option.textContent.trim().replace(/\n/g, '').trim(); // Extract text inside the option

        // Print the value and text
        console.log(`Value: ${optionValue}, Text: ${optionText}`);
        dropdownItems.push({ value: optionValue, text: optionText });
      });
      inner_html = dropdownItems;
    }

    const field = {
      tagName: element.tagName.toLowerCase(),
      id: element.id || "",
      name: element.name || "",
      classList: [...element.classList], // Get the classes as an array
      attributes: {}, // Store all attributes of the element
      value: element.value || "", // Get value for input, select, textarea elements
      innerHTML: inner_html || "", // For ul elements, get the inner content
    };

    // Loop through all attributes of the element and add them to the field object
    Array.from(element.attributes).forEach((attr) => {
      field.attributes[attr.name] = attr.value;
    });

    // Push the field data into the addedFields array
    addedFields_for_template.push(field);
  }
  console.log(addedFields_for_template);
  return addedFields_for_template;

}


// function to send issue data and issue template to the server
function submitEdit(issue_id) {
  // /////////////// get data ////////////////////////
  if (!validateForm()) {
    return;
  }

  data = getFieldsData();
  console.log(data)
  template = getTemplate();


  // Send AJAX request with form data
  fetch("/edit_issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    },
    body: JSON.stringify({
      issue_id  : issue_id,
      data: data,
      template: template,
    }), // Serialize the addedFields array to JSON
  })
    .then((response) => response.json()) // Expecting JSON from server
    .then((data) => {
      if (data.redirect_url) {
        window.location.href = data.redirect_url; // Redirect to the new page
      }
    })
    .catch((error) => console.error("Error:", error));
}



// function to send issue data and issue template to the server
function submitForm() {
  data = getFieldsData()

  template = getTemplate()

  // Send AJAX request with form data
  fetch("/add_issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    },
    body: JSON.stringify({
      data: data,
      template: template,
    }), // Serialize the addedFields array to JSON
  })
    .then((response) => response.json()) // Expecting JSON from server
    .then((data) => {
      if (data.redirect_url) {
        window.location.href = data.redirect_url; // Redirect to the new page
      }
    })
    .catch((error) => console.error("Error:", error));
}