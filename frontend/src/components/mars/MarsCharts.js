import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import './MarsCharts.css';

const MarsCharts = ({ photos, roverData, selectedRover }) => {
  const [timelineRange, setTimelineRange] = useState([0, 100]);

  // Debug logging
  console.log('MarsCharts received:', { 
    photosCount: photos?.length || 0, 
    roverData: roverData?.name,
    selectedRover 
  });

  // Process data for timeline slider chart
  const timelineData = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    
    // Group photos by sol and camera
    const solGroups = photos.reduce((acc, photo) => {
      const sol = photo.sol;
      if (!acc[sol]) {
        acc[sol] = {
          sol: sol,
          earth_date: photo.earth_date,
          total: 0,
          cameras: {}
        };
      }
      acc[sol].total++;
      
      const camera = photo.camera.name;
      if (!acc[sol].cameras[camera]) {
        acc[sol].cameras[camera] = 0;
      }
      acc[sol].cameras[camera]++;
      
      return acc;
    }, {});

    // Convert to array and sort by sol
    const sortedData = Object.values(solGroups).sort((a, b) => a.sol - b.sol);
    
    // Add individual camera counts as separate fields
    return sortedData.map(item => {
      const result = {
        sol: item.sol,
        earth_date: item.earth_date,
        total: item.total
      };
      
      // Add each camera as a separate field
      Object.keys(item.cameras).forEach(camera => {
        result[camera] = item.cameras[camera];
      });
      
      return result;
    });
  }, [photos]);

  // Process data for camera usage bar chart
  const cameraUsageData = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    
    const cameraStats = photos.reduce((acc, photo) => {
      const camera = photo.camera.name;
      const fullName = photo.camera.full_name;
      
      if (!acc[camera]) {
        acc[camera] = {
          camera: camera,
          fullName: fullName,
          count: 0,
          rover: photo.rover.name
        };
      }
      acc[camera].count++;
      
      return acc;
    }, {});

    return Object.values(cameraStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 cameras
  }, [photos]);

  // Get unique cameras for timeline visualization
  const uniqueCameras = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    const cameras = [...new Set(photos.map(p => p.camera.name))];
    return cameras.slice(0, 6); // Limit to 6 cameras for readability
  }, [photos]);

  // Camera colors for consistency
  const cameraColors = {
    'fhaz': '#ff6b6b',
    'rhaz': '#4ecdc4',
    'mast': '#45b7d1',
    'navcam': '#96ceb4',
    'chemcam': '#ffeaa7',
    'mahli': '#dda0dd',
    'mardi': '#98d8c8',
    'pancam': '#f39c12',
    'minites': '#9b59b6',
    'mcz_left': '#e17055',
    'mcz_right': '#00b894',
    'front_hazcam_left_a': '#e84393',
    'front_hazcam_right_a': '#fd79a8',
    'rear_hazcam_left': '#fdcb6e',
    'rear_hazcam_right': '#e84393'
  };

  // Filter timeline data based on slider range
  const filteredTimelineData = useMemo(() => {
    if (timelineData.length === 0) return [];
    
    const startIndex = Math.floor((timelineRange[0] / 100) * timelineData.length);
    const endIndex = Math.ceil((timelineRange[1] / 100) * timelineData.length);
    
    return timelineData.slice(startIndex, endIndex);
  }, [timelineData, timelineRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Sol ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} photos`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CameraTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.fullName}</p>
          <p style={{ color: payload[0].color }}>
            {`${data.count} photos taken`}
          </p>
          <p style={{ color: '#999' }}>
            {`Camera: ${label}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="mars-charts-container">
        <div className="charts-loading">
          <i className="material-icons">terrain</i>
          <p>No photo data available for visualization</p>
          <p style={{color: '#ff6b35', fontSize: '14px'}}>
            Debug: photos={photos ? photos.length : 'null'}, roverData={roverData ? roverData.name : 'null'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mars-charts-container">
      {/* Debug Panel */}
      <div style={{
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#333',
        border: '1px solid #ff6b35',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '12px'
      }}>
        <strong>Debug Info:</strong> Photos: {photos.length}, Rover: {roverData?.name || 'None'}, Selected: {selectedRover}
        <br />
        Timeline Data: {timelineData.length} points, Camera Data: {cameraUsageData.length} cameras
      </div>
      
      <div className="charts-header">
        <h2 className="charts-title">
          <i className="material-icons me-2">analytics</i>
          Mars Rover Photo Analytics
        </h2>
        <p className="charts-description">
          Analyze photo patterns from {selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1)} rover
        </p>
      </div>

      <div className="charts-grid">
        {/* Timeline Slider Chart */}
        <div className="chart-card chart-card-wide">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">timeline</i>
              Photo Timeline by Sol (Martian Day)
            </h3>
            <p>Photos taken per sol by different cameras - Use slider to explore timeline</p>
          </div>
          
          {/* Timeline Range Slider */}
          <div className="timeline-controls">
            <label htmlFor="timeline-range">Timeline Range:</label>
            <input
              id="timeline-range"
              type="range"
              min="0"
              max="100"
              value={timelineRange[1]}
              onChange={(e) => setTimelineRange([timelineRange[0], parseInt(e.target.value)])}
              className="timeline-slider"
            />
            <div className="range-info">
              <span>Sol {filteredTimelineData[0]?.sol || 0}</span>
              <span>to</span>
              <span>Sol {filteredTimelineData[filteredTimelineData.length - 1]?.sol || 0}</span>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={filteredTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="sol" 
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 12 }}
                  label={{ value: 'Sol (Martian Day)', position: 'insideBottom', offset: -5, fill: '#ff6b35' }}
                />
                <YAxis 
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 12 }}
                  label={{ value: 'Photos Taken', angle: -90, position: 'insideLeft', fill: '#ff6b35' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#ff6b35"
                  fill="rgba(255, 107, 53, 0.3)"
                  strokeWidth={3}
                  name="Total Photos"
                />
                
                {uniqueCameras.slice(0, 3).map((camera, index) => (
                  <Line
                    key={camera}
                    type="monotone"
                    dataKey={camera}
                    stroke={cameraColors[camera] || `hsl(${index * 60}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={camera.toUpperCase()}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camera Usage Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">camera_alt</i>
              Most Used Cameras
            </h3>
            <p>Camera usage statistics for {selectedRover} rover</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={cameraUsageData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  type="number"
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 11 }}
                />
                <YAxis 
                  type="category"
                  dataKey="camera"
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 10 }}
                  width={90}
                />
                <Tooltip content={<CameraTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#ff6b35"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camera Distribution Pie Chart Alternative */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">pie_chart</i>
              Camera Activity Overview
            </h3>
            <p>Detailed breakdown of photos by camera type</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cameraUsageData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="camera"
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 10, angle: -45 }}
                  height={80}
                />
                <YAxis 
                  stroke="#ff6b35"
                  tick={{ fill: '#ff6b35', fontSize: 12 }}
                />
                <Tooltip content={<CameraTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#ff6b35"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarsCharts;
