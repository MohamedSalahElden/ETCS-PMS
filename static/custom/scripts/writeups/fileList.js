const allowedExtensions = ["pdf", "docx", "txt" , "md", "doc"];
function isValidFileName(fileName, allowedExtensions) {
  const parts = fileName.split('.');
  if (parts.length !== 2) {return false;}
  const [name, extension] = parts;
  return name === "writeup" && allowedExtensions.includes(extension.toLowerCase());
}




function updateFileList(added_files, fileList_div) {
  console.log(fileList_div);
  if (added_files.length > 0) {
      // Filter new files that are not already in all_files_list
      added_files = Array.from(added_files).filter((file) => {
          const fileExists = all_files_list.some(existingFile => existingFile.name === file.name);
          if (!fileExists) {
              all_files_list.push(file);
              return true;
          }
          return false;
      });
  }

  console.log("added files", added_files);


  added_files.forEach((file) => {
      style  = '';
      if (isValidFileName(file.name , allowedExtensions)){
        style = 'style="color: red; font-weight: bold;"';
      }
      const fileItemHTML = `
          <div class="file-item" data-file-name="${file.name.toLowerCase()}">
              <div class="file-header" style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center;">
                      <h6 class="fw-semibold mb-1 cursor-pointer" ${style}>${file.name}</h6>
                  </div>
                  <div style="display: flex; gap: 10px; align-items: center;">
                      <span class="badge category" style="background-color: rgb(71, 71, 71); border-radius: 20px; padding: 5px 12px; font-size: 0.75rem;">${file.file_type || ''}</span>
                      <div style="height: 20px; width: 2px; background-color: gray;"></div>
                      <a href="javascript:void(0)" onclick="deletefile('${file.name}')" class="delete_icon">
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
      fileList_div.insertAdjacentHTML('beforeend', fileItemHTML);

      console.log(all_files_list);
  });
}




