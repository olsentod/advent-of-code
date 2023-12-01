const readline = require('readline');
const fs = require('fs');

exports.FileToArray = async (filename) => new Promise((res, rej) => {
    let lines = [];
    
    const fileStream = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    
    fileStream.on('line', (line) => {
        lines.push(line);
    });
    
    fileStream.on('close', () => {
        res(lines);
    });
});