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

    let nodes = Array.from(map.entries('AAA')).filter(([key, node]) => node.is_primary).map(([_, node]) => node);

    const loops = [];

    for (const startNode of nodes) {
        let cursor = 0;
        let steps = 0;

        let node = startNode;
        let notZZZ = true;
        while (notZZZ) {
            const checkLoop = (node) => {
                if (node.key.at(2) === 'Z') {
                    loops.push(steps);
                    notZZZ = false;
                }
            }
            steps++;

            const direction = stepInput.at(cursor);
            if (direction === 'L') {
                node = node.goLeft();
                checkLoop(node);
            } else {
                node = node.goRight();
                checkLoop(node);
            }
            cursor = steps % stepInput.length;
        }
    }

    function findGCM(numbers) {
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
        const gcm = (a, b) => (a * b) / gcd(a, b)
        return numbers.reduce((a, b) => gcm(a, b))
    }
    console.log(findGCM(loops));

    // console.log(smallestCommons(loops));

}

main();