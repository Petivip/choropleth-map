

var w = 960,
h = 600;


var svgcont = d3.select(".cont");


var tooltip = svgcont.append("div").
attr("class", "tooltip").
attr("id", "tooltip").
attr("opacity", 0);

var unemployment = d3.map();

var p = d3.geoPath();

var xScale = d3.scaleLinear().
domain([2.6, 75.1]).
rangeRound([600, 860]);

var color = d3.scaleThreshold().
domain(d3.range(2.6, 75.1, (2.6, 75.1) / 6)).
range(d3.schemeReds[7]);

var svg = svgcont.append("svg").
attr("width", w).
attr("height", h);
var g = svg.append("g").
attr("id", "legend").
attr("transform", "translate(0,40)");

g.selectAll("rect").
data(color.range().map(function (d) {
  d = color.invertExtent(d);
  if (d[0] == null) d[0] = xScale.domain()[0];
  if (d[1] == null) d[1] = xScale.domain()[1];
  return d;
})).
enter().append("rect").
attr("height", 9).
attr("x", function (d) {return xScale(d[0]);}).
attr("width", function (d) {return xScale(d[1]) - xScale(d[0]);}).
attr("fill", function (d) {return color(d[0]);});

var xAxis = d3.axisBottom(xScale).
tickSize(15).
tickFormat(function (x) {return Math.round(x) + "%";}).
tickValues(color.domain());



g.call(xAxis).
select(".domain").
remove();


var EDUC = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
var COUNTY = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

d3.queue().
defer(d3.json, COUNTY).
defer(d3.json, EDUC).
await(callback);

function callback(error, usGeo, edu) {
  if (error) throw error;
  svg.append("g").
  selectAll("path").
  data(topojson.feature(usGeo, usGeo.objects.counties).features).
  enter().
  append("path").
  attr("fill", function (d) {
    var res = edu.filter(function (e) {
      return e.fips == d.id;
    });

    if (res[0]) {
      return color(res[0].bachelorsOrHigher);
    }
    return color(0);

  }).
  attr("d", p).
  on("mouseover", function (d) {
    tooltip.style("opacity", 0.8);
    tooltip.html(function () {
      var res = edu.filter(function (e) {
        return e.fips == d.id;
      });
      if (res[0]) {
        return res[0].area_name + ", " + res[0].state + ": " + res[0].bachelorsOrHigher + "%";
      }}).


    style("left", d3.event.pageX + 10 + 'px').
    style("top", d3.event.pageY - 20 + 'px');
  }).
  on("mouseout", function () {
    tooltip.style("opacity", 0);
  });
  svg.append("path").
  datum(topojson.mesh(usGeo, usGeo.objects.states), function (a, b) {return a !== b;}).
  attr("class", "states").
  attr("d", p);


}