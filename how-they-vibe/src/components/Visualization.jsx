import Plot from 'react-plotly.js';
import WordCloud from 'react-d3-cloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


const ParallelCoordinatesChart = ({ agentData }) => {
  const dimensions = Object.entries(agentData.personality).map(([trait, value]) => ({
    range: [-1, 1],
    label: trait,
    values: [value],
  }));

  return (
    <Plot
      data={[{
        type: 'parcoords',
        line: { color: 'blue' },
        dimensions,
      }]}
      layout={{
        margin: { l: 40, r: 40, t: 20, b: 20 },
        width: 700,
        height: 300,
      }}
    />
  );
};



// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentPieChart = ({ sentimentScores }) => {
  const chartRef = useRef(null); // Ref for the chart

  useEffect(() => {
    const chartInstance = chartRef.current;

    // Clean up the chart on component unmount or when data changes
    return () => {
      if (chartInstance && chartInstance.chart) {
        chartInstance.chart.destroy();
      }
    };
  }, [sentimentScores]); // Trigger cleanup when sentimentScores changes

  const data = {
    labels: Object.keys(sentimentScores),
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: Object.values(sentimentScores),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie ref={chartRef} data={data} />;
};

const WordCloudComponent = ({ data }) => {
  const wordCloudData = data.wordCloudData;

  // Add a check to ensure wordCloudData exists and is an array with length > 0
  if (!wordCloudData || wordCloudData.length === 0) {
    return <p>No word cloud data available.</p>;
  }

  return (
    <div>
      {/* Pass the wordCloudData to the WordCloud visualization component */}
      <WordCloud words={wordCloudData} />
    </div>
  );
};

const AgentAnalytics = ({ data }) => {
  const sentimentSummary = {
    Positive: 3,
    Negative: 4,
    Neutral: 4,
  }; // Replace with real sentiment classifier later

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Personality Parallel Coordinates</h2>
        <ParallelCoordinatesChart agentData={data} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Sentiment Pie Chart</h2>
        <SentimentPieChart sentimentScores={sentimentSummary} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">Comment Word Cloud</h2>
        
        {/* Pass the actual 'data' to WordCloudComponent */}
       
      </div>
    </div>
  );
};

export default AgentAnalytics;
