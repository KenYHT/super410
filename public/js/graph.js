var width = window.innerWidth, // TODO: figure out a way to center this?
  height = window.innerHeight;
var usingSimilarityColoring = false;
var DEFAULT_COLOR = "#add8e6";


var force = d3.layout.force()
  .linkStrength(0.1)
  .friction(0.9)
  .linkDistance(30)
  .charge(-120)
  .size([width, height]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


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
    .friction(0.9)
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
      return d3.rgb(DEFAULT_COLOR);
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
    console.log(d);
    tip.show();
    /* var source = getPaperObject(this); // TODO: implement this (selectAll returns an array? a selection?)
     svg.selectAll(".node").style("fill", function (vertex) {
       return d3.rgb(0, parseInt(paperSimilarity(getPaperObject(vertex))), 0); // TODO: how to get all individual papers?
     });*/
  });
});

/**
 * source and target both objects of the form
 * {
 *   title: theTitle (string),
 *   authors: [author1, author2, ...] (array of strings),
 *   abstract: theAbstract (string)
 * }
 */
function paperSimilarity(source, target) {
  return (
    bm25(source.title, source.title) +
    bm25(source.authors, target.authors) +
    bm25(source.abstract, target.abstract) // TODO: grab this from the dice coefficient package
  ) / 3.0;
}
