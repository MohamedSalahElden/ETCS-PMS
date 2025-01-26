function deletefilefromdatabase(projectId, writeupId, fileId, csrfToken) {
    
    const url = `/projects/${projectId}/writeups/${writeupId}/file/${fileId}/delete/`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken, // Include CSRF token for security
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('File deleted successfully');

            // Remove the element from the DOM
            const element = document.getElementById("evedince_file_" + fileId);
            if (element) {
                element.remove();
            } else {
                console.warn(`Element with ID evedince_file_${fileId} not found`);
            }

            return data;

            
        } else {
            throw new Error('File deletion failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Rethrow for further handling if needed
    });
}
