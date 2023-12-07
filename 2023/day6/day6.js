const { FileToArray } = require("../../utils/utils");

const main = async () => {
    const lines = await FileToArray('input.txt');
    
    const [time, distance] = lines;

    const [_, ...times] = time.split(' ').filter((t) => t);
    const [__, ...distances] = distance.split(' ').filter((d) => d);

    console.log(times);
    console.log(distances);

    let product = 1;
    for (let race = 0; race < times.length; race++) {
        const totalTime = Number(times[race]);
        const targetDistance = Number(distances[race]);

        let sum = 0;
        for (let timePassed = 0; timePassed < totalTime; timePassed++) {
            const speed = timePassed;
            const travelTime = totalTime - timePassed;
            const travelledDistance = (travelTime * speed);
            if (targetDistance < travelledDistance) {
                // console.log(timePassed, travelledDistance);
                sum++;
            }
        }
        console.log(sum);
        product *= sum;
    };
    console.log(product);
}

main();