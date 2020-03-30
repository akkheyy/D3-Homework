const svgWidth = 960
const svgHeight = 500

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
}

let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// View selection - changing this triggers transition
let currentSelection = "poverty"
let ycurrentSelection = "healthcare"

/**
 * Returns a updated scale based on the current selection.
 **/
function xScale(data, currentSelection) {
  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.map(d => parseInt(d[currentSelection]))) * 0.8,
      d3.max(data.map(d => parseInt(d[currentSelection]))) * 1.2
    ])
    .range([0, width])

  return xLinearScale
}

function yScale(data, currentSelection) {
  let yLinearScale = d3
      .scaleLinear()
      .domain([
      d3.min(data.map(d => parseInt(d[currentSelection]))) * 0.8,
      d3.max(data.map(d => parseInt(d[currentSelection]))) * 1.2
      ])
      .range([height, 0])

  return yLinearScale
}

/**
 * Returns and appends an updated x-axis based on a scale.
 **/
function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale)

  xAxis
    .transition()
    .duration(1000)
    .call(bottomAxis)

  return xAxis
}

function renderYAxes(newYScale, yAxis) {
  let leftAxis = d3.axisBottom(newYScale)

  yAxis
      .transition()
      .duration(1000)
      .call(leftAxis)

  return yAxis
}

/**
 * Returns and appends an updated circles group based on a new scale and the currect selection.
 **/
function renderCircles(circlesGroup, newXScale, currentSelection, newYScale, ycurrentSelection) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentSelection]))
    .attr("cy", d => newYScale(d[ycurrentSelection]))

  return circlesGroup
}

(function() {
  d3.csv("assets/data/data.csv").then(data => {
    let xLinearScale = xScale(data, currentSelection)
    let yLinearScale = yScale(data, ycurrentSelection)
      // .scaleLinear()
      // .domain([0, d3.max(hairData.map(d => parseInt(d.num_hits)))])
      // .range([height, 0])

    let bottomAxis = d3.axisBottom(xLinearScale)
    let leftAxis = d3.axisLeft(yLinearScale)

    let xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
    
    let yAxis = chartGroup
      .append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)

    chartGroup.append("g").call(leftAxis)

    let circlesGroup = chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[currentSelection]))
      .attr("cy", d => yLinearScale(d[currentSelection]))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".5")

    let xlabelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)

    xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("% in Poverty")

    xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Median Age")

    let ylabelsGroup = chartGroup

    ylabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("axis-text", true)
      .text("% Lacking Healthcare")

    ylabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("axis-text", true)
      .text("% Smokers")

    // Crate an event listener to call the update functions when a label is clicked
    xlabelsGroup.selectAll("text").on("click", function() {
      let value = d3.select(this).attr("value")
      if (value !== currentSelection) {
        currentSelection = value
        xLinearScale = xScale(data, currentSelection)
        xAxis = renderAxes(xLinearScale, xAxis)
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          currentSelection
        )
      }
    })

    ylabelsGroup.selectAll("text").on("click", function() {
      let value = d3.select(this).attr("value")
      if (value !== currentSelection) {
        currentSelection = value
        yLinearScale = yScale(data, currentSelection)
        yAxis = renderAxes(yLinearScale, yAxis)
        circlesGroup = renderCircles(
          circlesGroup,
          yLinearScale,
          currentSelection
        )
      }
    })
  })
})()
