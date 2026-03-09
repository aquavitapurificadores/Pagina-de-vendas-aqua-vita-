const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Add rel="noopener noreferrer" to all target="_blank" links
html = html.replace(/target="_blank"(?! rel="noopener noreferrer")/g, 'target="_blank" rel="noopener noreferrer"');

// Add a safety check to the carousel JS
html = html.replace(
    "const track = document.getElementById('carousel-track');\n            const slides = Array.from(track.children);",
    "const track = document.getElementById('carousel-track');\n            if (!track) return;\n            const slides = Array.from(track.children);"
);

fs.writeFileSync('index.html', html);
console.log('Fixed links and added JS safety check.');
