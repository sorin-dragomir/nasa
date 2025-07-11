import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import './NeoChartsD3.css';

const NeoChartsD3 = ({ neoData, asteroids }) => {
  const lineChartRef = useRef();
  const scatterChartRef = useRef();

  const processedData = useMemo(() => {
    if (!neoData || !neoData.near_earth_objects) return { lineData: [], scatterData: [] };
    
    const lineData = Object.keys(neoData.near_earth_objects).map(date => ({
      date: new Date(date),
      total: neoData.near_earth_objects[date].length,
      hazardous: neoData.near_earth_objects[date].filter(neo => neo.is_potentially_hazardous_asteroid).length
    }));

    const scatterData = asteroids.map(asteroid => {
      const closeApproach = asteroid.close_approach_data[0];
      return {
        name: asteroid.name,
        speed: parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour || 0) / 1000,
        distance: parseFloat(closeApproach?.miss_distance?.kilometers || 0) / 1000000,
        hazardous: asteroid.is_potentially_hazardous_asteroid,
        diameter: asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0
      };
    });

    return { lineData, scatterData };
  }, [neoData, asteroids]);

  useEffect(() => {
    if (processedData.lineData.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.bottom - margin.top;

    // Clear previous chart
    d3.select(lineChartRef.current).selectAll("*").remove();

    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData.lineData, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData.lineData, d => d.total)])
      .range([height, 0]);

    // Line generators
    const totalLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.total))
      .curve(d3.curveMonotoneX);

    const hazardousLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.hazardous))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
      .selectAll("text")
      .style("fill", "#00ffff");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#00ffff");

    // Add grid
    g.selectAll(".grid")
      .data([null])
      .enter().append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#333")
      .style("stroke-dasharray", "3,3");

    g.selectAll(".grid-y")
      .data([null])
      .enter().append("g")
      .attr("class", "grid-y")
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#333")
      .style("stroke-dasharray", "3,3");

    // Add lines
    g.append("path")
      .datum(processedData.lineData)
      .attr("fill", "none")
      .attr("stroke", "#00ffff")
      .attr("stroke-width", 3)
      .attr("d", totalLine);

    g.append("path")
      .datum(processedData.lineData)
      .attr("fill", "none")
      .attr("stroke", "#ff4444")
      .attr("stroke-width", 2)
      .attr("d", hazardousLine);

    // Add dots
    g.selectAll(".dot-total")
      .data(processedData.lineData)
      .enter().append("circle")
      .attr("class", "dot-total")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.total))
      .attr("r", 4)
      .style("fill", "#00ffff")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2);

    g.selectAll(".dot-hazardous")
      .data(processedData.lineData)
      .enter().append("circle")
      .attr("class", "dot-hazardous")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.hazardous))
      .attr("r", 3)
      .style("fill", "#ff4444")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2);

  }, [processedData.lineData]);

  useEffect(() => {
    if (processedData.scatterData.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    // Clear previous chart
    d3.select(scatterChartRef.current).selectAll("*").remove();

    const svg = d3.select(scatterChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(processedData.scatterData, d => d.distance))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(processedData.scatterData, d => d.speed))
      .range([height, 0]);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", "#00ffff");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#00ffff");

    // Add axis labels
    g.append("text")
      .attr("transform", `translate(${width / 2},${height + 40})`)
      .style("text-anchor", "middle")
      .style("fill", "#00ffff")
      .text("Distance (Million km)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#00ffff")
      .text("Speed (km/s)");

    // Add grid
    g.selectAll(".grid")
      .data([null])
      .enter().append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#333")
      .style("stroke-dasharray", "3,3");

    g.selectAll(".grid-y")
      .data([null])
      .enter().append("g")
      .attr("class", "grid-y")
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#333")
      .style("stroke-dasharray", "3,3");

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0);

    // Add dots
    g.selectAll(".dot")
      .data(processedData.scatterData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.distance))
      .attr("cy", d => yScale(d.speed))
      .attr("r", 6)
      .style("fill", d => d.hazardous ? "#ff4444" : "#00ff00")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("opacity", 0.8)
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          Speed: ${d.speed.toFixed(2)} km/s<br/>
          Distance: ${d.distance.toFixed(2)} million km<br/>
          ${d.hazardous ? 'Potentially Hazardous' : 'Safe'}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    return () => {
      d3.selectAll(".d3-tooltip").remove();
    };

  }, [processedData.scatterData]);

  if (!neoData || !asteroids || asteroids.length === 0) {
    return (
      <div className="neo-charts-d3-container">
        <div className="charts-loading">
          <i className="material-icons">assessment</i>
          <p>No data available for D3 visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-charts-d3-container">
      <div className="charts-header">
        <h2 className="charts-title">
          <i className="material-icons me-2">analytics</i>
          NEO Analytics (D3.js)
        </h2>
        <p className="charts-description">
          Custom visualization using D3.js library for advanced interactivity
        </p>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">timeline</i>
              Daily Detection Timeline
            </h3>
          </div>
          <div className="chart-container" ref={lineChartRef}></div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">scatter_plot</i>
              Interactive Scatter Plot
            </h3>
          </div>
          <div className="chart-container" ref={scatterChartRef}></div>
        </div>
      </div>
    </div>
  );
};

export default NeoChartsD3;
