const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');

const leibnizPi = require('./leibniz');
const ramanujanPi = require('./ramanujan');

const getPerformance = (n, cb) => {
    const start = performance.now();
    const res = cb(n);
    // console.log(res.toString()[n-4])
    const end = performance.now();
    return end - start;
};

const run = (ns) => {
    const ramanujan = [];
    const leibniz = [];

    for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const ramanujanPerformance = getPerformance(n, ramanujanPi);
        ramanujan.push(ramanujanPerformance);
        const leibnizPerformance = getPerformance(n, leibnizPi);
        leibniz.push(leibnizPerformance);

        console.log('\nn = ', ns[i]);
        console.log('ramanujan = ', ramanujanPerformance);
        console.log('leibniz = ', leibnizPerformance);

    }

    const ramanujanPlot = { x: ns, y: ramanujan, type: 'line', name: 'ramanujan' };
    const leibnizPlot = { x: ns, y: leibniz, type: 'line', name: 'leibniz' };

    plot([ramanujanPlot]);
    plot([leibnizPlot]);
    console.log({ ramanujan, leibniz });
};

const n = [10, 100, 500, 1000, 2500, 5000, 7500,  10000, 15000, 20000, 30000, 40000, 50000];

run(n);