const { FileToArray } = require("../../utils/utils");

class Node {
    constructor(value) {
        this.value = value;
    }

    setLeftNode(node) {
        this.leftNode = node;
    }

    setRightNode(node) {
        this.rightNode = node;
    }

    setChildNode(node) {
        this.childNode = node;
    }
}

class Row {
    constructor(values) {
        this.values = values;
    }

    firstValue() {
        const firstValue = this.values.at(0);
        // console.log(firstValue);
        return firstValue
    }

    lastValue() {
        const lastValue = this.values.at(this.values.length - 1);
        // console.log(lastValue);
        return lastValue
    }

    fillRow() {
        if (this.childRow) {
            this.addValue(this.childRow.lastValue() + this.lastValue());
        }
    }

    backFill() {
        if (this.childRow) {
            this.prependValue(this.firstValue() - this.childRow.firstValue());
        } else {
            this.prependValue(0);
        }
    }

    addValue(value) {
        this.values = [...this.values, value];
    }

    prependValue (value) {
        this.values = [value, ...this.values];
    }

    addChildRow(row) {
        this.childRow = row;
    }
}

const main = async () => {
    const lines = await FileToArray('input.txt');
    const rows = [];
    for (const line of lines) {
        rows.push(new Row(line.split(' ').map((n) => Number(n))));
    }


    const addRow = (row) => {
        const newRow = new Row([]);
        for (let i = 0; i < row.values.length - 1; i++) {
            const first = row.values[i];
            const second = row.values[i + 1];
            const diff = second - first;
            newRow.addValue(diff);
        }
        row.addChildRow(newRow);
        if (newRow.values.every((r) => r === 0)) {
            //exit
            newRow.backFill();
            return;
        } else {
            addRow(newRow);
            newRow.fillRow();
            newRow.backFill();
        }
    }

    for (const row of rows) {
        addRow(row);
        row.fillRow();
        row.backFill();
    }

    console.log(JSON.stringify(rows[0]));

    const dive = (row) => {
        if (row.childRow.length) {
            return dive(row.childNode) + row.firstValue();
        } else {
            return row.firstValue();
        }
    }

    let sum = 0;
    for (const row of rows) {
        sum += dive(row);

    }

    console.log(sum);
}

main();