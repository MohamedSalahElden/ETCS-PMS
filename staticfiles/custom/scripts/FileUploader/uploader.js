class FileUploader {
    constructor(dropzoneId, fileInputId, fileListContainerId , progressContainerId , progressBarId , progressTextId) {
        this.dropzone = document.getElementById(dropzoneId);
        this.fileInput = document.getElementById(fileInputId);
        this.fileListContainer = document.getElementById(fileListContainerId);
        

        this.progressContainer = document.getElementById(progressContainerId);
        this.progressBar = document.getElementById(progressBarId);
        this.progressText = document.getElementById(progressTextId);


        this.allowedExtensions = ["pdf", "docx", "txt", "md", "doc"];
        this.allFilesList = [];

        if (this.dropzone) {
            this.initEventListeners();
        }
    }

    initEventListeners() {
        this.dropzone.addEventListener("dragover", (event) => {
            event.preventDefault();
            this.dropzone.classList.add("dragover");
        });

        this.dropzone.addEventListener("dragleave", () => {
            this.dropzone.classList.remove("dragover");
        });

        this.dropzone.addEventListener("click", (event) => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener("change", () => {
            const added_files = this.fileInput.files; 
            this.updateFileList(added_files);
        });

        this.dropzone.addEventListener("drop", (event) => {
            event.preventDefault();
            this.dropzone.classList.remove("dragover");
            this.updateFileList(event.dataTransfer.files);
        });

    }

    updateFileList(added_files) {
        const fileList_div = this.fileListContainer;
        if (added_files.length > 0) {
            // Filter new files that are not already in this.allFilesList
            added_files = Array.from(added_files).filter((file) => {
                const fileExists = this.allFilesList.some(existingFile => existingFile.name === file.name);
                if (!fileExists) {
                    this.allFilesList.push(file);
                    return true;
                }
                return false;
            });
        }
      
        console.log("added files", added_files);
      
      
        added_files.forEach((file) => {

            const fileItemHTML = `
                <div class="file-item" data-file-name="${file.name.toLowerCase()}">
                    <div class="file-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <h6 class="fw-semibold mb-1 cursor-pointer">${file.name}</h6>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="badge category" style="background-color: rgb(71, 71, 71); border-radius: 20px; padding: 5px 12px; font-size: 0.75rem;">${file.file_type || ''}</span>
                            <div style="height: 20px; width: 2px; background-color: gray;"></div>
                            <a href="javascript:void(0)" onclick="document.getElementById('${this.fileListContainer.id}').fileUploader.deleteFile('${file.name}')"  class="delete_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 7l16 0"/>
                                    <path d="M10 11l0 6"/>
                                    <path d="M14 11l0 6"/>
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <p class="fw-normal file-description" style="font-size: 10px;">${file.description || ''}</p>
                </div>
            `;
      
            // Append the generated HTML to the file list container
            fileList_div.insertAdjacentHTML('afterbegin', fileItemHTML);
        });
    }
      
    isValidFileName(fileName) {
        const parts = fileName.split('.');
        if (parts.length !== 2) return false;
        return parts[0] === "writeup" && this.allowedExtensions.includes(parts[1].toLowerCase());
    }

    deleteFile(fileName) {
        this.allFilesList = this.allFilesList.filter(file => file.name !== fileName);
        const fileItem = document.querySelector(`.file-item[data-file-name="${fileName.toLowerCase()}"]`);
        if (fileItem) fileItem.remove();
    }

    markFileAsUploaded(fileName){
        const fileItem = document.querySelector(`.file-item[data-file-name="${fileName.toLowerCase()}"]`);
        if (fileItem){
            const fileNameElement = fileItem.querySelector('h6');
            const fileDescriptionElement = fileItem.querySelector('.file-description');

            // Change the text color to green
            if (fileNameElement) {
                fileNameElement.style.color = 'green';
            }
            if (fileDescriptionElement) {
                fileDescriptionElement.style.color = 'green';
            }
        }
    }

    uploadFiles(backend_path , csrf_token) {
        this.allFilesList.forEach((file) => {
            this.uploadFile(file, backend_path, csrf_token);
        });
    }

    uploadFile(file, backend_path, csrf_token) {
        const formData = new FormData();
        formData.append(file.name , file);
        formData.append("csrfmiddlewaretoken", csrf_token);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", backend_path, true);

        xhr.upload.addEventListener("progress", (event) => {
            this.progressContainer.style.display = 'block';
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                this.progressBar.style.width = percentComplete + "%";
                this.progressText.textContent = `Uploading ${file.name}`;
            }
        });

        xhr.addEventListener("load", (event) => {
            this.progressBar.style.width = "100%";
            this.progressText.textContent = "100%";
            this.progressContainer.style.display = 'none';
            this.markFileAsUploaded(file.name);
            this.allFilesList = this.allFilesList.filter(file => file.name !== file.name);
            console.log("the remaining files")
            console.log(this.allFilesList)
        });

        xhr.send(formData);

        if(xhr.status == 200){

        }
    }

    getFiles() {
        return this.allFilesList;
    }
}

