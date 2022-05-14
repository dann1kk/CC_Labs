const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');

class Edge {
    constructor(v1, v2, w, floydFlag) {
        if(floydFlag) {
            this.v1 = parseInt(v1);
            this.v2 = parseInt(v2);
            this.w = parseInt(w);
        } else {
            this.v1 = v1;
            this.v2 = v2;
            this.w = w;
        }

    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node, floydFlag) {
        if(floydFlag) node = parseInt(node)
        if (!this.nodes.includes(node)) {
            this.nodes.push(node);
        }
    }
    addEdge(edge) {
        this.edges.push(edge)
    }

    floyd() {
        let dist = [];
        for(let i = 0; i < this.nodes.length; i++) {
            dist[i] = new Array(this.nodes.length);
        }

        this.edges.forEach((e, i) => {
            dist[e.v1][e.v2] = e.w
            if(i < this.nodes.length) dist[i][i] = 0
        })

        const startTime = performance.now()
        this._floyd(dist)
        const endTime = performance.now()

        return endTime - startTime
    }
    _floyd(dist) {
        for(let k = 0; k < this.nodes.length; k++) {
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = 0; j < this.nodes.length; j++) {
                    if(dist[i][j] === undefined) dist[i][j] = Infinity
                    if(dist[i][k] === undefined) dist[i][k] = Infinity
                    if(dist[k][j] === undefined) dist[k][j] = Infinity
                    if(dist[i][j] > dist[i][k] + dist[k][j]) dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }

    getDijkstraEdges() {
        const res = {}
        this.edges.forEach((e, i) => {
            if(!res[e.v1]) {
                res[e.v1] = {}
            }
            res[e.v1][e.v2] = e.w
        })
        return res
    }

    smallestWeightNode(dist, visited) {
        let res = ''
        let weight = Infinity
        for(let d in dist) {
            if(!visited.includes(d)) {
                const currentWeight = dist[d].weight
                if(currentWeight < weight) {
                    weight = currentWeight
                    res = d
                }
            }
        }
        if(res === '') throw new Error(`No smallest weight edge in distances: ${dist}`)
        else return res
    }

    dijkstra() {
        const edges = this.getDijkstraEdges()
        let dist = {}
        this.nodes.forEach((n, i) => {
            if(i === 0) dist[n] = {weight: 0, prev: 'Start'}
            else dist[n] = {weight: Infinity, prev: undefined}
        })
        const startTime = performance.now()
        this._dijkstra(edges, dist)
        const endTime = performance.now()

        return endTime - startTime
    }
    _dijkstra(edges, dist) {
        const visited = []
        while(visited.length !== this.nodes.length) {
            const smallestNode = this.smallestWeightNode(dist, visited)
            const smallestNodeNeighbours = edges[smallestNode]
            for(let node in smallestNodeNeighbours) { //unvisited node
                if(!visited.includes(node)) {
                    let sum = dist[smallestNode].weight + smallestNodeNeighbours[node]
                    if(sum < dist[node].weight) {
                        dist[node].weight = sum
                        dist[node].prev = smallestNode.toString()
                    }
                }
            }
            visited.push(smallestNode.toString())
        }
    }
}

const randomNumber = (min = 10, max = 100000) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const makeGraph = (nrOfVertices = 10, nrConnections = 10, max = nrOfVertices, min = 0) => {
    const vertices = [];
    const edges = [];

    const gDijkstra = new Graph();
    const gFloyd = new Graph()

    for (let i = 0; i <= nrOfVertices; i++) {
        vertices.push(i.toString());
        gDijkstra.addNode(i.toString(), false);
        gFloyd.addNode(i, true);
    }

    for (let i = 0; i < vertices.length - 1; i++) {
        gDijkstra.addEdge(new Edge(vertices[i], vertices[i + 1], randomNumber(), false));
        gFloyd.addEdge(new Edge(vertices[i], vertices[i + 1], randomNumber(), true));
        edges.push([vertices[i], vertices[i + 1]]);
    }
    const edgeExists = (u, v) => {
        for (let i = 0; i < edges.length; i++) {
            if (edges[i][0] === u && edges[i][1] === v) return true;
        }
        return false;
    };
    while (nrConnections !== 0) {
        const u = vertices[Math.floor(Math.random() * vertices.length)];
        const v = vertices[Math.floor(Math.random() * vertices.length)];
        if (edges.length === 0) {
            gDijkstra.addEdge(new Edge(u, v, randomNumber()));
            gFloyd.addEdge(new Edge(u, v, randomNumber(), true));
            edges.push([u, v]);
            nrOConnections--;
        } else {
            if (!edgeExists(u, v)) {
                gDijkstra.addEdge(new Edge(u, v, randomNumber()));
                gFloyd.addEdge(new Edge(u, v, randomNumber(), true));
                edges.push([u, v]);
                nrConnections--;
            }
        }
    }
    const floydTime = gFloyd.floyd();
    console.log('Floyd time: ', floydTime);
    const dijkstraTime = gDijkstra.dijkstra();
    console.log('Dijkstra time: ', dijkstraTime);
    return { floydTime, dijkstraTime };
};


const run = (vs, es) => {
    const floydPerf = [];
    const dijkstraPerf = [];
    for (let i = 0; i < vs.length; i++) {
        console.log("\n");
        console.log('Vertices: ', vs[i], 'edges: ', es[i]);
        const { floydTime, dijkstraTime } = makeGraph(vs[i], es[i]);
        floydPerf.push(floydTime);
        dijkstraPerf.push(dijkstraTime);

    }

    const floydPlot = { x: vs, y: floydPerf, type: 'line', name: 'Floyd' };
    const dijkstraPlot = { x: vs, y: dijkstraPerf, type: 'line', name: 'Dijkstra' };
    plot([floydPlot]);
    plot([dijkstraPlot]);
    plot([floydPlot, dijkstraPlot]);

};

const nrVertices = [5, 10, 25, 50, 75, 100, 200, 300, 400, 500];
const nrEdges = [5, 10, 25, 50, 75, 100, 300, 500, 700, 1000];
run(nrVertices, nrEdges);