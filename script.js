const svg = d3.select("svg");
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;


let allNodes = [
    { id: 1, name: "Marketing", title: "", colour: "green" },
    { id: 2, name: "Line Manager", title: "", colour: "blue" },
    { id: 3, name: "Skye", title: "End User", colour: "black" },
    { id: 4, name: "H&S", title: "", colour: "blue" },
    { id: 5, name: "Contact Us", title: "", colour: "green" },
    { id: 6, name: "Regional Lead", title: "", colour: "green" },
    { id: 7, name: "Account Manager", title: "", colour: "green" },
    { id: 8, name: "Appointments", title: "", colour: "green" },
    { id: 9, name: "Assessor", title: "", colour: "green" },
    { id: 10, name: "IT", title: "", colour: "green" },
    { id: 11, name: "Quotes", title: "", colour: "green" },
    { id: 12, name: "Orders", title: "", colour: "green" },
    { id: 13, name: "Credit Control", title: "", colour: "green" },
    { id: 14, name: "TVS", title: "", colour: "green" },
    { id: 15, name: "Aftercare", title: "", colour: "green" },
    { id: 16, name: "Purchasing", title: "", colour: "green" },
    { id: 17, name: "Install Tech", title: "", colour: "green" },
    { id: 18, name: "Key Account Support", title: "", colour: "green" },
    { id: 19, name: "Managed Service", title: "", colour: "green" },
    { id: 20, name: "Enablement", title: "", colour: "green" },
    { id: 21, name: "Projects", title: "", colour: "green" },
    { id: 22, name: "Bids", title: "", colour: "green" },
    { id: 23, name: "Business Standards", title: "", colour: "green" },
    { id: 24, name: "DSE Advice", title: "", colour: "green" },
    { id: 25, name: "Procurement", title: "", colour: "blue" },
    { id: 26, name: "Accounts Payable", title: "", colour: "blue" },
    { id: 27, name: "Legal", title: "", colour: "blue" },
    { id: 28, name: "Goods Reciept", title: "", colour: "blue" },
    { id: 29, name: "Facilities", title: "", colour: "blue" },
    { id: 30, name: "Security", title: "", colour: "blue" },
    { id: 31, name: "Client HR/DEI", title: "", colour: "blue" },
    { id: 32, name: "Client HR", title: "", colour: "blue" },
    { id: 33, name: "Finance", title: "", colour: "green" },


];



let allLinks = [
    { source: 1, target: 2 }, // Marketing -> Line Manager
    { source: 2, target: 3 }, // Line Manager -> Skye
    { source: 2, target: 4 }, // Line Manager -> H&S
    { source: 4, target: 5 }, // H&S -> Contact Us
    { source: 5, target: 6 }, // Contact Us -> Regional Lead
    { source: 6, target: 7 }, // Regional Lead -> Account Manager
    { source: 7, target: 4 }, // Account Manager -> H&S
    { source: 4, target: 8 }, // H&S -> Appointments
    { source: 3, target: 9 }, // Skye -> Assessor
    { source: 9, target: 10 }, // Assessor -> IT
    { source: 9, target: 2 }, // Assessor -> Line Manager
    { source: 2, target: 11 }, // Line Manager -> Quotes
    { source: 2, target: 12 }, // Line Manager -> Orders
    { source: 12, target: 3 }, // Orders -> Skye
    { source: 13, target: 12 }, // Finance -> Orders
    { source: 12, target: 7 }, // Orders -> Account Manager
    { source: 7, target: 13 }, // Account Manager -> Finance
    { source: 14, target: 3 }, // TVS -> Skye
    { source: 14, target: 15 }, // TVS -> Aftercare
    { source: 15, target: 16 }, // Aftercare -> Purchasing
    { source: 15, target: 17 }, // Aftercare -> Install Tech



];


let nodes = [];
let links = [];
let currentIndex = 0;

const simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000)) // Increased the strength of repulsion
    .force("link", d3.forceLink(links).id(d => d.id).distance(250).strength(0.5))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(d => d.id === 1 ? width / 2 : (d.id % 2 === 0 ? width * 0.25 : width * 0.75)).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .on("tick", ticked);

// Update the link selection to use <path> elements
let link = svg.append("g")
    .attr("class", "links")
    .selectAll("path");

let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g");

// Enhance node appearance and interactivity
node.selectAll("circle")
    .attr("r", 10)
    .attr("fill", d => getNodeColor(d.id))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .on("mouseover", function (event, d) {
        d3.select(this)
            .attr("stroke", "gold")
            .attr("stroke-width", 3);
        // Show tooltip
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Name: ${d.name}<br/>Title: ${d.title}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
        d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
        // Hide tooltip
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Tooltip div for displaying node information
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add CSS for the tooltip
// .tooltip {
//     position: absolute;
//     text-align: center;
//     width: 120px;
//     height: 28px;
//     padding: 2px;
//     font: 12px sans-serif;
//     background: lightsteelblue;
//     border: 0px;
//     border-radius: 8px;
//     pointer-events: none;
// }

// Implement zoom and pan functionality
const zoomHandler = d3.zoom()
    .on("zoom", (event) => {
        svg.attr("transform", event.transform);
    });

svg.call(zoomHandler);

// Example of adding a legend (simplified for brevity)
const legend = svg.append("g")
    .attr("class", "legend")
    .selectAll("g")
    .data(["Marketing", "Line Manager", "End User"])
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legend.append("circle")
    .attr("r", 5)
    .attr("fill", d => {
        if (d === "End User") return "black";
        else if (d === "Line Manager") return "blue";
        else return "green";
    });

legend.append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text(d => d);

function ticked() {
    const borderPadding = 50; // Padding from the border
    const labelHeight = 16; // Approximate height of the text label
    const nodeRadius = 10; // Radius of the node circle
    const totalNodeHeight = nodeRadius + labelHeight; // Total height to consider for node and label

    node.attr("transform", d => {
        if (d.name === "Skye") {
            // Keep Skye in the center
            d.x = width / 2;
            d.y = height / 2;
        } else {
            // Adjust other nodes to stay within the 50px border, considering label size
            d.x = Math.max(borderPadding + nodeRadius, Math.min(width - borderPadding - nodeRadius, d.x));
            d.y = Math.max(borderPadding + totalNodeHeight, Math.min(height - borderPadding, d.y));
        }
        return `translate(${d.x},${d.y})`;
    });

    // Draw straight lines for links
    link.attr("d", d => {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
    });
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

                // Append an image or a circle for nodes
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

                // Adjust the 'y' attribute to position the labels underneath the nodes
                g.append("text")
                    .attr("x", 0) // Center the label horizontally
                    .attr("y", 25) // Position the label below the node
                    .attr("text-anchor", "middle") // Ensure the text is centered on its x coordinate
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
                // Update the position of the labels for existing nodes
                update.select("text")
                    .attr("x", 0) // Center the label horizontally
                    .attr("y", 25) // Position the label below the node
                    .attr("text-anchor", "middle") // Ensure the text is centered on its x coordinate
                    .text(d => d.name);
                return update;
            },
            exit => exit.remove()
        );

// Ensure the rest of your code updates the link selection to append and update <path> elements
link = link.data(links, d => `${d.source.id}-${d.target.id}`)
    .join(
        enter => enter.append("path")
            .attr("stroke-width", 2)
            .attr("stroke", "gray")
            .attr("fill", "none"), // Ensure paths are not filled
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
        currentIndex++;
    } else if (currentIndex < allNodes.length + allLinks.length) {
        // No need to increment currentIndex here, as we are adding links based on nodes
    } else {
        console.log("All elements added.");
        return;
    }

    // Check for all possible links that can be added
    links = allLinks.filter(link => {
        const sourceNode = nodes.find(node => node.id === link.source);
        const targetNode = nodes.find(node => node.id === link.target);
        return sourceNode && targetNode;
    });

    update();
});

update();
