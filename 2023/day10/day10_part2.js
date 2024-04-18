const { FileToArray } = require("../../utils/utils");

const main = async () => {
    const lines = await FileToArray('input.txt');

    let startingPosition = null;

    for (const [row, r] of Object.entries(lines)) {
        for (const [column, c] of Object.entries(r)) {
            if (c === 'S') {
                startingPosition = [Number(row), Number(column)];
            }
        }
    }


    const NextPositions = (letter) => (
        {
            '|': [[-1, 0], [1, 0]],
            '-': [[0, -1], [0, 1]],
            'L': [[-1, 0], [0, 1]],
            'J': [[-1, 0], [0, -1]],
            '7': [[1, 0], [0, -1]],
            'F': [[1, 0], [0, 1]],
            'S': [[-1, 0], [1, 0], [0, -1], [0, 1]],
        }[letter]
    );

    const IsValidLetter = (from, prevLetter, letter) => {
        const [fromRow, fromColumn] = from;
        const validLetter =
            {
                '|': IsValidConnector(fromRow, 0, letter),
                '-': IsValidConnector(0, fromColumn, letter),
                'L': fromRow < 0 ? IsValidConnector(fromRow, 0, letter) : IsValidConnector(0, fromColumn, letter),
                'J': fromRow < 0 ? IsValidConnector(fromRow, 0, letter) : IsValidConnector(0, fromColumn, letter),
                '7': fromRow > 0 ? IsValidConnector(fromRow, 0, letter) : IsValidConnector(0, fromColumn, letter),
                'F': fromRow > 0 ? IsValidConnector(fromRow, 0, letter) : IsValidConnector(0, fromColumn, letter),
                'S': fromRow === 0 ?
                    IsValidConnector(0, fromColumn, letter)
                    :
                    IsValidConnector(fromRow, 0, letter)
            }[prevLetter];

        return validLetter;
    }


    const IsValidConnector = (row, column, letter) => (
        {
            '-1 0': ['|', 'F', '7'].includes(letter),
            '0 -1': ['-', 'F', 'L'].includes(letter),
            '0 1': ['-', 'J', '7'].includes(letter),
            '1 0': ['|', 'L', 'J'].includes(letter),
        }[`${row} ${column}`]
    )

    const checked = new Set();
    const checkingPositions = [startingPosition];
    const steps = [];

    let count = 0;
    while (checkingPositions.length > 0) {
        const [row, column] = checkingPositions.shift();
        const letter = lines[row][column];
        checked.add(`${row} ${column}`);

        // console.log('letter', letter)
        const positions = NextPositions(letter);

        if (!positions) continue;

        for (const [y, x] of positions) {
            // Checking if exists
            if (lines[row + y] && lines[row + y][column + x]) {
                const destinationLetter = lines[row + y][column + x];

                // Checking if direction seems okay and not already checked
                if (IsValidLetter([y, x], letter, destinationLetter) && !checked.has(`${row + y} ${column + x}`)) {
                    steps.push(destinationLetter);
                    checkingPositions.push([row + y, column + x])
                    count++;
                }
            }
        }
    }

    // console.log(checked);
    // console.log(steps);
    // console.log(count)

    let newPrint = [];
    for (const [row, line] of Object.entries(lines)) {
        const newLine = [];
        for (const [col, char] of Object.entries(line)) {
            if (checked.has(`${row} ${col}`)) {
                newLine.push('X')
            } else {
                newLine.push(char)
            }
        }
        newPrint.push(newLine.join(''));
    }

    const counted = new Set();

    const spread = (row, col) => {
        if (counted.has(`${row} ${col}`)) return;
        if (newPrint[row] && newPrint[row][col] && newPrint[row][col] !== 'X') {
            counted.add(`${row} ${col}`);

            spread(row-1, col-1);
            spread(row-1, col);
            spread(row-1, col+1);
            spread(row, col-1);
            spread(row, col+1);
            spread(row+1, col-1);
            spread(row+1, col);
            spread(row+1, col+1);
        }
    }

    spread(0, 0);
    // spread(70, 70);
    spread(75, 70);
    // spread(0,0);
    // spread(0,0);

    const build = () => {
        const test = [];
        for (const [row, line] of Object.entries(newPrint)) {
            const newLine = [];
            for (const [col, char] of Object.entries(line)) {
                if (counted.has(`${row} ${col}`)) {
                    newLine.push('0')
                } else {
                    newLine.push(char)
                }
            }
            test.push(newLine.join(''));
        }

        newPrint = test;
    }

    for (let row = 0; row < newPrint.length - 1; row++) {
        const line = newPrint[row];
        console.log('here', row, newPrint.length)

        if (Number(row) === 0 || row === newPrint.length - 1) {
            // TOP OR BOTTOM
            for (let col = 0; col < newPrint.length - 1; col++) {
                if (newPrint[row][col] !== '0' || newPrint[row][col] !== 'X') {
                    spread(row,col);
                    build();
                }
            }
        } else {
            // spread(row,col);
            if (newPrint[row][0] !== '0' || newPrint[row][0] !== 'X') {
                spread(row, 0);
                build();
            }
            if (newPrint[row][line.length - 1] !== '0' || newPrint[row][line.length - 1] !== 'X') {
                spread(row, line.length - 1);
                build();
            }
        }
        

    }


    console.log('counted', counted.size, checked.size, (lines.length * lines.at(0).length) - (counted.size + checked.size))

    build()
    console.log(newPrint.join('\n'));

    let sum = 0;
    for (const [row, line] of Object.entries(newPrint)) {
        for (const [col, char] of Object.entries(line)) {
            if (char !== 'X' && char !== '0') {
                sum++;
            }
        }
    }

    console.log(sum)
}

main();