var Delta = Quill.import("delta");


// Define the mention values
const atValues = [
    { id: 1, value: "Fredrik Sundqvist" },
    { id: 2, value: "Patrik Sjölin" },
  ];
  const hashValues = [
    { id: 3, value: "Fredrik Sundqvist 2" },
    { id: 4, value: "Patrik Sjölin 2" },
  ];

var change = new Delta();

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

// get csrf token from django
function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("csrftoken=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}

var quill = new Quill("#kt_docs_quill_autosave", {
  modules: {
    syntax: true, // Enable syntax highlighting
    toolbar: [
      [{ header: [1, 2, false] }], // Header levels
      ["bold", "italic", "underline"], // Text formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["code-block"], // Code block button
      ["link", "image"], // Links and images
      ["clean"], // Remove formatting
    ],

    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      showDenotationChar: false,
      spaceAfterInsert: false,
      onSelect: (item, insertItem) => {
        const editor = quill;
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      source: (searchTerm, renderList) => {
        const values = [
          { id: 1, value: "Fredrik Sundqvist", age: 5 },
          { id: 2, value: "Patrik Sjölin", age: 20 },
        ];

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];

          values.forEach((entry) => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
    },
  },
  placeholder: "Compose an epic...",
  theme: "snow", // or 'bubble'
});

function showFloatingCard() {
  document.getElementById("floatingCard").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function hideFloatingCard() {
  document.getElementById("floatingCard").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// add the save botton to the quill tool bar when dom loaded
document.addEventListener("DOMContentLoaded", function () {
  const toolbarElement = document.querySelector(".ql-toolbar");
  if (toolbarElement) {
    // Create the span wrapper for the button
    const customButtonWrapper = document.createElement("span");
    customButtonWrapper.classList.add("ql-formats");

    // Create the custom button
    const customButton = document.createElement("button");
    customButton.type = "button";
    customButton.classList.add("ql-clean", "ql-custom-button");
    customButton.setAttribute("aria-pressed", "false");
    customButton.setAttribute("aria-label", "Custom Action");

    // Add SVG icon and text to the button
    customButton.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>`;

    // Add functionality to the button
    customButton.onclick = function () {
      showFloatingCard();
    };

    // Append the button to the wrapper
    customButtonWrapper.appendChild(customButton);

    // Append the wrapper to the toolbar
    toolbarElement.appendChild(customButtonWrapper);
  } else {
    console.error("Toolbar element not found!");
  }
});


quill.on("text-change", function (delta) {
  change = change.compose(delta);
});

// Save periodically
setInterval(function () {
  if (change.length() > 0) {
    console.log("Saving changes", change);
    save();
    change = new Delta();
  }
}, 5 * 1000);

// Check for unsaved data
window.onbeforeunload = function () {
  if (change.length() > 0) {
    return "There are unsaved changes. Are you sure you want to leave?";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
});

function save() {
  //   handle writeup content
  let contentClone = quill.root.cloneNode(true);
  content = contentClone.innerHTML;
  content = content.replace(/<code>([\s\S]*?)<\/code>/g,"<pre><code>$1</code></pre>");
  content = content.replace(/<p>PlainBashC\+\+C#CSSDiffHTML\/XMLJavaJavaScriptMarkdownPHPPythonRubySQL<\/p>/g,"");
  content = content.replace(/  /g, "&nbsp;&nbsp;"); // Replace spaces with HTML entities

  // handle form data
  const form = document.getElementById("myForm");
  const formData = new FormData(form);
  const projectId = document.getElementById("projectId").value; // Get the project ID
  all_files_list.forEach((file, index) => { formData.append('evidence_files', file, file.name); });



  // Get the CSRF token from Django
  const csrfToken = getCSRFToken();

  // Send the content to the server
  fetch(window.location.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
    },
    body: new URLSearchParams({ 
        content: content,
        formData: formData,
        
    }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Writeup saved successfully!");
      } else {
        console.error(`Error: ${data.message}`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}




