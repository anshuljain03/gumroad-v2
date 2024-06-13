import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { BACKEND_URL } from '../config';

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = () => {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [history, setHistory] = useState({
        lastSevenDays: 0,
        lastMonth: 0,
        total: 0
    });
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/purchases/stats`, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setHistory({
                        lastSevenDays: data.lastSevenDays,
                        lastMonth: data.lastMonth,
                        total: data.total
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch summary stats.');
                }
            } catch (error) {
                setShowError(true);
                setErrorMessage(error.message || 'An error occurred while fetching summary stats.');
            }
        };

        const fetchDailyData = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/purchases/history`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (res.ok && data) {
                    prepareChartData(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch daily purchases.');
                }
            } catch (error) {
                setShowError(true);
                setErrorMessage(error.message || 'An error occurred while fetching daily purchases.');
            }
        };

        fetchStats();
        fetchDailyData();
    }, []);

    const prepareChartData = (data) => {
        const labels = data.map((item) => item.date);
        const dataSet = data.map(item => item.count);

        const chartData = {
            labels,
            datasets: [{
                label: 'Daily Purchases',
                data: dataSet,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            }]
        };

        setChartData(chartData);
    };

    return (
        <Layout title="Gumroad" useFeedbackHeader={false}>
            <div id="dashboard">
                {showError ? (
                    <p className="error">{errorMessage}</p>
                ) : (
                    <>
                        <h3>Purchase History</h3>
                        <div className="chart-container">
                        {chartData && chartData.labels ? (
                            <Line data={chartData} options={{ scales: { x: { type: 'category' } } }}  />
                        ) : (
                            <p>Loading chart...</p>
                        )}
                        </div>
                        <div className="mini-rule"></div>
                        <div id="history">
                            <p><strong>${history.lastSevenDays}</strong> in the past 7 days.</p>
                            <p><strong>${history.lastMonth}</strong> in the past month.</p>
                            <p><strong>${history.total}</strong> in total.</p>
                        </div>
                    </>
                )}
                <div className="rainbow bar"></div>
            </div>
        </Layout>
    );
};

export default HomePage;
