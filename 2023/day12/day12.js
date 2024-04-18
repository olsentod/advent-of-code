const { FileToArray } = require("../../utils/utils");

const countCombinations = (gearCounts, splitSprings) => {
    let combinationSum = 0;
    let currentSprings = [...splitSprings];
    console.log('currentSprings', currentSprings)
    for (const gear of gearCounts) {
        const gearCount = Number(gear);

        const re = new RegExp(`[?]{${gearCount}}`);
        const brokenRegExp = new RegExp('[?]{1}');

        for (let i = 0; i < currentSprings.length - 1; i++) {
            const springs = currentSprings[i];
            if (springs.match(re)) {
                currentSprings[i] = currentSprings[i].replace(re, '#'.repeat(gearCount));
                currentSprings[i] = currentSprings[i].replace(brokenRegExp, '.');
            }
            console.log(gearCount, currentSprings);
        }
    }
}

const main = async () => {
    const lines = await FileToArray('input.txt');
    let sum = 0;

    for (const line of lines) {
        const [springs, counts] = line.split(' ')
        const gearCounts = counts.split(',')
        const splitSprings = springs.split('.').filter((s) => s)
        sum += countCombinations(gearCounts, splitSprings);

        console.log('\nmeow\n')


    }

}

main();