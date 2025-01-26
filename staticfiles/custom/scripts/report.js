// Make the list sortable using SortableJS
const list = document.getElementById('draggable-list');

new Sortable(list, {
  animation: 150, // Animation speed for drag-and-drop
  scroll: true, // Enable scrolling when dragging
  scrollSensitivity: 100, // Scroll sensitivity when dragging near the edge
  scrollSpeed: 10, // Speed of scrolling
  handle: '.draggable-item', // Optional: if you want to specify a drag handle, you can add a class to the elements
  onStart(evt) {
    console.log('Dragging started');
  },
  onEnd(evt) {
    console.log('Item rearranged');
  },
});
