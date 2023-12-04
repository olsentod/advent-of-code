// const { FileToArray } = require("../../utils/utils");

// const spiral = (lines, lineIndex, charIndex) => {
//     const above = lines[lineIndex-1];
//     const same = lines[lineIndex];
//     const below = lines[lineIndex+1];
// }

// const main = async () => {
//     let sum = 0;
//     const lines = await FileToArray('input.txt');
//     for (const [lineIndex, line] of Array.from(lines).entries()) {
//         for (const [charIndex, char] of Array.from(line).entries()) {
//             if (char === '*') {
//                 const tl = lines[lineIndex - 1] ? lines[lineIndex - 1][charIndex - 1] : null;
//                 const t = lines[lineIndex - 1] ? lines[lineIndex - 1][charIndex] : null;
//                 const tr = lines[lineIndex - 1] ? lines[lineIndex - 1][charIndex + 1] : null;
//                 const cl = lines[lineIndex] ? lines[lineIndex][charIndex - 1] : null;
//                 const cr = lines[lineIndex] ? lines[lineIndex][charIndex + 1] : null;
//                 const bl = lines[lineIndex + 1] ? lines[lineIndex + 1][charIndex - 1] : null;
//                 const b = lines[lineIndex + 1] ? lines[lineIndex + 1][charIndex] : null;
//                 const br = lines[lineIndex + 1] ? lines[lineIndex + 1][charIndex + 1] : null;
//                 // console.log(tl + t + tr + '\n' + cl + '*' + cr + '\n' + bl + b + br);

//                 if (Number.isInteger(Number(tl))) {
//                     // Check Left, then right
//                     // Check top line
//                     const split = lines[lineIndex-1].substring(charIndex-3, charIndex);
//                     console.log(split.split('.'));
//                 }
//             }
//         }
//     }
// }

// main();




const { FileToArray } = require("../../utils/utils");

// Map of Maps
// First key is y pos
// Second key is x pos
const symbolMap = new Map();


const setOrAdd = (line, char, value) => {
    if (symbolMap.has(line)) {
        symbolMap.get(line).set(char, []);
    } else {
        symbolMap.set(line, new Map([[char, []]]))
    }
}

const main = async () => {
    let sum = 0;
    const lines = await FileToArray('input.txt');
    for (const [lineIndex, line] of Array.from(lines).entries()) {
        for (const [charIndex, char] of Array.from(line).entries()) {
            if (char === '*') {
                setOrAdd(lineIndex, charIndex, char)
            }
        }
    }


    for (const [lineIndex, line] of Array.from(lines).entries()) {
        const split = line.split('');
        const row = [];
        let temp = '';
        for (const char of split) {
            if (Number.isInteger(Number(char))) {
                temp += char;
            } else {
                if (temp) {
                    row.push(temp);
                    temp = '';
                }

                row.push(char);
            }
        }
        row.push(temp)


        let tempIndex = 0;
        for (const [splitIndex, number] of row.entries()) {
            if (Number.isNaN(Number(number))) continue;
            const func = (map) => {
                if (!map) return;
                const startIndex = tempIndex + splitIndex;
                for (let i = startIndex - 1; i <= startIndex + number.length; i++) {
                    const foundGear = map.get(i);
                    if (foundGear) {
                        map.set(i, [...foundGear, Number(number)])
                        return Number(number);
                    }
                }
            }

            const above = func(symbolMap.get(lineIndex - 1));
            if (above) {
                tempIndex += number.length - 1;
                continue;
            }


            const same = func(symbolMap.get(lineIndex));
            if (same) {
                tempIndex += number.length - 1;
                continue;
            }

            const below = func(symbolMap.get(lineIndex + 1));
            if (below) {
                tempIndex += number.length - 1;
                continue;
            }

            tempIndex += number.length - 1;
        }
    }

    for (const [row, gearRow] of symbolMap.entries())  {
        for (const [column, gearColumn] of gearRow.entries()) {
            if (gearColumn.length === 2) {
                const product = gearColumn[0] * gearColumn[1];
                sum += product;
            }
        }
    }

    console.log(sum);
}

main();