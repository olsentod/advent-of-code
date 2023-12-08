const { FileToArray } = require("../../utils/utils");

const GetSeedLocationInverted = (checks, value) => {
    for (const check of checks) {
        const [source, destination, range] = check;
        console.log(check, value)

        const diff = source - destination;
        if (value >= destination && value < destination + range) {
            console.log('change', diff);
            return value + diff;
        }
    }

    return value;
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
            initialMap.set(mappingKey, [...initialMap.get(mappingKey), line.split(' ').map((n) => Number(n))]);
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

    // console.log(initialMap);

    // console.log(GetSeedLocationInverted([[ 3071447765, 3790677895, 35519893 ]], 3790677895 + 35519893));
    // return;
    // INVERTED
    let minium = Infinity;
    let running = true;
    let locationSeed = 0;
    while(running) {
        let seed = locationSeed;
        console.log('location seed', locationSeed);
        if (locationSeed % 1000000 === 0) console.log(locationSeed);
        for (const [key, checks] of initialMap.entries()) {
            // console.log('check', key, checks);
            seed = GetSeedLocationInverted(checks, seed);
        }
        console.log('seed after', seed);
        for (const [bottom, range] of seeds) {
            if (seed >= bottom && seed < bottom + range) {
                running = false;
                minium = locationSeed;
                break;
            }
        }
        locationSeed++;
    }

    console.log(minium);
    
    // 187579915
    // 100000000

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