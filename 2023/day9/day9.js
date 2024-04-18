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

    lastValue() {
        const lastValue = this.values.at(this.values.length - 1);
        // console.log(lastValue);
        return lastValue
    }

    fillRow() {
        if (this.childRow) {
            console.log(this.values, this.childRow.lastValue() + this.lastValue())
            this.addValue(this.childRow.lastValue() + this.lastValue());
        }
    }

    addValue(value) {
        this.values = [...this.values, value];
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

    console.log(rows);



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
            return;
        } else {
            addRow(newRow);
            newRow.fillRow();
        }
    }

    for (const row of rows) {
        addRow(row);
        row.fillRow();
    }


    const sum = rows.reduce((prev, row) => row.lastValue() + prev, 0);
    console.log(sum);
}

main();