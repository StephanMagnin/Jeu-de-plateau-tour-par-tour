// Animation sur la souris
let mouseCursor = document.querySelector(".cursor");

window.addEventListener('mousemove', (e) => {
    mouseCursor.style.top = e.pageY + 'px';
    mouseCursor.style.left = e.pageX + 'px';
});