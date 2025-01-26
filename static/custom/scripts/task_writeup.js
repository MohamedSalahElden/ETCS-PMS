import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

hljs.highlightAll();

mermaid.initialize({
    theme: 'dark',
    startOnLoad: true,
    flowchart: { curve: 'basis' }
});