const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'path', 'circle', 'polyline', 'line', 'polygon']);
const stack = [];
const regex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;

let match;
let lineNum = 1;
let lastIndex = 0;

while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const isClosing = match[0].startsWith('</');
    
    // Count lines
    const textBefore = html.substring(lastIndex, match.index);
    lineNum += (textBefore.match(/\n/g) || []).length;
    lastIndex = match.index;

    if (selfClosing.has(tag)) continue;

    if (isClosing) {
        if (stack.length === 0) {
            console.error(`Unmatched closing tag </${tag}> at line ${lineNum}`);
        } else {
            const last = stack.pop();
            if (last.tag !== tag) {
                console.error(`Mismatched tags: expected </${last.tag}> but found </${tag}> at line ${lineNum}`);
            }
        }
    } else {
        stack.push({ tag, line: lineNum });
    }
}

if (stack.length > 0) {
    console.error('Unclosed tags:', stack);
} else {
    console.log('HTML tags are perfectly balanced!');
}
