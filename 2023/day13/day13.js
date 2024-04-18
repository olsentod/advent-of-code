const { FileToArray } = require("../../utils/utils");

const FindMirrorIndexInColumns = (grid) => {
    const columns = [];
    let endIndex = [];
    for (let col = 0; col < grid[0].length; col++) {
        const prevColumn = columns[col - 1] || [];
        const currentColumn = [];
        for (let row = 0; row < grid.length; row++) {
            currentColumn.push(grid[row][col]);
        }

        if (currentColumn.every((v, i) => v === prevColumn[i])) {
            console.log('found col index', col - 1);
            endIndex.push(col - 1);
        }

        columns.push(currentColumn);
    }
    return [columns, endIndex.length === 0 ? [-1] : endIndex];
}

const FindMirrorIndexInRows = (grid) => {
    let endIndex = [];
    for (let row = 0; row < grid.length; row++) {
        const prevRow = grid[row - 1] || [];
        const currentRow = grid[row];

        if (currentRow.every((v, i) => v === prevRow[i])) {
            console.log('found row index', row - 1);
            endIndex.push(row - 1);
        }
    }
    return [grid, endIndex.length === 0 ? [-1] : endIndex];
}

const CheckMirrorIndex = (rowIndices, columnIndices, rows, columns) => {
    let type = '';
    let index = -1;

    const runner = (runnerIndex, runnerType, grid) => {
        let running = true;
        let leftIndex = runnerIndex;
        let rightIndex = runnerIndex + 1;
        while (running) {
            const left = grid[leftIndex] || [];
            const right = grid[rightIndex] || [];


            if (left.length === 0 || right.length === 0) {
                running = false;
                type = runnerType;
                index = runnerIndex;
                break;
            }

            if (!left.every((v, i) => v === right[i])) {
                running = false;
                break;
            }

            leftIndex--;
            rightIndex++;
        }
    }

    for (const rowIndex of rowIndices) {
        if (rowIndex < 0) {
            break;
        }

        runner(rowIndex, 'ROW', rows);
    }

    for (const columnIndex of columnIndices) {
        if (columnIndex < 0) {
            break;
        }

        runner(columnIndex, 'COLUMN', columns);
    }

    return [type, index]
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
        const [rows, rowIndices] = FindMirrorIndexInRows(grid);
        const [columns, columnIndices] = FindMirrorIndexInColumns(grid);
    
        const [type, index] = CheckMirrorIndex(rowIndices, columnIndices, rows, columns);
    
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

//22504 (too low)