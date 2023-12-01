const { FileToArray } = require("../../utils/utils");

const charNumbers = new Map([
    ['1', 'one'],
    ['2', 'two'],
    ['3', 'three'],
    ['4', 'four'],
    ['5', 'five'],
    ['6', 'six'],
    ['7', 'seven'],
    ['8', 'eight'],
    ['9', 'nine'],
]);

const main = async () => {
    const lines = await FileToArray('input.txt');
    let sum = 0;

    for (const line of lines) {
        let first = '';
        let last = '';
    
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (Number(char)) {
                if (!first) {
                    first = char;
                } else {
                    last = char;
                }
            } else {
                for (const [number, charNumber] of charNumbers.entries()) {
                    const index = line.indexOf(charNumber, i);
                    if (index === -1) continue;
                    if (!first && index === i) {
                        first = number;
                    } else {
                        last = number;
                    }
                }
            }
        }
    
        if (!last) last = first;
        sum += Number(first + last);
    }

    console.log(sum);
}

main();