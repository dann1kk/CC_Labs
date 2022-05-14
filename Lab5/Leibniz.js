const leibnizPi = n => {
    n = BigInt(n) / BigInt(2);
    let arg1 = BigInt(100) ** ++n * BigInt(2);
    let arg2 = arg1 - arg1 / BigInt(3);

    let inc1 = BigInt(1);
    let inc2 = BigInt(1);
    let pi = BigInt(0);
    while (inc2 !== BigInt(0)) {
        inc2 = arg1 + arg2;

        pi = pi + inc2 / inc1;

        arg1 = arg1 / BigInt(-4);
        arg2 = arg2 / BigInt(-9);
        inc1 = inc1 + BigInt(2);
    }

    return pi / (BigInt(10) ** BigInt(5));

};

module.exports = leibnizPi;