const { FileToArray } = require("../../utils/utils");

const MaxValuesMap = new Map([
    ['red', 12],
    ['green', 13],
    ['blue', 14],
]);

const main = async () => {
    const lines = await FileToArray('input.txt');
    let sum = 0;

    for (const line of lines) {
        const [game, sets] = line.split(':')
        const [_, gameNumber] = game.split(' ');

        const groups = sets.split(';');

        const colorGroupMap = groups.map((group) => {
            const colorMap = new Map([
                ['red', 0],
                ['blue', 0],
                ['green', 0],
            ]);

            for (const subgroup of group.split(', ')) {
                const [number, color] = subgroup.split(' ').filter((c) => c !== '');
                colorMap.set(color, colorMap.get(color) + Number(number));
            }

            return colorMap;
        });

        const powerSet = new Map([
            ['red', 0],
            ['green', 0],
            ['blue', 0],
        ]);

        for (const colorGroup of colorGroupMap) {
            for (const [color, value] of Array.from(colorGroup.entries())) {
                const powerSetColor = powerSet.get(color);
                if (powerSetColor < value) {
                    powerSet.set(color, value);
                }
            }
        }

        sum += Array.from(powerSet.values()).reduce((prev, curr) => prev * curr, 1);
        // if (colorGroupMap.every((subgroup) => Array.from(subgroup.entries()).every(([c, v]) => v <= MaxValuesMap.get(c)))) {
        //     sum += Number(gameNumber);
        // }
    }

    console.log(sum)

}

main();