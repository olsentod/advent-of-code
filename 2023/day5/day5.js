const { FileToArray } = require("../../utils/utils");

const GetSeedLocation = (checks, value) => {
    for (const check of checks) {
        const [destinationString, sourceString, rangeString] = check;
        const destination = Number(destinationString);
        const source = Number(sourceString);
        const range = Number(rangeString);

        const diff = destination - source;
        if (value >= source && value < source + range) {
            return value + diff;
        }
    }

    return value;
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
            console.log(seeds);
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

    const seedLocations = [];
    for (let seed of seeds) {
        for (const [key, checks] of initialMap.entries()) {
            console.log('checking', key); 
            seed = GetSeedLocation(checks, Number(seed));
            console.log(seed); 
        }

        seedLocations.push(seed);
    }
    
    ;
    console.log(seedLocations);
}

main();