function _1(md){return(
md`# CSCE 679 - Data Visualization Assignment 2`
)}

function _d3(require){return(
require('d3@7')
)}

function _3(md){return(
md`Load the Data`
)}

function _data(__query,FileAttachment,invalidation){return(
__query(FileAttachment("temperature_daily@1.csv"),{from:{table:"temperature_daily"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _5(data){return(
data
)}

function _6(md){return(
md`Checking the loaded data`
)}

function _7(data){return(
data[0]
)}

function _8(data){return(
data[0].max_temperature
)}

function _9(md){return(
md`To visualize monthly temperature data, we have to group the data by (month, year)`
)}

function _10(md){return(
md`Grouping the data by month and year, and getting the max temperature for the (month,year) in 'max' and min temperature for (month, year) in min_temp`
)}

function _groupTempByYear(d3,data){return(
d3.rollup(
  data,
  v => ({
    max: d3.max(v, d => d.max_temperature), 
    min: d3.min(v, d => d.min_temperature) 
  }),
  d => d.date.getFullYear(),  
  d => d.date.getMonth() + 1 
)
)}

function _12(md){return(
md`Getting the max_temp, min_temp for every (year, month) combination for the first graph (Level 1)`
)}

function _temperatureByMonth(groupTempByYear){return(
Array.from(groupTempByYear, ([year, months]) =>
  Array.from(months, ([month, temps]) => ({
    year: year,
    month: month,
    max_temp: temps.max,
    min_temp: temps.min
  }))
).flat()
)}

function _14(md){return(
md`Getting the max_temp, min_temp for every (year, month) combination for the heatmap graph (Level 2) filtering results from 2007 to 2018 for the second graph`
)}

function _temperatureByMonthAfter2007(groupTempByYear){return(
Array.from(groupTempByYear, ([year, months]) =>
  year >= 2007 
    ? Array.from(months, ([month, temps]) => ({
        year: year,
        month: month,
        max_temp: temps.max,
        min_temp: temps.min
      }))
    : [] 
).flat()
)}

function _dailyTempByMonth(d3,data){return(
d3.group(
  data,
  d => d.date.getFullYear(),
  d => d.date.getMonth() + 1
)
)}

function _17(md){return(
md`For the year 2007-2018, a dataset which contains the information of year, month for every day along with the max_temp, min_temp

This is required to create the line graph for temp changes in particular (month, year) combination`
)}

function _dailyTempForPlot(dailyTempByMonth){return(
Array.from(dailyTempByMonth, ([year, months]) => {
  if (year < 2007) return [];
  
  return Array.from(months, ([month, days]) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    return days.map(d => ({
      year: year,
      month: month,
      day: d.date.getDate(),
      dayNorm: d.date.getDate() / daysInMonth, 
      max_temp: d.max_temperature,
      min_temp: d.min_temperature,
      yearMonth: `${year}-${month}` 
    }));
  });
}).flat(2).filter(d => d !== undefined)
)}

function _19(md){return(
md`To plot the 'Year' in the x-axis`
)}

function _years(temperatureByMonth){return(
Array.from(new Set(temperatureByMonth.map(d => d.year))).sort()
)}

function _21(md){return(
md`To plot the 'Month' in the y-axis`
)}

function _months(){return(
Array.from({ length: 12 }, (_, i) => i + 1)
)}

function _23(md){return(
md`Use the Dropdown below to view the Max Temperature/Min Temperature in (Month, Year) of Hong Kong

The heatmap indicating 'max temperature' and 'min temperature' based on color encodings, updates for both the maps (in Level 1 and Level 2) based on the selection made with the dropdown below`
)}

function _24(md){return(
md`Select to view Max Temp or Min Temp`
)}

function _select(Inputs){return(
Inputs.select(["Max Temperature", "Min Temperature"], {label: "Select Temperature (Max/Min)"})
)}

function _26(select){return(
select
)}

function _27(md){return(
md`**Level 1 - Year/Month Heatmap**`
)}

function _plot(Plot,d3,select,temperatureByMonth){return(
Plot.plot({
  padding: 0,
  height: 600, 
  width:1200,
    x: {
      domain: d3.range(1997, 2017),
      label: null
    },
    y: {
      domain: d3.range(1, 13), 
      tickFormat: d => ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"][d-1],
      label: null
    },
   color: { 
    scheme: select === "Min Temperature"? "Viridis": "YlOrRd",  //setting the colour scheme based on dropdown selection for better visualization
    type:"linear",
    legend: true
  },
  marks: [
    Plot.rect(
      temperatureByMonth,
       {
        x: "year",         
        y: "month",        
        fill: select === "Min Temperature" ? "min_temp" : "max_temp", //selecting the field (min_temp / max_temp) based on selection made above
        width: 30,          
        height: 30,      
        dx: 5, 
        dy: 5, 
        tip: true, 
        inset: 0.5, 
        title: (d) => `Date: ${d.year}/${d.month}; max=${d.max_temp}, min=${d.min_temp}`,
      }), 
    
  ], 
  
})
)}

function _29(md){return(
md`**Level 2 - Improvement of the Year/Month Heatmap**`
)}

function _chart(dailyTempForPlot,select,d3,temperatureByMonthAfter2007)
{

  //box size adjustments for the graph and individual plots/rectangles (mini charts) 
  const width = 1000;
  const height = 600;
  const margin = { top: 50, right: 60, bottom: 30, left: 90 };
  
  const years = [...new Set(dailyTempForPlot.map(d => d.year))].sort((a, b) => a - b);
  const months = [...new Set(dailyTempForPlot.map(d => d.month))].sort((a, b) => a - b);

  //setting the temperature type based on selected value from the dropdown above
  const tempType = select === "Min Temperature" ? "min_temp" : "max_temp";
  const tempExtent = d3.extent(temperatureByMonthAfter2007, d => d[tempType]);

  //setting the colour scale for the heatmap based on the select value (Viridis for min_temp and YlOrRd for max_temp)
  const colorScale = d3.scaleSequential()
  .domain([tempExtent[0] - 2, tempExtent[1] + 2])
  .interpolator(select === "Min Temperature" ? d3.interpolateViridis : d3.interpolateYlOrRd); 

  //adjusting individual rectangles (cells) dimensions based on the years and months to plot
  const cellWidth = (width - margin.left - margin.right) / years.length;
  const cellHeight = (height - margin.top - margin.bottom) / months.length;
  
  function drawNewChart(svg, year, month, x, y, width, height) {
    
    const monthData = dailyTempForPlot.filter(d => d.year === year && d.month === month);
    
    if (monthData.length === 0) return null;
    
    const padding = 5;
    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;
    
    //select either max_temp or min_temp based on the selection made from the dropdown above
    const selectedTemp = select === "Min Temperature" ? d3.min(monthData, d => d.min_temp) : d3.max(monthData, d => d.max_temp);
    const minTemp = d3.min(monthData, d => d.min_temp).toFixed(1);
    const maxTemp = d3.max(monthData, d => d.max_temp).toFixed(1);
    
    // creating a group for the chart
    const g = svg.append("g")
      .attr("transform", `translate(${x + padding}, ${y + padding})`);

    //add tooltip which is shown when hovering over every rectangle (year, month) combination in the graph
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "2px");
    
    // the 'rect' represents the max_temp/min_temp (based on selection) for that particular (year, month) combination
      g.append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", colorScale(selectedTemp))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
          tooltip.style("visibility", "visible")
          .text(`Date: ${year}/${month}; max=${maxTemp}, min=${minTemp}`);
        })
        .on("mousemove", function(event) {
          tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("visibility", "hidden");
        });
   
    const xScale = d3.scaleLinear()
      .domain([0, 1]) 
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([
        d3.min(monthData, d => d.min_temp) - 1,
        d3.max(monthData, d => d.max_temp) + 1
      ])
      .range([innerHeight, 0]);
    
    //line for daily maximum temperature 
    const maxLine = d3.line()
      .x(d => xScale(d.dayNorm))
      .y(d => yScale(d.max_temp))
      .curve(d3.curveBasis);
    
    //line for daily minimum temperature 
    const minLine = d3.line()
      .x(d => xScale(d.dayNorm))
      .y(d => yScale(d.min_temp))
      .curve(d3.curveBasis);
    
    // the line graph to show fluctuation in the  maximum temperature of every day in the particular (year, month) combination
    g.append("path")
      .datum(monthData)
      .attr("fill", "none")
      .attr("stroke", "#008000") 
      .attr("stroke-width", 1.5)
      .attr("d", maxLine);
    
   // the line graph to show fluctuation in the  minimum temperature of every day in the particular (year, month) combination
    g.append("path")
      .datum(monthData)
      .attr("fill", "none")
      .attr("stroke", "#0000FF") 
      .attr("stroke-width", 1.5) 
      .attr("d", minLine);
    
    return g;
  }

  // Create single SVG element
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  
  years.forEach((year, i) => {
    svg.append("text")
      .attr("x", margin.left + i * cellWidth + cellWidth / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(year);
  });

  //month labels for the months 0-11
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((month, i) => {
    svg.append("text")
      .attr("x", margin.left - 10)
      .attr("y", margin.top + i * cellHeight + cellHeight / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .text(monthNames[month - 1]); // Adjust index since your months are 1-based
  });

  // for every (year, month) combo, draw a new chart
  years.forEach((year, yearIndex) => {
    months.forEach((month, monthIndex) => {
      drawNewChart(
        svg,
        year,
        month,
        margin.left + yearIndex * cellWidth,
        margin.top + monthIndex * cellHeight,
        cellWidth,
        cellHeight
      );
    });
  });

  //Legend for the chart (this legend indicates the colour scheme for the heatmap)
  const widthOfLegend = 20;
  const heightOfLegend = height - margin.top - margin.bottom;
  const legendX = width - margin.right / 2;

  
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "temperature-gradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  
  const stops = d3.range(0, 1.01, 0.1);
  stops.forEach(stop => {
    const tempValue = tempExtent[0] + stop * (tempExtent[1] - tempExtent[0]);
    gradient.append("stop")
      .attr("offset", `${stop * 100}%`)
      .attr("stop-color", colorScale(tempValue));
  });

  svg.append("rect")
    .attr("x", legendX - widthOfLegend / 2)
    .attr("y", margin.top)
    .attr("width", widthOfLegend)
    .attr("height", heightOfLegend)
    .style("fill", "url(#temperature-gradient)");

  const scaleForLegend = d3.scaleLinear()
    .domain([tempExtent[0], tempExtent[1]])
    .range([0, heightOfLegend]);

  const axis = d3.axisRight(scaleForLegend)
    .ticks(5)
    .tickFormat(d => `${d.toFixed(0)}`);

  svg.append("g")
    .attr("transform", `translate(${legendX + widthOfLegend / 2}, ${margin.top})`)
    .call(axis);

  svg.append("text")
    .attr("x", legendX)
    .attr("y", margin.top - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("");

  
  // Create a div element and append the SVG to it for proper rendering in Observable
  const div = document.createElement("div");
  div.appendChild(svg.node());

  // Return the div containing the SVG
  return div;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["temperature_daily@1.csv", {url: new URL("./files/b14b4f364b839e451743331d515692dfc66046924d40e4bff6502f032bd591975811b46cb81d1e7e540231b79a2fa0f4299b0e339e0358f08bef900595e74b15.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("data")).define("data", ["__query","FileAttachment","invalidation"], _data);
  main.variable(observer()).define(["data"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["data"], _7);
  main.variable(observer()).define(["data"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("groupTempByYear")).define("groupTempByYear", ["d3","data"], _groupTempByYear);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("temperatureByMonth")).define("temperatureByMonth", ["groupTempByYear"], _temperatureByMonth);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("temperatureByMonthAfter2007")).define("temperatureByMonthAfter2007", ["groupTempByYear"], _temperatureByMonthAfter2007);
  main.variable(observer("dailyTempByMonth")).define("dailyTempByMonth", ["d3","data"], _dailyTempByMonth);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("dailyTempForPlot")).define("dailyTempForPlot", ["dailyTempByMonth"], _dailyTempForPlot);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("years")).define("years", ["temperatureByMonth"], _years);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("months")).define("months", _months);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("viewof select")).define("viewof select", ["Inputs"], _select);
  main.variable(observer("select")).define("select", ["Generators", "viewof select"], (G, _) => G.input(_));
  main.variable(observer()).define(["select"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("plot")).define("plot", ["Plot","d3","select","temperatureByMonth"], _plot);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("chart")).define("chart", ["dailyTempForPlot","select","d3","temperatureByMonthAfter2007"], _chart);
  return main;
}
