var width = 960,
  height = 500;

var force = d3.layout.force()
  .charge(-160)
  .linkDistance(40)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var tip = d3.tip() // todo: uhhhhhh?
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "abstract and title goes here";
  });

svg.call(tip);

d3.json('./js/miserables.json', function (error, graph) {
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 7)
    .style("fill", function (d) {
      return d3.rgb("#add8e6");
    })
    .call(force.drag);

  force.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node.attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  });

  node.on("click", function (d) {
    console.log(d.name);
    // TODO: change the color of other vertices based on similarity
  });

  node.on("mouseover", tip.show);
  node.on("mouseout", tip.hide);

});
