const { FileToArray } = require("../../utils/utils");

const [_, __, start, end] = process.argv;
console.log('start, end', start, end)

const GetSeedLocationInverted = (checks, value) => {
    let seed = value;
    for (const check of checks) {
        const [sourceString, destinationString, rangeString] = check;
        const destination = Number(destinationString);
        const source = Number(sourceString);
        const range = Number(rangeString);

        const diff = destination - source;
        if (value >= source && value < source + range) {
            return value + diff;
        }
    }

    return seed;
}

const main = async () => {
    const lines = await FileToArray('input.txt');

    let seeds = null;

    const initialMap = new Map([
        ['humidity-to-location', []],
        ['temperature-to-humidity', []],
        ['light-to-temperature', []],
        ['water-to-light', []],
        ['fertilizer-to-water', []],
        ['soil-to-fertilizer', []],
        ['seed-to-soil', []],
    ])

    // First number is target
    // second number is destination
    // third number is range

    let mappingKey = '';

    for (const line of lines) {
        if (line.includes('seeds:')) {
            seeds = line.split(':')
            seeds = seeds[1].split(' ').filter((s) => s);
            const endingSeeds = [];

            for (let i = 0; i <= seeds.length / 2; i = i + 2) {
                const start = Number(seeds[i]);
                const range = Number(seeds[i + 1]);
                endingSeeds.push([start, range])
                // endingSeeds.push(...[...Array(range).keys()].map(i => i + start))
            }

            seeds = endingSeeds;
        }

        if (line === '') {
            // New Map
            mappingKey = '';
        }

        if (mappingKey) {
            initialMap.set(mappingKey, [...initialMap.get(mappingKey), line.split(' ')]);
        }

        if (line.includes('seed-to-soil map:')) {
            mappingKey = 'seed-to-soil';
        }

        if (line.includes('soil-to-fertilizer map:')) {
            mappingKey = 'soil-to-fertilizer';
        }

        if (line.includes('fertilizer-to-water map:')) {
            mappingKey = 'fertilizer-to-water';

        }

        if (line.includes('water-to-light map:')) {
            mappingKey = 'water-to-light';

        }

        if (line.includes('light-to-temperature map:')) {
            mappingKey = 'light-to-temperature';

        }

        if (line.includes('temperature-to-humidity map:')) {
            mappingKey = 'temperature-to-humidity';

        }

        if (line.includes('humidity-to-location map:')) {
            mappingKey = 'humidity-to-location';
        }
    }

    // INVERTED
    let minium = Infinity;
    // let initialSeed = 20
    for (let initialSeed = Number(start); initialSeed <= Number(end); initialSeed++) {
        let seed = initialSeed;
        if (initialSeed % 100000 === 0) console.log(initialSeed);
        // console.log(initialMap.entries())
        for (const [key, checks] of initialMap.entries()) {
            // console.log('checking', key); 

            seed = GetSeedLocationInverted(checks, Number(seed));
            // console.log(seed); 
        }
        for (const [bottom, range] of seeds) {
            if (seed >= bottom && seed <= bottom + range) {
                if (initialSeed < minium) minium = initialSeed;
                break;
            }
        }
        
        if (minium < 187579915) console.log('seed', minium)
    }
    console.log('SEED', minium);
    // 187579915

    // const seedLocations = [];
    // for (let [start, range] of seeds) {
    //     console.log('checking', start, range)
    //     for (const initialSeed of [...Array(range).keys()].map(i => i + start)) {
    //         let seed = initialSeed;
    //         for (const [key, checks] of initialMap.entries()) {
    //             seed = GetSeedLocation(checks, Number(seed));
    //             // console.log(seed); 
    //         }
    //         seedLocations.push(seed);
    //     }
    // }

    // console.log(Math.min(...seedLocations));
}

main();