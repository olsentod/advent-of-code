const { FileToArray } = require("../../utils/utils");

const main = async () => {
    const lines = await FileToArray('input.txt');

    let total = 0;
    let counter = 1;

    const copies = new Map();

    for (const line of lines) {
        const [_, test] = line.split(':');
        const [winning, current] = test.split('|');
        const winningNumbers = winning.split(' ').filter((n) => n);
        const currentNumbers = current.split(' ').filter((n) => n);

        const loop = () => {

            let cardCounter = counter + 1;
            for (const winningNumber of winningNumbers) {
                if (currentNumbers.includes(winningNumber)) {
                    if (copies.has(cardCounter)) {
                        copies.set(cardCounter, copies.get(cardCounter) + 1);
                    } else {
                        copies.set(cardCounter, 1);
                    }
                    cardCounter++;
                    total++;
                }
            }
        }

        loop();
        
        for (let i = 0; i < copies.get(counter); i++) {
            loop();
        }

        counter++;
    }

    console.log(total + lines.length);
}

main();