const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');

class Graph {
    constructor() {
        this.graph = {};
        this.vertices = [];
    }

    addEdge = (u, v) => {
        if (this.vertices.indexOf(u) === -1) this.vertices.push(u);
        if (this.vertices.indexOf(v) === -1) this.vertices.push(v);
        if (this.graph[u] !== undefined) this.graph[u] = [...this.graph[u], v];
        else this.graph[u] = [v];
    };

    DFSTime = (s) => {
        const visited = new Set();
        const start = performance.now();
        this.dfs(s, visited);
        const end = performance.now();

        return end - start;
    };
    dfs = (v, visited) => {
        visited.add(v);
        if (this.graph[v]) {
            for (let next of this.graph[v]) {
                if (!visited.has(next)) {
                    this.dfs(next, visited);
                }
            }
        }
    };
    BFSTime = (s) => {
        let visited = {};
        for (let node of this.vertices) visited[node] = false;

        const start = performance.now();
        this.bfs(s, visited);
        const end = performance.now();

        return end - start;
    };
    bfs = (s, visited) => {
        const queue = [];
        queue.push(s);
        visited[s] = true;

        while (queue.length !== 0) {
            const current = queue.shift();
            if (this.graph[current]) {
                for (let next of this.graph[current]) {
                    if (visited[next] === false) {
                        queue.push(next);
                        visited[next] = true;
                    }
                }
            }
        }
    };
}
const makeGraph = (nrOfVertices = 10, nrOfConnections = 10, max = nrOfVertices, min = 0) => {
    const vertices = []; // [0...nrOfVertices]
    const edges = [];
    const g = new Graph();

    for (let i = 0; i <= nrOfVertices; i++) {
        // can be used random nrs for vertices but no need to (anyway dfs is faster)
        // const rand = (Math.floor(Math.random() * (max - min + 1) + min)).toString();
        // vertices.push(rand);
        vertices.push(i.toString());
    }

    // make a path
    for (let i = 0; i < vertices.length - 1; i++) {
        g.addEdge(vertices[i], vertices[i + 1]);
        edges.push([vertices[i], vertices[i + 1]]);
    }

    // util to check if the new edge already exists
    const edgeExists = (u, v) => {
        for (let i = 0; i < edges.length; i++) {
            if (edges[i][0] === u && edges[i][1] === v) return true;
        }
        return false;
    };

    // complete the graph
    while (nrOfConnections !== 0) {

        const u = vertices[Math.floor(Math.random() * vertices.length)];
        const v = vertices[Math.floor(Math.random() * vertices.length)];

        if (edges.length === 0) {
            g.addEdge(u, v);
            edges.push([u, v]);
            nrOfConnections--;
        } else {
            if (!edgeExists(u, v)) {
                g.addEdge(u, v);
                edges.push([u, v]);
                nrOfConnections--;
            }
        }
    }

    const DFSTime = g.DFSTime(vertices[0]);
    const BFSTime = g.BFSTime(vertices[0]);
    return { DFSTime, BFSTime };
};


const run = (vs, es) => {
    const dfsPerf = [];
    const bfsPerf = [];
    for (let i = 0; i < vs.length; i++) {
        const { DFSTime, BFSTime } = makeGraph(vs[i], es[i]);
        dfsPerf.push(DFSTime);
        bfsPerf.push(BFSTime);
        console.log('\n');
        console.log('DFS time: ', DFSTime);
        console.log('BFS time: ', BFSTime);
        console.log('Nr. of Vertices: ', vs[i], 'Nr. of Edges: ', es[i]);
    }

    const DFSPlot = { x: vs, y: dfsPerf, type: 'scatter', title: 'dfs execution time' };
    plot([DFSPlot]);
    const BFSPlot = { x: vs, y: bfsPerf, type: 'scatter', name: 'bfs execution time' };
    plot([BFSPlot]);
};

const nrOfVertices = [25, 50, 100, 250, 500, 1000, 2000, 3000, 5000];
const nrOfConnections = [25, 50, 100, 500, 1000, 5000, 10000, 20000, 20000];
run(nrOfVertices, nrOfConnections);