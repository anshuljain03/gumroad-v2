import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

// Register the necessary plugins
ChartJS.register(ArcElement, Tooltip);

const PieChart = ({ conversionRate }) => {
    const data = {
        labels: ['Sales', 'Just Visits'],
        datasets: [
            {
                data: [conversionRate, 100 - conversionRate],
                backgroundColor: [
                    'rgba(121, 120, 116, 1)', // Dark gray color
                    'rgba(121, 120, 116, 0.2)' // Lighter gray with transparency
                ],
                borderColor: [
                    'rgba(255,255,255,1)', // White border
                    'rgba(255,255,255,1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false // This will hide the legend
            }
        }
    };

    return <Pie data={data} options={options} />;
};

export default PieChart;
