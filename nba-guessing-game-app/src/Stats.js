import './App.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const Stats = () => {

  const [data, setData] = useState([]);
  const [season, setSeason] = useState("2023-24");
  const [loading, setLoading] = useState(true);

  const [sortedColumn, setSortedColumn] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    };
    fetchData();
  }, [season]);

  function sortTable(n) {
    setSortedColumn(n);
    highlightColumn(n);

    function highlightColumn(columnIndex) {
      const table = document.getElementById("statsTable");
      const tbody = table.tBodies[0];
      const rows = Array.from(tbody.getElementsByTagName("tr"));
      const clickedColumn = document.getElementById(`statsTableHead`).getElementsByTagName("th")[columnIndex];
    
      const headerCells = document.getElementById("statsTableHead").getElementsByTagName("th");
      for (const headerCell of headerCells) {
        headerCell.style.backgroundColor = "white";
      }
    
      for (const row of rows) {
        const cells = Array.from(row.getElementsByTagName("td"));
        for (const cell of cells) {
          cell.style.backgroundColor = "white";
        }
    
        const selectedCell = cells[columnIndex];
        selectedCell.style.backgroundColor = "rgb(243, 234, 56)";
      }
    
      clickedColumn.style.backgroundColor = "rgb(243, 234, 56)";
    }

    //var table, rows, switching, i, shouldSwitch, dir, switchcount = 0;
    var table, rows, switching, i, dir;
    table = document.getElementById("statsTable");
    switching = true;

    if (sortedColumn !== n) {
      dir = "desc"; // Set initial sorting direction to "desc" if the column is not already sorted
    } else {
      dir = table.getAttribute("data-sort-dir") === "desc" ? "asc" : "desc";
    }
    table.setAttribute("data-sort-dir", dir);
  
    rows = Array.from(table.rows).slice(1);
  
    while (switching) {
      switching = false;
      for (i = 0; i < rows.length - 1; i++) {
        //shouldSwitch = false;
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
          //shouldSwitch = true;
          const temp = rows[i];
          rows[i] = rows[i + 1];
          rows[i + 1] = temp;
          switching = true;
          //switchcount++;
        }
      }
    };
  
    if (dir === "asc") {
      document.getElementById(`statsColumnArrow${n}`).innerHTML = "↑";
      document.getElementById(`statsColumnArrow${n}`).style.display = "block";
    } else if (dir ==="desc") {
      document.getElementById(`statsColumnArrow${n}`).innerHTML = "↓";
      document.getElementById(`statsColumnArrow${n}`).style.display = "block";
    };
  
    for (let i = 0; i < 21; i++) {
      if (i !== n) {
        document.getElementById(`statsColumnArrow${i}`).style.display = "none";
      };
    };


    const tbody = table.tBodies[0];
    tbody.innerHTML = "";
    for (const row of rows) {
      tbody.appendChild(row);
    }
  };

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

      {loading ? (
        <p>Loading...</p>) 
      : data.length ? (
        <>
        <div className="scroll">
        <table id="statsTable">
          <thead>
            <tr id="statsTableHead">
              <th id="namesColumn" onClick={() => sortTable(0)}>PLAYER NAME <p className="statsColumnArrow" id="statsColumnArrow0" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(1)}>TEAM <p className="statsColumnArrow" id="statsColumnArrow1" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(2)}>POS <p className="statsColumnArrow" id="statsColumnArrow2" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(3)}>AGE <p className="statsColumnArrow" id="statsColumnArrow3" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(4)}>GP <p className="statsColumnArrow" id="statsColumnArrow4" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(5)}>MIN <p className="statsColumnArrow" id="statsColumnArrow5" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(6)}>PTS <p className="statsColumnArrow" id="statsColumnArrow6" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(7)}>REB <p className="statsColumnArrow" id="statsColumnArrow7" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(8)}>AST <p className="statsColumnArrow" id="statsColumnArrow8" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(9)}>STL <p className="statsColumnArrow" id="statsColumnArrow9" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(10)}>BLK <p className="statsColumnArrow" id="statsColumnArrow10" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(11)}>TOV <p className="statsColumnArrow" id="statsColumnArrow11" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(12)}>FGM <p className="statsColumnArrow" id="statsColumnArrow12" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(13)}>FGA <p className="statsColumnArrow" id="statsColumnArrow13" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(14)}>FG% <p className="statsColumnArrow" id="statsColumnArrow14" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(15)}>3PM <p className="statsColumnArrow" id="statsColumnArrow15" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(16)}>3PA <p className="statsColumnArrow" id="statsColumnArrow16" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(17)}>3P% <p className="statsColumnArrow" id="statsColumnArrow17" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(18)}>FTM <p className="statsColumnArrow" id="statsColumnArrow18" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(19)}>FTA <p className="statsColumnArrow" id="statsColumnArrow19" style={{display: "none"}}></p></th>
              <th className="generalStats" onClick={() => sortTable(20)}>FT% <p className="statsColumnArrow" id="statsColumnArrow20" style={{display: "none"}}></p></th>
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
