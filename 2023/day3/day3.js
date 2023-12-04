const { FileToArray } = require("../../utils/utils");

// Map of Maps
// First key is y pos
// Second key is x pos
const symbolMap = new Map();

const setOrAdd = (line, char, value) => {
    if (symbolMap.has(line)) {
        symbolMap.get(line).set(char, value);
    } else {
        symbolMap.set(line, new Map([[char, value]]))
    }
}

const main = async () => {
    let sum = 0;
    const lines = await FileToArray('input.txt');
    for (const [lineIndex, line] of Array.from(lines).entries()) {
        for (const [charIndex, char] of Array.from(line).entries()) {
            if (char !== '.' && Number.isNaN(Number(char))) {
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
                    if (map.has(i)) {
                        return Number(number);
                    }
                }
            }

            const above = func(symbolMap.get(lineIndex - 1));
            if (above) {
                sum += above;
                tempIndex += number.length - 1;
                continue;
            }


            const same = func(symbolMap.get(lineIndex));
            if (same) {
                sum += same;
                tempIndex += number.length - 1;
                continue;
            }

            const below = func(symbolMap.get(lineIndex + 1));
            if (below) {
                sum += below;
                tempIndex += number.length - 1;
                continue;
            }

            tempIndex += number.length - 1;
        }
    }

    console.log(sum);
}

main();