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

    console.log(emptyColumns)
    const universe = [];

    for (const [row, line] of Object.entries(lines)) {
        const newRow = [];
        for (const [col, char] of Object.entries(line)) {
            // if (emptyColumns.includes(Number(col))){
            //     newRow.push('.');
            // }
            newRow.push(char);
        }

        // if (emptyRows.includes(Number(row))) {
        //     universe.push(newRow);
        // }

        universe.push(newRow);
    }

    console.log(universe.length)

    // Label Galaxies
    const galaxyPositions = [];
    for (const [row, line] of Object.entries(universe)) {
        const inbetweenRows = emptyRows.filter((r) => r < Number(row));
        const rowMod = inbetweenRows.length * 999_999;
        
        for (const [col, char] of Object.entries(line)) {
            const inbetweenColumns = emptyColumns.filter((r) => r < Number(col));
            const colMod = inbetweenColumns.length * 999_999;
            // console.log(emptyColumns, col, inbetweenColumns)

            if (char === '#') {
                galaxyPositions.push([Number(row) + Number(rowMod), Number(col) + Number(colMod)]);
            }
        }
    }

    console.log(universe.map((r) => r.join('')).join('\n'))

    const CheckDistance = (start, end) => {
        const [x1, y1] = start;
        const [x2, y2] = end;

        // const inbetweenRows = emptyRows.filter((r) => r > Math.min(x1, x2) && r < Math.max(x1, x2));
        // const inbetweenColumns = emptyColumns.filter((r) => r > Math.min(y1, y2) && r < Math.max(y1, y2));

        const rowDiff = Math.abs(x2 - x1);
        const colDiff = Math.abs(y2 - y1);
        // const rowDiff = Math.abs(x2 - x1) + inbetweenRows.length * 1_000_000;
        // const colDiff = Math.abs(y2 - y1) + inbetweenColumns.length * 1_000_000;
        return rowDiff + colDiff;
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
            // console.log(`${i}-${startGalaxy} -> ${endGalaxy}`, distance);
            sum += distance;
        }
    }

    console.log(count, sum);

}

main();