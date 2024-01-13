import './App.css';

import { useState, useEffect } from "react";
import Papa from "papaparse";

function App() {

  const [data, setData] = useState([]);
  const [season, setSeason] = useState("2023-24");

  useEffect(() => {
    // Reading data from csv file
    const fetchData = async () => {
      const response = await fetch("./NBA_Stats_by_Season/" + season + ".csv");
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, [season]);

  return (
    <div className="App">
      
      <div class="header">
        <h1>{season} NBA Stats</h1>
        <p>Select a season to view stats from</p>

        <select id="dropdown" value={season} onChange={e => setSeason(e.target.value)}>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </select>
      </div>

      {data.length ? (
        <table className="table">
          <thead>
            <tr>
              <td>PLAYER NAME</td>
              <td>TEAM</td>
              <td>POS</td>
              <td>AGE</td>
              <td>GP</td>
              <td>MIN</td>
              <td>PTS</td>
              <td>REB</td>
              <td>AST</td>
              <td>STL</td>
              <td>BLK</td>
              <td>TOV</td>
              <td>FGM</td>
              <td>FGA</td>
              <td>FG%</td>
              <td>3PM</td>
              <td>3PA</td>
              <td>3P%</td>
              <td>FTM</td>
              <td>FTA</td>
              <td>FT%</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.Player}</td>
                <td>{row.Tm}</td>
                <td>{row.Pos}</td>
                <td>{row.Age}</td>
                <td>{row.G}</td>
                <td>{row.MP}</td>
                <td>{row.PTS}</td>
                <td>{row.TRB}</td>
                <td>{row.AST}</td>
                <td>{row.STL}</td>
                <td>{row.BLK}</td>
                <td>{row.TOV}</td>
                <td>{row.FG}</td>
                <td>{row.FGA}</td>
                <td>{row.FGpct}</td>
                <td>{row.Threes}</td>
                <td>{row.ThreesA}</td>
                <td>{row.Threepct}</td>
                <td>{row.FT}</td>
                <td>{row.FTA}</td>
                <td>{row.FTpct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

    </div>
  );
}

export default App;
