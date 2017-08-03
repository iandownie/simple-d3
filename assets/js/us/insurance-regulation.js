var width = 1500,
    height = 1000;

var svg = d3.select("body").append("svg")
    .attr("width", '100vw')
    .attr("height", height);
// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection



var regulations = { states: [] };
d3.csv("./assets/data/us/regulation-reports.csv", function(error, data) {
    console.log(error);

    regulations.data = d3.nest()
        .key(function(d) { return d.year })
        .key(function(d) { return d.state })
        // .rollup(function(d) {
        //     return {
        //         damage: d3.sum(d, function(e) { return e.PROPDMG; }),
        //         occupants: d3.sum(d, function(e) { if (e.TOCCUPANTS != 777) { return e.TOCCUPANTS; } }),
        //         injuries: d3.sum(d, function(e) { return e.INJURIES; }),
        //         fatalities: d3.sum(d, function(e) { return e.FATALITIES; }),
        //         vehicles: d3.sum(d, function(e) { return e.VEHICLES; }),
        //     };
        // })
        .entries(data);
    regulations.data.forEach(function(d) {
        d.totals = {};
        for (var property in d.values[0].values) {
            d.totals[property] = d3.sum(d.values, function(e) {
                return e.values[property];
            });
        }
    });
});

d3.json("./assets/data/us/state-abbr.json", function(error, data) {
    regulations.stateAbbr = data;
});
d3.json("./assets/data/us/states-labeled.json", function(error, us) {
    if (error) throw error;
    console.log(us);
    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
        .data(us.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) {
            return "444";
        })
        .on('mouseover', function(d, i){
            console.log(d);
            console.log(i);
        });
});