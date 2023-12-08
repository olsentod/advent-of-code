const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

const { FileToArray } = require("../../utils/utils");

const GetSeedLocationInverted = (initialMap, seed) => {
    for (const [key, checks] of Array.from(initialMap.entries()).reverse()) {
        for (const [destination, source, range] of checks) {
            if (destination <= seed && destination + range > seed) {
                seed = source + seed - destination;
                break;
            }
        }
    }

    return seed;
}

const main = async () => {
    const lines = await FileToArray('input.txt');

    let seeds = null;

    const initialMap = new Map([
        ['seed-to-soil', []],
        ['soil-to-fertilizer', []],
        ['fertilizer-to-water', []],
        ['water-to-light', []],
        ['light-to-temperature', []],
        ['temperature-to-humidity', []],
        ['humidity-to-location', []],
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

            for (let i = 0; i < seeds.length; i = i + 2) {
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
            const group = line.split(' ').map((n) => Number(n));
            initialMap.set(mappingKey, [...initialMap.get(mappingKey), group]);
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

    const start = 0;
    const end = 1_000_000_000;

    let locationSeed = start;
    while (locationSeed < end) {
        let seed = locationSeed;
        // console.log('location seed', locationSeed);
        if (locationSeed % 1000000 === 0) console.log(locationSeed);

        seed = GetSeedLocationInverted(initialMap, seed);

        for (const [bottom, range] of seeds) {
            if (bottom <= seed && bottom + range >= seed) {
                console.log('found seed', locationSeed);
                locationSeed = end;
                break;
            }
        }
        locationSeed++;
    }
    process.exit(0);
}

main();