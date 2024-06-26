const svg = d3.select("svg");
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;


let allNodes = [
    { id: 1, name: "Mary", title: "End User", colour: "black" },
    { id: 2, name: "Line Manager", title: "", colour: "blue" },
    { id: 3, name: "Appointments", title: "", colour: "green" },
    { id: 4, name: "Assessor", title: "", colour: "green" },
    { id: 5, name: "Customer Service", title: "", colour: "green" },
    { id: 6, name: "Marketing", title: "", colour: "green" },
    { id: 7, name: "H&S", title: "", colour: "blue" },
    { id: 8, name: "ATN", title: "", colour: "green" },
    { id: 9, name: "Procurement", title: "", colour: "green" },
    { id: 10, name: "Install Tech", title: "", colour: "green" },
    { id: 11, name: "Accounts/Finance", title: "", colour: "blue" },
    { id: 12, name: "Quotes", title: "", colour: "green" },
    { id: 13, name: "Aftercare Warranties", title: "", colour: "green" },
    { id: 14, name: "RICO", title: "", colour: "blue" },
    { id: 15, name: "KAS", title: "", colour: "green" },
    { id: 16, name: "Managed Service", title: "", colour: "green" },
    { id: 17, name: "Purchasing", title: "", colour: "green" },
    { id: 18, name: "Finance", title: "", colour: "blue" }
];



let allLinks = [
    { source: 1, target: 2 },
    { source: 1, target: 4 },
    { source: 1, target: 8 },
    { source: 1, target: 10 },
    { source: 1, target: 11 },
    { source: 1, target: 14 },
    { source: 1, target: 13 },
    { source: 2, target: 3 },
    { source: 2, target: 6 },
    { source: 2, target: 5 },
    { source: 2, target: 8 },
    { source: 2, target: 11 },
    { source: 2, target: 7 },
    { source: 3, target: 11 },
    { source: 4, target: 17 },
    { source: 4, target: 10 },
    { source: 5, target: 3 },
    { source: 5, target: 6 },
    { source: 5, target: 11 },
    { source: 6, target: 12 },
    { source: 6, target: 8 },
    { source: 6, target: 11 },
    { source: 6, target: 7 },
    { source: 9, target: 8 },
    { source: 10, target: 13 },
    { source: 11, target: 14 },
    { source: 11, target: 18 },
    { source: 14, target: 15 },
    { source: 14, target: 18 },
    { source: 15, target: 3 },
    { source: 15, target: 9 },
    { source: 15, target: 16 },
    { source: 16, target: 18 },
    { source: 17, target: 10 },
    { source: 17, target: 13 },
    { source: 18, target: 9 }
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
    const node = allNodes.find(node => node.id === id);
    return node ? node.colour : "red";
}


function update() {
    node = node.data(nodes, d => d.id)
        .join(
            enter => {
                const g = enter.append("g");

                // Append an image instead of a circle for nodes with green color
                g.each(function (d) {
                    const node = d3.select(this);
                    if (getNodeColor(d.id) === "green") {
                        node.append("image")
                            .attr("xlink:href", "https://yt3.googleusercontent.com/ytc/AIdro_lt3_L1YVYRdqE6WT4W-0FMYiBF-8wlDfihenp32zUeTGA=s176-c-k-c0x00ffffff-no-rj")
                            .attr("width", 20) // Adjust the size as needed
                            .attr("height", 20) // Adjust the size as needed
                            .attr("x", -10) // Adjust to center the image on the node's position
                            .attr("y", -10); // Adjust to center the image on the node's position
                    } else {
                        node.append("circle")
                            .attr("r", 10)
                            .attr("fill", d => getNodeColor(d.id))
                            .attr("class", "pulsing");
                    }
                });

                g.append("title")
                    .text(d => `${d.name}\n${d.title}`);
                g.append("text")
                    .attr("x", 12)
                    .attr("y", 3)
                    .text(d => d.name);
                return g;
            },
            update => {
                update.each(function (d) {
                    const node = d3.select(this);
                    if (getNodeColor(d.id) === "green") {
                        node.select("circle").remove(); // Remove existing circle if any
                        const image = node.select("image");
                        if (image.empty()) { // Add image if it doesn't exist
                            node.append("image")
                                .attr("xlink:href", "https://yt3.googleusercontent.com/ytc/AIdro_lt3_L1YVYRdqE6WT4W-0FMYiBF-8wlDfihenp32zUeTGA=s176-c-k-c0x00ffffff-no-rj")
                                .attr("width", 20) // Adjust the size as needed
                                .attr("height", 20) // Adjust the size as needed
                                .attr("x", -10) // Adjust to center the image on the node's position
                                .attr("y", -10); // Adjust to center the image on the node's position
                        }
                    } else {
                        node.select("image").remove(); // Remove existing image if any
                        const circle = node.select("circle");
                        if (circle.empty()) { // Add circle if it doesn't exist
                            node.append("circle")
                                .attr("r", 10)
                                .attr("fill", d => getNodeColor(d.id))
                                .attr("class", "pulsing");
                        }
                    }
                });

                update.select("title").text(d => `${d.name}\n${d.title}`);
                update.select("text").text(d => d.name);
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
        if (currentIndex > 0) {
            const sourceId = allNodes[currentIndex - 1].id;
            const targetId = allNodes[currentIndex].id;
            const linkExists = allLinks.some(link => (link.source === sourceId && link.target === targetId) || (link.source === targetId && link.target === sourceId));
            if (linkExists) {
                links.push({ source: sourceId, target: targetId });
            }
        }
    } else if (currentIndex < allNodes.length + allLinks.length) {
        links.push(allLinks[currentIndex - allNodes.length]);
    } else {
        console.log("All elements added.");
    }
    currentIndex++;
    update();
});

update();
