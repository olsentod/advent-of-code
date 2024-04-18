const { FileToArray } = require("../../utils/utils");

const FindMirrorIndexInColumns = (grid) => {
    const columns = [];
    let endIndex = [];
    // let foundSmudge = false;
    for (let col = 0; col < grid[0].length; col++) {
        const prevColumn = columns[col - 1] || [];
        const currentColumn = [];
        for (let row = 0; row < grid.length; row++) {
            currentColumn.push(grid[row][col]);
        }

        const count = currentColumn.reduce((prev, curr, i) => (curr === prevColumn[i] ? prev + 1 : prev), 0);
        
        // if (currentColumn.length - count === 1) {
        //     foundSmudge = true;
        // }

        if (count === currentColumn.length || currentColumn.length - count === 1) {
            console.log('found col index', col - 1);
            
            // if (diff === 1) {
            //     return [columns, [...endIndex, col - 1], 'COLUMN'];
            // }
            
            endIndex.push(col - 1);
        }

        columns.push(currentColumn);
    }
    return [columns, endIndex.length === 0 ? [-1] : endIndex];
}

const FindMirrorIndexInRows = (grid) => {
    let endIndex = [];
    // let foundSmudge = false;
    for (let row = 0; row < grid.length; row++) {
        const prevRow = grid[row - 1] || [];
        const currentRow = grid[row];

        const count = currentRow.reduce((prev, curr, i) => (curr === prevRow[i] ? prev + 1 : prev), 0);
        
        // if (currentRow.length - count === 1) {
            // foundSmudge = true;
        // }

        if (count === currentRow.length || currentRow.length - count === 1) {
            console.log('found row index', row - 1);

            // if (foundSmudge) {
            //     return [grid, [...endIndex, row - 1], 'ROW'];
            // }
            
            endIndex.push(row - 1);
        }
    }
    return [grid, endIndex.length === 0 ? [-1] : endIndex];
}

const CheckMirrorIndex = (rowIndices, columnIndices, rows, columns) => {
    let type = '';
    let index = -1;
    let foundSmudge = '';

    const runner = (runnerIndex, runnerType, grid) => {
        let running = true;
        let leftIndex = runnerIndex;
        let rightIndex = runnerIndex + 1;
        foundSmudge = '';
        while (running) {
            const left = grid[leftIndex] || [];
            const right = grid[rightIndex] || [];

            if ((left.length === 0 || right.length === 0) && foundSmudge === runnerType) {
                running = false;
                type = runnerType;
                index = runnerIndex;
                return true;
            }

            if ((left.length === 0 || right.length === 0) && foundSmudge !== runnerType) {
                running = false;
                return false;
            }

            const count = left.reduce((prev, curr, i) => (curr === right[i] ? prev + 1 : prev), 0);
            console.log('count', count, runnerIndex, left.length, right.length, runnerType, foundSmudge)

            if (left.length - count === 1 && foundSmudge === '') {
                foundSmudge = runnerType;
            }

            if (count === left.length || left.length - count === 1) {
                leftIndex--;
                rightIndex++;
            } else {
                running = false;
                return false;
            } 
        }
    }

    for (const rowIndex of rowIndices) {
        if (rowIndex < 0) {
            break;
        }

        if (runner(rowIndex, 'ROW', rows)) return [type, index];
    }

    foundSmudge = '';

    for (const columnIndex of columnIndices) {
        if (columnIndex < 0) {
            break;
        }

        if (runner(columnIndex, 'COLUMN', columns)) return [type, index];
    }

    return [type, index];
}

const main = async () => {
    const lines = await FileToArray('input.txt');
    const grids = [];

    let grid = [];
    for (const line of lines) {
        if (line === '') {
            grids.push(grid);
            grid = [];
            continue;
        }
        grid.push(line.split(''));
    }
    grids.push(grid);

    let sum = 0;
    for (const grid of grids) {
        const [rows, rowIndices, rowSmudge] = FindMirrorIndexInRows(grid);
        const [columns, columnIndices, columnSmudge] = FindMirrorIndexInColumns(grid);
    
        const [type, index] = CheckMirrorIndex(rowIndices, columnIndices, rows, columns);
    
        if (index === -1) console.log(grid.map((row) => row.join('')).join('\n'))
        console.log(type, index)
        
        if (type === 'COLUMN') {
            sum += (index + 1);
        }

        if (type === 'ROW') {
            sum += (index + 1) * 100;
        }
    }

    
    console.log(sum);
}

main();

// 39094 (too high)
// 38671 ???
// 38601 ???
// 38621 ???
// 36919 
// 35616 ???
// 34516 ???
// 33497 ???
// 30858 (too low)