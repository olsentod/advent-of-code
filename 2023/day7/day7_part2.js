const { FileToArray } = require("../../utils/utils");

const handRank = (hand) => {
    const map = new Map();

    for (const card of hand) {
        if (map.has(card)) {
            map.set(card, map.get(card) + 1);
        } else {
            map.set(card, 1);
        }
    }

    let jokerCount = 0;
    if (map.has('J')) {
        jokerCount = map.get('J');
        map.delete('J');
    }

    
    if (map.size === 1 || map.size === 0) {
        // Five of a kind = 1
        return 1;
    } else if (map.size === 2 && (Math.max(...Array.from(map.values())) + jokerCount) === 4) {
        // Four of a kind = 2
        return 2;
    } else if (map.size === 2) {
        // Full house = 3
        return 3;

    } else if (map.size === 3 && (Math.max(...Array.from(map.values())) + jokerCount) === 3) {
        // 3 of a kind = 4
        return 4;

    } else if (map.size === 3 && (Math.max(...Array.from(map.values())) + jokerCount) === 2) {
        // two pair = 5
        return 5;
        
    } else if (map.size === 4 && (Math.max(...Array.from(map.values())) + jokerCount) === 2) {
        // one pair = 6
        return 6;
        
    } else {
        // High card = 7
        return 7;
    }
}

const getCardRank = (hand) => {
    for (const card of hand) {
        return {
            'A': 1,
            'K': 2,
            'Q': 3,
            'T': 4,
            '9': 5,
            '8': 6,
            '7': 7,
            '6': 8,
            '5': 9,
            '4': 10,
            '3': 11,
            '2': 12,
            'J': 13,
        }[card];
    }
}

const main = async () => {
    const lines = await FileToArray('input.txt');
    const rankedHands = new Map();
    const bidMap = new Map();
    for (const line of lines) {
        const [hand, bid] = line.split(' ');
        const rank = handRank(hand);
        console.log(hand, rank)
        if (rankedHands.has(rank)) {
            rankedHands.set(rank, [...rankedHands.get(rank), hand]);
        } else {
            rankedHands.set(rank, [hand]);
        }
        if (bidMap.has(hand)) {
            console.log('uh oh');
        } else {
            bidMap.set(hand, bid);
        }
    }

    const sortedHands = [];

    for (let i = 1; i <= 7; i++) {
        if (rankedHands.has(i)) {
            const hands = rankedHands.get(i);
            
            const sorted = hands.sort((a, b) => {
                for (let i = 0; i < a.length; i++) {
                    const rankA = getCardRank(a.at(i));
                    const rankB = getCardRank(b.at(i));
                    if (rankA === rankB) {
                        continue;
                    } else {
                        return rankA - rankB;
                    }
                }
                
            });
            sortedHands.push(...sorted);
        }
    }

    console.log(JSON.stringify(sortedHands));
    let sum = 0;
    let rank = sortedHands.length;
    for (const hand of sortedHands) {
        const bid = bidMap.get(hand);
        sum += rank * bid;
        rank--;
    }

    console.log(sum);

}

main();