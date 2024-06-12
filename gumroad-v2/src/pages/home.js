import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const HomePage = () => {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [history, setHistory] = useState({
        lastSevenDays: 0,
        lastMonth: 0,
        total: 0
    });
    const [chartData, setChartData] = useState({
        numbers: [],
        max: 0,
        showChart: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/purchases/stats', 
                    { 
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Could not find purchase history.');
                }

                const data = await res.json();
                setHistory({
                    lastSevenDays: data.lastSevenDays,
                    lastMonth: data.lastMonth,
                    total: data.total
                });

                if (data.chartNumbers.length > 0) {
                    setChartData({
                        numbers: data.chartNumbers,
                        max: Math.ceil(Math.max(...data.chartNumbers) * 1.2),
                        showChart: true
                    });
                }
            } catch (error) {
                setShowError(true);
                setErrorMessage(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout title="Gumroad" useFeedbackHeader={false}>
            <div id="dashboard">
                {showError ? (
                    <h3 className="error">{errorMessage}</h3>
                ) : (
                    <h3>Last {chartData.numbers.length} days</h3>
                )}
                
                <div className="chart">
                    {chartData.showChart ? (
                        <img src={`http://chart.apis.google.com/chart?chxr=0,0,${chartData.max}&chf=bg,s,ffffff&chxt=y&chbh=a&chs=640x225&chco=CC333F,EB6841&cht=bvg&chds=0,${chartData.max}&chd=t:${chartData.numbers.join(',')}`} width="640" height="225" alt="Sales Chart" />
                    ) : (
                        <p>Wait a few days and a chart will show up here!</p>
                    )}
                </div>
                
                <div className="mini-rule"></div>

                <div id="history">
                    <h4>History:</h4>
                    <p><strong>${history.lastSevenDays}</strong> in the past 7 days.</p>
                    <p><strong>${history.lastMonth}</strong> in the past month.</p>
                    <p><strong>${history.total}</strong> in total.</p>
                </div>

                <div className="rainbow bar" id="loading-bar"></div>
            </div>

            <p id="below-form-p">&nbsp;</p>
        </Layout>
    );
};

export default HomePage;
