const { FileToArray } = require("../../utils/utils");

const stepInput = 'LLRLRRRLLLRLRRLRRRLRLRRLRLRLRRRLRRRLRLRLRRLLRRRLRRLRRLLRLRRRLRLRLLRRRLLRRRLRLRRRLRRRLRRRLLLRRRLRRLRRLRLRRLRLRRRLRLRRLRLRLRRRLRLLLRRRLLLRLRRRLRLRRLRLRLRLRRLRRLRRLRLRRRLRRRLRRLRRRLRRLRRLRRRLLRLRRLLLRRLRRLRLRLLLRRLRRLRRRLRRLLRLRRRLRRRLRRLRRLRLRRLRLRRRLRRLRRRLLRRRLRLRLLLRRRLLLRRLLRRLRLRRLRLLLRRRR';

const map = new Map();

class Node {
    constructor(key, left, right) {
        this.key = key;
        this.is_primary = key.at(2) === 'A';
        this.left = left;
        this.right = right;
    }
    
    goLeft() {
        return map.get(this.left);
    }

    goRight() {
        return map.get(this.right);
    }
}

const main = async () => {
    const lines = await FileToArray('input.txt');
    
    for (const line of lines) {
        const [key, other] = line.replace(' ', '').split('=');
        const [left, right] = other.replace('(', '').replace(')', '').split(',');
        map.set(key, new Node(key, left.replace(' ', ''), right.replace(' ', '')));
    }

    let notZZZ = true;
    let nodes = Array.from(map.entries('AAA')).filter(([key, node]) => node.is_primary).map(([_, node]) => node);

    let cursor = 0;
    let steps = 0;
    
    while(notZZZ) {
        const checkEnd = (nodes) => {
            if (nodes.every((node) => node.key.at(2) === 'Z')) {
                notZZZ = false;
            }
        }

        const direction = stepInput.at(cursor);
        for (const [index, node] of nodes.entries()) {
            if (direction === 'L') {
                nodes[index] = node.goLeft();
            } else {
                nodes[index] = node.goRight();
            }
        }
        checkEnd(nodes);
        steps++;

        if (steps % 1000000 === 0) {
            console.log(steps);
        }
        
        cursor = steps % stepInput.length;
    }

    console.log(steps);
    
}

main();