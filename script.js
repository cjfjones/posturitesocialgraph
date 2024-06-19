const svg = d3.select("svg");
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;


let allNodes = [
    { id: 1, name: "Sarah Johnson", title: "End User", colour: "black" },
    { id: 2, name: "Francis", title: "Assessor", colour: "green" },
    { id: 3, name: "Emily", title: "IT", colour: "green" },
    { id: 4, name: "Charlotte", title: "Customer Service", colour: "green" },
    { id: 5, name: "Stevie", title: "Key Account Support", colour: "green" },
    { id: 6, name: "David", title: "H&S Manager", colour: "blue" },
    { id: 7, name: "Laura", title: "Line Manager", colour: "blue" },
    { id: 8, name: "Robert", title: "Accounts Payable", colour: "blue" },
    { id: 9, name: "Adam", title: "Purchasing", colour: "green" },
    { id: 10, name: "Anthony", title: "Account Manager", colour: "green" },
    { id: 11, name: "Hannah", title: "Appointments", colour: "green" }
];


let allLinks = [
    { source: 1, target: 7 },
    { source: 7, target: 11 },
    { source: 11, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 2, target: 9 },
    { source: 1, target: 8 }, { source: 1, target: 9 },
    { source: 1, target: 10 }, { source: 1, target: 2 }, { source: 1, target: 3 }, { source: 1, target: 4 },
    { source: 1, target: 5 }, { source: 1, target: 6 }, { source: 2, target: 1 }, { source: 2, target: 6 },
    { source: 2, target: 7 }, { source: 2, target: 8 }, { source: 3, target: 1 }, { source: 3, target: 4 },
    { source: 3, target: 9 }, { source: 3, target: 10 }, { source: 4, target: 1 }, { source: 4, target: 3 },
    { source: 4, target: 8 }, { source: 4, target: 7 }, { source: 5, target: 1 }, { source: 5, target: 6 },
    { source: 5, target: 9 }, { source: 5, target: 10 }, { source: 6, target: 2 }, { source: 6, target: 5 },
    { source: 6, target: 8 }, { source: 6, target: 7 }, { source: 7, target: 2 }, { source: 7, target: 4 },
    { source: 7, target: 6 }, { source: 7, target: 9 }, { source: 8, target: 2 }, { source: 8, target: 4 },
    { source: 8, target: 6 }, { source: 8, target: 10 }, { source: 9, target: 3 }, { source: 9, target: 5 },
    { source: 9, target: 7 }, { source: 9, target: 10 }, { source: 10, target: 3 }, { source: 10, target: 5 },
    { source: 10, target: 8 }, { source: 10, target: 9 }
];

let nodes = [];
let links = [];
let currentIndex = 0;

const simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-2000)) // Increased the strength of repulsion
    .force("link", d3.forceLink(links).id(d => d.id).distance(300).strength(1))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(d => d.id === 1 ? width / 2 : (d.id % 2 === 0 ? width * 0.25 : width * 0.75)).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .on("tick", ticked);

let link = svg.append("g")
    .attr("class", "links")
    .selectAll("line");

let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g");

function ticked() {
    node.attr("transform", d => {
        d.x = Math.max(margin.left, Math.min(width - margin.right, d.x));
        d.y = Math.max(margin.top, Math.min(height - margin.bottom, d.y));
        return `translate(${d.x},${d.y})`;
    });
    link.attr("x1", d => Math.max(margin.left, Math.min(width - margin.right, d.source.x)))
        .attr("y1", d => Math.max(margin.top, Math.min(height - margin.bottom, d.source.y)))
        .attr("x2", d => Math.max(margin.left, Math.min(width - margin.right, d.target.x)))
        .attr("y2", d => Math.max(margin.top, Math.min(height - margin.bottom, d.target.y)));
}

function getNodeColor(id) {
    return id === 1 ? "green" : (id % 2 === 0 ? "blue" : "red");
}

function update() {
    node = node.data(nodes, d => d.id)
        .join(
            enter => {
                const g = enter.append("g");
                g.append("circle")
                    .attr("r", 10)
                    .attr("fill", d => getNodeColor(d.id))
                    .attr("class", "pulsing")
                    .call(drag(simulation));
                g.append("title")
                    .text(d => `${d.name}\n${d.title}`);
                g.append("text")
                    .attr("x", 12)
                    .attr("y", 3)
                    .text(d => d.name);
                return g;
            },
            update => {
                update.select("title").text(d => `${d.name}\n${d.title}`);
                update.select("text").text(d => d.name);
                update.select("circle").attr("fill", d => getNodeColor(d.id));
                return update;
            },
            exit => exit.remove()
        );

    link = link.data(links, d => `${d.source.id}-${d.target.id}`)
        .join(
            enter => enter.append("line")
                .attr("stroke-width", 2)
                .attr("stroke", "gray"),
            update => update,
            exit => exit.remove()
        );

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    console.log(`Current node count: ${nodes.length}`);
}

function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

d3.select("#addElementBtn").on("click", () => {
    if (currentIndex < allNodes.length) {
        nodes.push(allNodes[currentIndex]);
    } else if (currentIndex < allNodes.length + allLinks.length) {
        links.push(allLinks[currentIndex - allNodes.length]);
    } else {
        console.log("All elements added.");
    }
    currentIndex++;
    update();
});

update();
