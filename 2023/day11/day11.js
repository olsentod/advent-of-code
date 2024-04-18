const { FileToArray } = require("../../utils/utils");

const main = async () => {
    const lines = await FileToArray('input.txt');

    const emptyRows = [];
    const emptyColumns = [];

    for (const [index, line] of Object.entries(lines)) {
        if (Array.from(line).every((c) => c === '.')) {
            emptyRows.push(Number(index));
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const column = [];
        for (let j = 0; j < lines.at(0).length; j++) {
            column.push(lines[j][i]);
        }

        if (Array.from(column).every((c) => c === '.')) {
            emptyColumns.push(i)
        }
    }

    const universe = [];

    for (const [row, line] of Object.entries(lines)) {
        const newRow = [];
        for (const [col, char] of Object.entries(line)) {
            if (emptyColumns.includes(Number(col))){
                newRow.push('.');
            }
            newRow.push(char);
        }

        if (emptyRows.includes(Number(row))) {
            universe.push(newRow);
        }

        universe.push(newRow);
    }

    console.log(universe.length)

    // Label Galaxies
    const galaxyPositions = [];
    for (const [row, line] of Object.entries(universe)) {
        console.log(line)
        for (const [col, char] of Object.entries(line)) {
            if (char === '#') {
                galaxyPositions.push([Number(row), Number(col)]);
            }
        }
    }

    console.log(universe.map((r) => r.join('')).join('\n'))

    const CheckDistance = (start, end) => {
        const [x1, y1] = start;
        const [x2, y2] = end;

        const rowDiff = Math.abs(x2 - x1);
        const colDiff = Math.abs(y2 - y1);
        return rowDiff + colDiff ;
    }


    let total = galaxyPositions.length;
    let count = 0;
    let sum = 0;
    for (let i = 0; i < total - 1; i++) {
        // Galaxy Row/Col
        const startGalaxy = galaxyPositions.shift();

        for (const endGalaxy of galaxyPositions) {
            count++;
            const distance = CheckDistance(startGalaxy, endGalaxy);
            console.log(`${i}-${startGalaxy} -> ${endGalaxy}`, distance);
            sum += distance;
        }
    }

    console.log(count, sum);

}

main();