// Retrieve the textarea element
var inputElm = document.querySelector('textarea[name=tags]');

// Retrieve the whitelist from the textarea's attribute
var whitelist = inputElm.getAttribute('whitelist').split(", ");  // Convert the whitelist string into an array

// Initialize Tagify on the textarea
var tagify = new Tagify(inputElm, {
    enforceWhitelist: true,
    whitelist: whitelist,  // Use the whitelist from the attribute
    delimiters: ",| "  // Allow space and comma to separate tags
});

console.log(tagify)

// Chainable event listeners
tagify.on('add', function(e) {
    console.log('Tag added:', e.detail);
}).on('remove', function(e) {
    console.log('Tag removed:', e.detail);
}).on('input', function(e) {
    console.log('Input changed:', e.detail);
});



document.querySelector('form').onsubmit = function(event) {
    // Get the Tagify instance from the textarea (assuming it's initialized)
    var tagify = document.querySelector('textarea[name=tags]');

    // Retrieve the formatted tags
    var formattedTags = tagify.value;

    // Get the hidden input field
    var hiddenInput = document.getElementById('hiddenFieldForFiles');

    // Set the value of the hidden input field to the formatted tags
    hiddenInput.value = JSON.stringify(formattedTags); // You may stringify it for storage
    console.log(hiddenInput.value)
    
    // Optionally, prevent the form submission if needed (use it only if you need to handle the submission programmatically)
    // event.preventDefault(); 
};