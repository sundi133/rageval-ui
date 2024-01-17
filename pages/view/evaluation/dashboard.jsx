import React from 'react';
import '../../../app/globals.css';
import LineChart from './line-chart';

export function Dashboard(
  { number_of_evaluations, mean_score, distinct_users_simulated, evaluations, total_simulations }
  ) {
    const data = evaluations.map(evaluation => {
      const date = new Date(evaluation.last_updated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    
      return {
        date: date,
        averageScore: evaluation.average_score,
        simulationRunId: evaluation.simulation_run_id
        // Include other fields as needed
      };
    });
    
    
  if (data.length > 0) {
    data.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }

  const series = [{
    name: "Scores per Simulation Run",
    data: data.map(item => ({
      x: new Date(item.date).toLocaleString('en-US'),
      y: item.averageScore.toFixed(4),
      simulationRunId: item.simulationRunId
    }))
  }];


  if(!data) {
    return <div>Loading...</div>
  }
  return (
    <div className="container">
      <h1 className="text-3xl font-bold px-8">Evaluation Dashboard</h1>
      <div className="flex flex-wrap mt-8 gap-2 px-8">
        <div className="card bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-xl shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <div className="flex items-center justify-between">
            <span className="text-sm">Total QA / Simulation</span>      
          </div>
          <h2 className="text-2xl font-bold mt-2">{number_of_evaluations}</h2>
        </div>
        <div className="card bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-xl shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <div className="flex items-center justify-between">
            <span className="text-sm">Mean Score</span>      
          </div>
          <h2 className="text-2xl font-bold mt-2">{mean_score}</h2>
        </div>
        <div className="card bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-xl shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Simulations</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">{total_simulations}</h2>
        </div>
      </div>

      <div className="chart-container mt-8">

        <div style={{ width: '100%' }}>
          <LineChart
            data_series={series}
            title="Scores per Simulation Run"
          />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
