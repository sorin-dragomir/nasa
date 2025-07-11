import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './NeoCharts.css';

const NeoCharts = ({ neoData, asteroids }) => {
  // Process data for charts
  const dailyDetectionData = useMemo(() => {
    if (!neoData || !neoData.near_earth_objects) return [];
    
    return Object.keys(neoData.near_earth_objects).map(date => ({
      date: new Date(date).toLocaleDateString(),
      count: neoData.near_earth_objects[date].length,
      hazardous: neoData.near_earth_objects[date].filter(neo => neo.is_potentially_hazardous_asteroid).length
    }));
  }, [neoData]);

  const hazardousRatioData = useMemo(() => {
    if (!asteroids || asteroids.length === 0) return [];
    
    const hazardous = asteroids.filter(asteroid => asteroid.is_potentially_hazardous_asteroid).length;
    const nonHazardous = asteroids.length - hazardous;
    
    return [
      { name: 'Potentially Hazardous', value: hazardous, color: '#ff4444' },
      { name: 'Non-Hazardous', value: nonHazardous, color: '#00ff00' }
    ];
  }, [asteroids]);

  const scatterData = useMemo(() => {
    if (!asteroids || asteroids.length === 0) return [];
    
    return asteroids.map(asteroid => {
      const closeApproach = asteroid.close_approach_data[0];
      return {
        name: asteroid.name,
        speed: parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour || 0) / 1000, // Convert to km/s for better scale
        distance: parseFloat(closeApproach?.miss_distance?.kilometers || 0) / 1000000, // Convert to million km
        hazardous: asteroid.is_potentially_hazardous_asteroid,
        diameter: asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0
      };
    });
  }, [asteroids]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.name}</p>
          <p style={{ color: '#00ffff' }}>{`Speed: ${data.speed.toFixed(2)} km/s`}</p>
          <p style={{ color: '#ff9500' }}>{`Distance: ${data.distance.toFixed(2)} million km`}</p>
          <p style={{ color: '#9b59b6' }}>{`Diameter: ${(data.diameter * 1000).toFixed(0)} m`}</p>
          <p style={{ color: data.hazardous ? '#ff4444' : '#00ff00' }}>
            {data.hazardous ? 'Potentially Hazardous' : 'Safe'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!neoData || !asteroids || asteroids.length === 0) {
    return (
      <div className="neo-charts-container">
        <div className="charts-loading">
          <i className="material-icons">assessment</i>
          <p>No data available for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-charts-container">
      <div className="charts-header">
        <h2 className="charts-title">
          <i className="material-icons me-2">analytics</i>
          Near-Earth Object Analytics
        </h2>
        <p className="charts-description">
          Comprehensive visualization of NEO detection patterns, risk assessment, and orbital characteristics
        </p>
      </div>

      <div className="charts-grid">
        {/* Daily Detection Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">timeline</i>
              Daily NEO Detections
            </h3>
            <p>Number of Near-Earth Objects detected per day</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyDetectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#00ffff" 
                  strokeWidth={3}
                  dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
                  name="Total NEOs"
                />
                <Line 
                  type="monotone" 
                  dataKey="hazardous" 
                  stroke="#ff4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ff4444', strokeWidth: 2, r: 3 }}
                  name="Hazardous NEOs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Alternative */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">bar_chart</i>
              NEO Detection Distribution
            </h3>
            <p>Daily distribution with hazardous vs safe objects</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyDetectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#00ffff" name="Total NEOs" />
                <Bar dataKey="hazardous" fill="#ff4444" name="Hazardous NEOs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">pie_chart</i>
              Risk Assessment Ratio
            </h3>
            <p>Potentially hazardous vs non-hazardous objects</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hazardousRatioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hazardousRatioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="chart-card chart-card-wide">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">scatter_plot</i>
              Speed vs Distance Analysis
            </h3>
            <p>Relationship between object velocity and distance from Earth</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="distance" 
                  name="Distance (million km)"
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                  label={{ value: 'Distance (million km)', position: 'insideBottom', offset: -5, fill: '#00ffff' }}
                />
                <YAxis 
                  dataKey="speed" 
                  name="Speed (km/s)"
                  stroke="#00ffff"
                  tick={{ fill: '#00ffff', fontSize: 12 }}
                  label={{ value: 'Speed (km/s)', angle: -90, position: 'insideLeft', fill: '#00ffff' }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter 
                  name="Non-Hazardous" 
                  data={scatterData.filter(d => !d.hazardous)} 
                  fill="#00ff00"
                />
                <Scatter 
                  name="Potentially Hazardous" 
                  data={scatterData.filter(d => d.hazardous)} 
                  fill="#ff4444"
                />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeoCharts;
