import './App.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

function sortTable(n) {
  var table, rows, switching, i, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("statsTable");
  switching = true;

  // Get the current sorting direction from the table's data attribute
  dir = table.getAttribute("data-sort-dir") === "asc" ? "desc" : "asc";
  table.setAttribute("data-sort-dir", dir);

  rows = Array.from(table.rows).slice(1); // Exclude the header row

  while (switching) {
    switching = false;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      const x = rows[i].getElementsByTagName("TD")[n].innerHTML;
      const y = rows[i + 1].getElementsByTagName("TD")[n].innerHTML;

      let compareResult;
      if (n > 2) {
        compareResult = parseFloat(x) - parseFloat(y);
      } else if (n === 0) {
        const xName = x.split(" ");
        const yName = y.split(" ");
        compareResult = xName[1] === yName[1] ? xName[0].localeCompare(yName[0]) : xName[1].localeCompare(yName[1]);
      } else if (n === 1) {
        compareResult = x.toLowerCase().localeCompare(y.toLowerCase());
      } else if (n === 2) {
        const getPositionValue = position => {
          const positionsMap = { 
            "PG": 100, "PG-SG": 110, "PG-SF": 120, "PG-PF": 130, "PG-C": 140,
            "SG": 200, "SG-PG": 175, "SG-SF": 210, "SG-PF": 220, "SG-C": 230,
            "SF": 300, "SF-PG": 260, "SF-SG": 270, "SF-PF": 310, "SF-C": 320,
            "PF": 400, "PF-PG": 330, "PF-SG": 340, "PF-SF": 350, "PF-C": 410,
            "C": 500, "C-PG": 420, "C-SG": 430, "C-SF": 440, "C-PF": 450,
          };
          return positionsMap[position];
        };

        compareResult = getPositionValue(x) - getPositionValue(y);
      }

      if ((dir === "asc" && compareResult > 0) || (dir === "desc" && compareResult < 0)) {
        shouldSwitch = true;
        const temp = rows[i];
        rows[i] = rows[i + 1];
        rows[i + 1] = temp;
        switching = true;
        switchcount++;
      }
    }
  }

  // Update the table with the sorted rows
  const tbody = table.tBodies[0];
  tbody.innerHTML = "";
  for (const row of rows) {
    tbody.appendChild(row);
  }
}

const Stats = () => {

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

      const uniquePlayers = Array.from(new Set(parsedData.map(row => row.Player)));

      const lastTeam = {};

      parsedData.forEach(row => {
        lastTeam[row.Player] = row.Tm;
      });

      const uniqueData = uniquePlayers.map(playerName => {
        return {
          ...parsedData.find(row => row.Player === playerName), Tm: lastTeam[playerName]
        };
      });
      
      setData(uniqueData);
    };
    fetchData();
  }, [season]);

  return (
    <div className="App">
      
      <div className="header">
        <h1>{season} NBA Stats</h1>
        <p>Select a season to view stats from</p>

        <select id="dropdown" value={season} onChange={e => setSeason(e.target.value)}>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </select>
      </div>

      {data.length ? (
        <>
        <div className="scroll">
        <table id="statsTable">
          <thead>
            <tr id="statsTableHead">
              <th id="namesColumn" onClick={() => sortTable(0)}>PLAYER NAME</th>
              <th className="generalStats" onClick={() => sortTable(1)}>TEAM</th>
              <th className="generalStats" onClick={() => sortTable(2)}>POS</th>
              <th className="generalStats" onClick={() => sortTable(3)}>AGE</th>
              <th className="generalStats" onClick={() => sortTable(4)}>GP</th>
              <th className="generalStats" onClick={() => sortTable(5)}>MIN</th>
              <th className="generalStats" onClick={() => sortTable(6)}>PTS</th>
              <th className="generalStats" onClick={() => sortTable(7)}>REB</th>
              <th className="generalStats" onClick={() => sortTable(8)}>AST</th>
              <th className="generalStats" onClick={() => sortTable(9)}>STL</th>
              <th className="generalStats" onClick={() => sortTable(10)}>BLK</th>
              <th className="generalStats" onClick={() => sortTable(11)}>TOV</th>
              <th className="generalStats" onClick={() => sortTable(12)}>FGM</th>
              <th className="generalStats" onClick={() => sortTable(13)}>FGA</th>
              <th className="generalStats" onClick={() => sortTable(14)}>FG%</th>
              <th className="generalStats" onClick={() => sortTable(15)}>3PM</th>
              <th className="generalStats" onClick={() => sortTable(16)}>3PA</th>
              <th className="generalStats" onClick={() => sortTable(17)}>3P%</th>
              <th className="generalStats" onClick={() => sortTable(18)}>FTM</th>
              <th className="generalStats" onClick={() => sortTable(19)}>FTA</th>
              <th className="generalStats" onClick={() => sortTable(20)}>FT%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <>
              <tr key={index}>
                <td className="statsTableData">{row.Player}</td>
                <td className="statsTableData">{row.Tm}</td>
                <td className="statsTableData">{row.Pos}</td>
                <td className="statsTableData">{row.Age}</td>
                <td className="statsTableData">{row.G}</td>
                <td className="statsTableData">{row.MP}</td>
                <td className="statsTableData">{row.PTS}</td>
                <td className="statsTableData">{row.TRB}</td>
                <td className="statsTableData">{row.AST}</td>
                <td className="statsTableData">{row.STL}</td>
                <td className="statsTableData">{row.BLK}</td>
                <td className="statsTableData">{row.TOV}</td>
                <td className="statsTableData">{row.FG}</td>
                <td className="statsTableData">{row.FGA}</td>
                <td className="statsTableData">{row.FGpct}</td>
                <td className="statsTableData">{row.Threes}</td>
                <td className="statsTableData">{row.ThreesA}</td>
                <td className="statsTableData">{row.Threepct}</td>
                <td className="statsTableData">{row.FT}</td>
                <td className="statsTableData">{row.FTA}</td>
                <td className="statsTableData">{row.FTpct}</td>
              </tr>
              </>
            ))}
          </tbody>
        </table>
        </div>

        </>

      ) : null}

    </div>
  );
}
  
export default Stats;
