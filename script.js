const svg = d3.select("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .on("wheel", (event) => event.preventDefault());

const width = window.innerWidth;
const height = window.innerHeight;




let nodes = [];
let links = [];
let currentIndex = 0;

const simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-4000)) // Increased the strength of repulsion
    .force("link", d3.forceLink(links).id(d => d.id).distance(600).strength(1.5))
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
                const g = enter.append("g")
                    //.call(drag(simulation));

                // Append a circle for nodes
                g.append("circle")
                    .attr("r", 150) // Increase the radius of the circles
                    .attr("fill", d => getNodeColor(d.id))
                    .attr("stroke", "white")
                    .attr("class", "pulsing")
                    .attr("stroke-width", 2);

                g.append("title")
                    .text(d => `${d.name}\n${d.title}`);

                // Adjust the 'dy' attribute to position the labels inside the nodes
                g.append("text")
                    .attr("dy", ".35em")
                    .attr("fill", "yellow")
                    .attr("text-anchor", "middle")
                    .text(d => d.name);

                return g;
            },
            update => {
                update.select("circle")
                    .attr("r", 30) // Ensure the radius is updated
                    .attr("fill", d => getNodeColor(d.id))
                    .attr("class", "pulsing-subtle")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);

                update.select("title")
                    .text(d => `${d.name}\n${d.title}`);

                // Update the position of the labels for existing nodes
                update.select("text")
                    .attr("dy", ".25em")
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .attr("font-size", "20px")
                    .text(d => d.name);

                return update;
            },
            exit => exit.remove()
        );

    // Ensure the rest of your code updates the link selection to append and update <path> elements
    link = link.data(links, d => `${d.source.id}-${d.target.id}`)
        .join(
            enter => enter.append("path")
                .attr("stroke-width", 3)
                .attr("stroke", "white")
                .attr("fill", "none"), // Ensure paths are not filled
            update => update,
            exit => exit.remove()
        );

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    console.log(`Current node count: ${nodes.length}`);
}


svg.on("click", () => {
    if (currentIndex < allNodes.length) {
        nodes.push(allNodes[currentIndex]);
        currentIndex++;
    } else {
        console.log("All elements added.");
        return;
    }

    // Add new links based on the newly added node
    const newLinks = allLinks.filter(link => {
        const sourceNode = nodes.find(node => node.id === link.source);
        const targetNode = nodes.find(node => node.id === link.target);
        return sourceNode && targetNode && !links.some(existingLink => existingLink.source.id === link.source && existingLink.target.id === link.target);
    });

    links = links.concat(newLinks);

    update();
});


let allNodes = [
    { id: 1, name: "Marketing", title: "", colour: "#006340" },
    { id: 2, name: "Line Manager", title: "", colour: "blue" },
    { id: 3, name: "Skye", title: "End User", colour: "black" },
    { id: 4, name: "H&S", title: "", colour: "blue" },
    { id: 5, name: "Contact Us", title: "", colour: "#006340" },
    { id: 6, name: "Regional Lead", title: "", colour: "#006340" },
    { id: 7, name: "Account Manager", title: "", colour: "#006340" },
    { id: 8, name: "Appointments", title: "", colour: "#006340" },
    { id: 9, name: "Assessor", title: "", colour: "#006340" },
    { id: 10, name: "IT", title: "", colour: "#006340" },
    { id: 11, name: "Quotes", title: "", colour: "#006340" },
    { id: 12, name: "Orders", title: "", colour: "#006340" },
    { id: 13, name: "Credit Control", title: "", colour: "#006340" },
    { id: 14, name: "TVS", title: "", colour: "#006340" },
    { id: 15, name: "Aftercare", title: "", colour: "#006340" },
    { id: 16, name: "Purchasing", title: "", colour: "#006340" },
    { id: 17, name: "Install Tech", title: "", colour: "#006340" },
    { id: 18, name: "Key Account Support", title: "", colour: "#006340" },
    { id: 19, name: "Managed Service", title: "", colour: "#006340" },
    { id: 20, name: "Enablement", title: "", colour: "#006340" },
    { id: 21, name: "Projects", title: "", colour: "#006340" },
    { id: 22, name: "Bids", title: "", colour: "#006340" },
    { id: 23, name: "Business Standards", title: "", colour: "#006340" },
    { id: 24, name: "DSE Advice", title: "", colour: "#006340" },
    { id: 25, name: "Procurement", title: "", colour: "blue" },
    { id: 26, name: "Accounts Payable", title: "", colour: "blue" },
    { id: 27, name: "Legal", title: "", colour: "blue" },
    { id: 28, name: "Goods Reciept", title: "", colour: "blue" },
    { id: 29, name: "Facilities", title: "", colour: "blue" },
    { id: 30, name: "Security", title: "", colour: "blue" },
    { id: 31, name: "Client HR/DEI", title: "", colour: "blue" },
    { id: 32, name: "Client HR", title: "", colour: "blue" },
    { id: 33, name: "Finance", title: "", colour: "#006340" },


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



update();
