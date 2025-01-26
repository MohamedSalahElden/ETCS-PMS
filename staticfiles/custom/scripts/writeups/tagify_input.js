var tagify_element_id = "related_file_multi_sekect";
var inputElm = document.getElementById(tagify_element_id);
const usersList = JSON.parse(inputElm.getAttribute("whitelist"));


function tagTemplate(tagData) {
  var icon = `
    <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>
    </div>
    `;
  if (tagData.file_type === "pdf") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pdf"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z" /><path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" /><path d="M17 12h3" /><path d="M21 8h-4v8" /></svg>
        </div>
        `;
  } else if (tagData.file_type === "doc") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-docx"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M2 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M17 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M9.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z" /><path d="M19.5 15l3 6" /><path d="M19.5 21l3 -6" /></svg>
        </div>`;
  } else if (tagData.file_type === "image") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
        </div>`;
  } else if (tagData.file_type === "txt") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-txt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 8h4" /><path d="M5 8v8" /><path d="M17 8h4" /><path d="M19 8v8" /><path d="M10 8l4 8" /><path d="M10 16l4 -8" /></svg>
        </div>`;
  } else if (tagData.file_type === "bin") {
    `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
            '<svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-binary"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 10v-5h-1m8 14v-5h-1" /><path d="M15 5m0 .5a.5 .5 0 0 1 .5 -.5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5z" /><path d="M10 14m0 .5a.5 .5 0 0 1 .5 -.5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5z" /><path d="M6 10h.01m-.01 9h.01" /></svg>'
        </div>`;
  }

  return `
        <tag title="${tagData.title || tagData.email}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="-1"
                class="${this.settings.classNames.tag} ${
    tagData.class ? tagData.class : ""
  }"
                ${this.getAttributes(tagData)}>
            <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
            <div class="d-flex align-items-center">
                ${icon}
                <span class='tagify__tag-text'>${tagData.name}</span>
            </div>
        </tag>
    `;
}

function suggestionItemTemplate(tagData) {
  var icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>
        </div>
        `;
  if (tagData.file_type === "pdf") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pdf"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z" /><path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" /><path d="M17 12h3" /><path d="M21 8h-4v8" /></svg>
        </div>
        `;
  } else if (tagData.file_type === "doc") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-docx"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M2 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M17 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M9.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z" /><path d="M19.5 15l3 6" /><path d="M19.5 21l3 -6" /></svg>
        </div>`;
  } else if (tagData.file_type === "image") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
        </div>`;
  } else if (tagData.file_type === "txt") {
    icon = `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-txt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 8h4" /><path d="M5 8v8" /><path d="M17 8h4" /><path d="M19 8v8" /><path d="M10 8l4 8" /><path d="M10 16l4 -8" /></svg>
        </div>`;
  } else if (tagData.file_type === "bin") {
    `
        <div class='tagify__dropdown__item__avatar-wrap me-2'>
            '<svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-binary"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 10v-5h-1m8 14v-5h-1" /><path d="M15 5m0 .5a.5 .5 0 0 1 .5 -.5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5z" /><path d="M10 14m0 .5a.5 .5 0 0 1 .5 -.5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5z" /><path d="M6 10h.01m-.01 9h.01" /></svg>'
        </div>`;
  }

  return `
    <div ${this.getAttributes(tagData)}
        class='tagify__dropdown__item d-flex align-items-center ${
          tagData.class ? tagData.class : ""
        }'
        tabindex="0"
        role="option">

        ${icon}

        <div class="d-flex flex-column">
            <strong>${tagData.name}</strong>
            <span>${tagData.email}</span>
        </div>
    </div>
`;
}

var tagify = new Tagify(inputElm, {
  tagTextProp: "name",
  enforceWhitelist: true,
  skipInvalid: true,
  dropdown: {
    closeOnSelect: false,
    enabled: 0,
    classname: "users-list",
    searchKeys: ["name", "email"],
  },
  templates: {
    tag: tagTemplate,
    dropdownItem: suggestionItemTemplate,
  },
  whitelist: usersList,
});

tagify.on("dropdown:show dropdown:updated", onDropdownShow);
tagify.on("dropdown:select", onSelectSuggestion);

var addAllSuggestionsElm;

function onDropdownShow(e) {
  var dropdownContentElm = e.detail.tagify.DOM.dropdown.content;

  if (tagify.suggestedListItems.length > 1) {
    addAllSuggestionsElm = getAddAllSuggestionsElm();

    dropdownContentElm.insertBefore(
      addAllSuggestionsElm,
      dropdownContentElm.firstChild
    );
  }
}

function onSelectSuggestion(e) {
  if (e.detail.elm == addAllSuggestionsElm)
    tagify.dropdown.selectAll.call(tagify);
}

function getAddAllSuggestionsElm() {
    return tagify.parseTemplate('dropdownItem', [{
        class: "addAll",
        name: "Add all",
        email: tagify.settings.whitelist.reduce(function (remainingSuggestions, item) {
            return tagify.isTagDuplicate(item.value) ? remainingSuggestions : remainingSuggestions + 1;
        }, 0) + " Members"
    }]);
}
