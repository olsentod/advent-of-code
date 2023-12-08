const { FileToArray } = require("../../utils/utils");

const stepInput = 'LLRLRRRLLLRLRRLRRRLRLRRLRLRLRRRLRRRLRLRLRRLLRRRLRRLRRLLRLRRRLRLRLLRRRLLRRRLRLRRRLRRRLRRRLLLRRRLRRLRRLRLRRLRLRRRLRLRRLRLRLRRRLRLLLRRRLLLRLRRRLRLRRLRLRLRLRRLRRLRRLRLRRRLRRRLRRLRRRLRRLRRLRRRLLRLRRLLLRRLRRLRLRLLLRRLRRLRRRLRRLLRLRRRLRRRLRRLRRLRLRRLRLRRRLRRLRRRLLRRRLRLRLLLRRRLLLRRLLRRLRLRRLRLLLRRRR';

const map = new Map();

class Node {
    constructor(key, left, right) {
        this.key = key;
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
    let node = map.get('AAA');
    let cursor = 0;
    let steps = 0;
    
    while(notZZZ) {
        const checkEnd = (node) => {
            if (node.key === 'ZZZ') {
                notZZZ = false;
            }
        }
        const direction = stepInput.at(cursor);
        // console.log('Step', direction, node);
        if (direction === 'L') {
            node = node.goLeft();
            checkEnd(node);
        } else {
            node = node.goRight();
            checkEnd(node);
        }
        steps++;
        cursor = steps % stepInput.length;
    }

    console.log(steps);
    
}

main();