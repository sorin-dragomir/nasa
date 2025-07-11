import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import './NeoChartsChartJS.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const NeoChartsChartJS = ({ neoData, asteroids }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#00ffff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#00ffff',
        borderWidth: 1,
        titleColor: '#00ffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#00ffff',
          font: {
            size: 11
          }
        },
        grid: {
          color: '#333333'
        }
      },
      y: {
        ticks: {
          color: '#00ffff',
          font: {
            size: 11
          }
        },
        grid: {
          color: '#333333'
        }
      }
    }
  };

  // Line Chart Data
  const lineChartData = useMemo(() => {
    if (!neoData || !neoData.near_earth_objects) return { labels: [], datasets: [] };
    
    const dates = Object.keys(neoData.near_earth_objects);
    const counts = dates.map(date => neoData.near_earth_objects[date].length);
    const hazardousCounts = dates.map(date => 
      neoData.near_earth_objects[date].filter(neo => neo.is_potentially_hazardous_asteroid).length
    );

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Total NEOs',
          data: counts,
          borderColor: '#00ffff',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#00ffff',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          tension: 0.3
        },
        {
          label: 'Hazardous NEOs',
          data: hazardousCounts,
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255, 68, 68, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#ff4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.3
        }
      ]
    };
  }, [neoData]);

  // Bar Chart Data
  const barChartData = useMemo(() => {
    if (!neoData || !neoData.near_earth_objects) return { labels: [], datasets: [] };
    
    const dates = Object.keys(neoData.near_earth_objects);
    const counts = dates.map(date => neoData.near_earth_objects[date].length);
    const hazardousCounts = dates.map(date => 
      neoData.near_earth_objects[date].filter(neo => neo.is_potentially_hazardous_asteroid).length
    );

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Total NEOs',
          data: counts,
          backgroundColor: '#00ffff',
          borderColor: '#00ffff',
          borderWidth: 1,
        },
        {
          label: 'Hazardous NEOs',
          data: hazardousCounts,
          backgroundColor: '#ff4444',
          borderColor: '#ff4444',
          borderWidth: 1,
        }
      ]
    };
  }, [neoData]);

  // Pie Chart Data
  const pieChartData = useMemo(() => {
    if (!asteroids || asteroids.length === 0) return { labels: [], datasets: [] };
    
    const hazardous = asteroids.filter(asteroid => asteroid.is_potentially_hazardous_asteroid).length;
    const nonHazardous = asteroids.length - hazardous;
    
    return {
      labels: ['Potentially Hazardous', 'Non-Hazardous'],
      datasets: [
        {
          data: [hazardous, nonHazardous],
          backgroundColor: ['#ff4444', '#00ff00'],
          borderColor: ['#ff6666', '#22ff22'],
          borderWidth: 2,
          hoverOffset: 4
        }
      ]
    };
  }, [asteroids]);

  // Scatter Chart Data
  const scatterChartData = useMemo(() => {
    if (!asteroids || asteroids.length === 0) return { datasets: [] };
    
    const hazardousData = [];
    const nonHazardousData = [];
    
    asteroids.forEach(asteroid => {
      const closeApproach = asteroid.close_approach_data[0];
      const point = {
        x: parseFloat(closeApproach?.miss_distance?.kilometers || 0) / 1000000, // Million km
        y: parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour || 0) / 1000, // km/s
        label: asteroid.name
      };
      
      if (asteroid.is_potentially_hazardous_asteroid) {
        hazardousData.push(point);
      } else {
        nonHazardousData.push(point);
      }
    });

    return {
      datasets: [
        {
          label: 'Non-Hazardous',
          data: nonHazardousData,
          backgroundColor: '#00ff00',
          borderColor: '#22ff22',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Potentially Hazardous',
          data: hazardousData,
          backgroundColor: '#ff4444',
          borderColor: '#ff6666',
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  }, [asteroids]);

  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: 'Distance (Million km)',
          color: '#00ffff',
          font: {
            size: 14
          }
        }
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          display: true,
          text: 'Speed (km/s)',
          color: '#00ffff',
          font: {
            size: 14
          }
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          title: function(context) {
            return context[0].raw.label || 'Unknown Object';
          },
          label: function(context) {
            return [
              `Speed: ${context.parsed.y.toFixed(2)} km/s`,
              `Distance: ${context.parsed.x.toFixed(2)} million km`
            ];
          }
        }
      }
    }
  };

  if (!neoData || !asteroids || asteroids.length === 0) {
    return (
      <div className="neo-charts-chartjs-container">
        <div className="charts-loading">
          <i className="material-icons">assessment</i>
          <p>No data available for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-charts-chartjs-container">
      <div className="charts-header">
        <h2 className="charts-title">
          <i className="material-icons me-2">analytics</i>
          NEO Analytics (Chart.js)
        </h2>
        <p className="charts-description">
          Alternative visualization using Chart.js library
        </p>
      </div>

      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">timeline</i>
              Daily Detection Trend
            </h3>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">bar_chart</i>
              Detection Distribution
            </h3>
          </div>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">pie_chart</i>
              Risk Assessment
            </h3>
          </div>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="chart-card chart-card-wide">
          <div className="chart-header">
            <h3>
              <i className="material-icons me-2">scatter_plot</i>
              Speed vs Distance
            </h3>
          </div>
          <div className="chart-container">
            <Scatter data={scatterChartData} options={scatterOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeoChartsChartJS;
