const ramanujanPi = (n) => {
    n = BigInt(n);
    let i = BigInt(1);
    let x = BigInt(3) * (BigInt(10) ** n);
    let pi = x;
    while (x > 0) {

        x = x * i / ((i + BigInt(1)) * BigInt(4));
        pi += x / (i + BigInt(2));
        i += BigInt(2);

    }
    return pi / (BigInt(10) ** BigInt(3));

};

module.exports = ramanujanPi;