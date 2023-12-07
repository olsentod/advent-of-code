const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

const { FileToArray } = require("../../utils/utils");

// const [_, __, start, end] = process.argv;
// console.log('start, end', start, end)

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
        ]);

        // GET LINES
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

    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);

        // Fork workers.
        console.log(seeds);
        for (const [start, length] of seeds) {
            const env = { start: start, end: start + length };
            cluster.fork(env);
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        const start = Number(process.env.start)
        const end = Number(process.env.end)

        console.log(`Worker ${process.pid} started: range = ${start}-${end}`);

        let minium = Infinity;
        for (let initialSeed = Number(start); initialSeed <= Number(end); initialSeed++) {
            let seed = initialSeed;
            if (initialSeed % 5000000 === 0) console.log(`Process ID: ${process.pid}`, initialSeed);
            for (const [key, checks] of initialMap.entries()) {
                seed = GetSeedLocation(checks, Number(seed));
            }

            if (seed < minium) {
                minium = seed;
                console.log('NEW LOW SEED ALERT!', minium, seed);
            }
        }
        console.log('SEED', minium);

    }

    // Current low 
    // 187579915
    // 1134543333
}

main();