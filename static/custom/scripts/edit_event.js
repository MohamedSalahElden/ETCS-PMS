

  // Initialize Quill editor
  const quill = new Quill('#editor', {
    modules: {
      toolbar: false,
      // toolbar: [
      //   // [{ header: [1, 2, false] }], // Header options
      //   ['bold', 'italic', 'underline'], // Formatting options
      //   [{ list: 'ordered' }, { list: 'bullet' }], // List options
      //   ['code-block'], // Additional options
      // ],
    },
    class: "form-label",
    placeholder: 'Compose an epic...',
    value: 'salah',
    theme: 'snow', // or 'bubble'
  });
  
  
  // Add event listener to the button
  document.getElementById('logContent').addEventListener('click', () => {
    // Get the editor content as HTML
    const content = quill.root.innerHTML;
    console.log(content);
  });
