class TagifyMultiSelector {
    constructor(inputElement) {
        this.inputElement = inputElement;
        this.whitelist = this.getWhitelist();
        this.tagify = this.initTagify();
    }

    initTagify() {
        new Tagify(this.inputElement, {
            whitelist: this.whitelist,
            tagTextProp: "name",
            enforceWhitelist: true,
            skipInvalid: true,
            whitelist: usersList,
            dropdown: {
                closeOnSelect: false,
                enabled: 0,
                classname: "users-list",
                searchKeys: ["name", "email"],
              },
            templates: {
                tag: (tagData) => this.tagTemplate(tagData)
            }
        });
        tagify.on("dropdown:show dropdown:updated", this.onDropdownShow);
        tagify.on("dropdown:select", this.onSelectSuggestion);
        
        document.addEventListener("DOMContentLoaded", function () {
            const preselectedItems = JSON.parse(inputElm.getAttribute("data-preselected"));
            
            // Add the preselected items to the Tagify field
            if (preselectedItems && preselectedItems.length > 0) {
              tagify.addTags(preselectedItems);
            }
        });
        return tagify;
    }

    getWhitelist() {
        const whitelistAttr = this.inputElement.getAttribute("whitelist");
        return whitelistAttr ? JSON.parse(whitelistAttr) : [];
    }

    tagTemplate(tagData) {
        let icon;
        switch (tagData.file_type) {
            case "pdf":
                icon = this.getIcon("pdf");
                break;
            case "doc":
                icon = this.getIcon("doc");
                break;
            case "image":
                icon = this.getIcon("image");
                break;
            case "txt":
                icon = this.getIcon("txt");
                break;
            case "bin":
                icon = this.getIcon("bin");
                break;
            default:
                icon = this.getIcon("default");
        }

        return `<tag title="${tagData.title || tagData.email}" class="tagify__tag">
                    ${icon}
                    <span class="tagify__tag-text">${tagData.name}</span>
                </tag>`;
    }

    getIcon(fileType) {
        const icons = {
            pdf: `<div class='tagify__dropdown__item__avatar-wrap me-2'>📄</div>`,
            doc: `<div class='tagify__dropdown__item__avatar-wrap me-2'>📃</div>`,
            image: `<div class='tagify__dropdown__item__avatar-wrap me-2'>🖼️</div>`,
            txt: `<div class='tagify__dropdown__item__avatar-wrap me-2'>📜</div>`,
            bin: `<div class='tagify__dropdown__item__avatar-wrap me-2'>💾</div>`,
            default: `<div class='tagify__dropdown__item__avatar-wrap me-2'>📁</div>`
        };
        return icons[fileType] || icons.default;
    }

    getAddAllSuggestionsElm() {
        return tagify.parseTemplate('dropdownItem', [{
            class: "addAll",
            name: "Add all",
            email: tagify.settings.whitelist.reduce(function (remainingSuggestions, item) {
                return tagify.isTagDuplicate(item.value) ? remainingSuggestions : remainingSuggestions + 1;
            }, 0) + " Members"
        }]);
    }

    onDropdownShow(e) {
        var dropdownContentElm = e.detail.tagify.DOM.dropdown.content;
      
        if (tagify.suggestedListItems.length > 1) {
          addAllSuggestionsElm = getAddAllSuggestionsElm();
      
          dropdownContentElm.insertBefore(
            addAllSuggestionsElm,
            dropdownContentElm.firstChild
          );
        }
      }
      
    onSelectSuggestion(e) {
        if (e.detail.elm == addAllSuggestionsElm)
            tagify.dropdown.selectAll.call(tagify);
    }


}

// كيفية الاستخدام:
// const inputElm = document.querySelector("#file-tags");
// if (inputElm) {
//     new TagifyMultiSelector(inputElm);
// }
