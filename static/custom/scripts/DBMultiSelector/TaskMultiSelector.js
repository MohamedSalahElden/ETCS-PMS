class TaskMultiSelector {
        constructor(tagifyElementId) {
            this.inputElm = document.getElementById(tagifyElementId);
            this.whitelist = JSON.parse(this.inputElm.getAttribute("whitelist"));
            this.tagify = new Tagify(this.inputElm, {
                    whitelist: this.whitelist,
                    tagTextProp: "name",
                    enforceWhitelist: true,
                    skipInvalid: false,
                    dropdown: {
                        closeOnSelect: false,
                        enabled: 0,
                        classname: "users-list",
                        searchKeys: ["title", "description" , "id"],
                    },
                templates: {
                    tag: this.tagTemplate,
                    dropdownItem: this.suggestionItemTemplate,
                },
          
            });
            let jsonstring = this.inputElm.getAttribute("data-preselected")
            if (jsonstring) {
              const preselectedItems = JSON.parse(jsonstring);
              if (preselectedItems && preselectedItems.length > 0) {
                this.tagify.addTags(preselectedItems);
              }
            }
            
        
        }

        tagTemplate(tagData) {
            var icon = `
              <div class='tagify__dropdown__item__avatar-wrap me-2'>
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-checklist"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" /><path d="M14 19l2 2l4 -4" /><path d="M9 8h4" /><path d="M9 12h2" /></svg>
              </div>
              `;
            
            return `
                  <tag title="${tagData.title || tagData.description}"
                          contenteditable='false'
                          spellcheck='false'
                          tabIndex="-1"
                          class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ""}"
                          ${this.getAttributes(tagData)}>
                      <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
                      <div class="d-flex align-items-center">
                          ${icon}
                          <span class='tagify__tag-text small'>${tagData.name}</span>
                      </div>
                  </tag>
              `;
        }
          
        suggestionItemTemplate(tagData) {
            var icon = `
                  <div class='tagify__dropdown__item__avatar-wrap me-2'>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-checklist"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" /><path d="M14 19l2 2l4 -4" /><path d="M9 8h4" /><path d="M9 12h2" /></svg>
                  </div>
                  `;
            
          
            return `
              <div ${this.getAttributes(tagData)}
                  class='tagify__dropdown__item d-flex align-items-center ${
                    tagData.class ? tagData.class : ""
                  }'
                  tabindex="0"
                  role="option">
          
                  ${icon}
          
                  <div class="d-flex flex-column">
                      <strong class="small">${tagData.name}</strong>
                      <span class="text-muted small">${tagData.description}</span>
                  </div>
              </div>
          `;
        }

        getSelectedTasks() {
            const selected_data_tags = this.tagify.value;
            const tagsData = Array.from(selected_data_tags).map(tag => ({
                value: tag["value"] || null,
                name: tag['name'] || null,
                description: tag['description'] || 'unassigned'
            }));
            const tagsJsonString = JSON.stringify(tagsData);
            return tagsJsonString;
        }
      }
      