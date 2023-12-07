const { FileToArray } = require("../../utils/utils");

const main = async () => {
    const lines = await FileToArray('input.txt');

    let total = 0;

    for (const line of lines) {
        const [_, test] = line.split(':');
        const [winning, current] = test.split('|');
        const winningNumbers = winning.split(' ').filter((n) => n);
        const currentNumbers = current.split(' ').filter((n) => n);

        let multiplier = 0;
        
        for (const winningNumber of winningNumbers) {
            if (currentNumbers.includes(winningNumber)) {
                if (!multiplier) {
                    multiplier = 1;
                } else {
                    multiplier *= 2;
                }
            }
        }

        total += multiplier
    }

    console.log(total);
}

main();