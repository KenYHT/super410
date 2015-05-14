// TODO: change color of edges based on citing in/citing out

var width = window.innerWidth;
var height = window.innerHeight;
var force = d3.layout.force()
  .charge(-800)
  .friction(0.1)
  .linkDistance(100)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
  .on("dblclick.zoom", null)
  .append("g")
  .on("dblclick.zoom", null);

svg.append("rect")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height)
  .attr("opacity", 0.0);

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<p><b>" + d.title + "</b></p><p>" + d.text + "</p>" + "<p>" + d.author_list + "</p>";
  });

svg.call(tip);

function drawGraph(graph) {
  svg.selectAll('*').remove();

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrowhead)")
    .style("stroke-width", 2);

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 7)
    .style("fill", function (d) {
      return d3.rgb("#add8e6");
    })
    .call(force.drag);

  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("markerWidth", 6)
    .attr("markerHeight", 14)
    .attr('refX', 0)
    .attr('refY', 0)
    .attr("orient", "auto")
    .append("path")
    .style("fill", "LightGray")
    .attr("d", "M 0,0 V 4 L6,2 Z");

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
    if (d.canOpenPage) {
      window.open('http://arxiv.org/abs/hep-th/' + d.id, '_blank');
      d.canOpenPage = false;
    } else {
      d.canOpenPage = true;
    }
    svg.selectAll(".node").style('fill', function (curr) {
      return getColorFromSimilarity(d, curr);
    });

    link.style('stroke', function (l) {
      if (d === l.source) {
        return "Red";
      } else if (d === l.target) {
        return "Blue";
      }
    });
  });

  node.on("mouseover", tip.show);
  node.on("mouseout", tip.hide);
}

function getColorFromSimilarity(source, target) {
  var titleSimilarity = compare(source.title, target.title);
  var abstractSimilarity = compare(source.text, target.text);
  var similarity = (titleSimilarity + abstractSimilarity) / 2.0;
  return d3.hsl(120 * similarity, 1, 0.5);
}
