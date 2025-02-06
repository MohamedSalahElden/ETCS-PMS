class FileHandler extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Create component template
        this.shadowRoot.innerHTML = `
            <style>
                .component {
                    background-color: #f3f3f3;
                    padding: 10px;
                    border-radius: 5px;
                }
            </style>
            <div class="component">
                <h2>Hello, World!</h2>
                <button id="myButton">Click Me</button>
            </div>
        `;

        this.shadowRoot.querySelector("#myButton").addEventListener("click", () => {
            alert("Button clicked!");
        });
    }
}

// Register the custom element
customElements.define("my-component", MyComponent);
