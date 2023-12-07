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

    if (map.size === 1) {
        // Five of a kind = 1
        return 1;
    } else if (map.size === 2 && Array.from(map.values()).find((c) => c === 4)) {
        // Four of a kind = 2
        return 2;
    } else if (map.size === 2 && Array.from(map.values()).find((c) => c === 3 && Array.from(map.values()).find((c) => c === 2))) {
        // Full house = 3
        return 3;

    } else if (map.size === 3 && Array.from(map.values()).find((c) => c === 3)) {
        // 3 of a kind = 4
        return 4;

    } else if (map.size === 3 && Array.from(map.values()).find((c) => c === 2)) {
        // two pair = 5
        return 5;
        
    } else if (map.size === 4 && Array.from(map.values()).find((c) => c === 2)) {
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
            'J': 4,
            'T': 5,
            '9': 6,
            '8': 7,
            '7': 8,
            '6': 9,
            '5': 10,
            '4': 11,
            '3': 12,
            '2': 13,
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

    console.log(sortedHands);
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