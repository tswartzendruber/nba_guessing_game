import './App.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("statsTable");
  switching = true;

  dir = "asc"; 
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir === "asc") {
        // Checking if column has number stats
        if (n > 2) {
          if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
            shouldSwitch= true;
            break;
          }
        // Checking if column has player names
        } else if (n === 0) {
          if (x.innerHTML.split(" ")[1] === y.innerHTML.split(" ")[1]) {
            if (x.innerHTML.split(" ")[0] > y.innerHTML.split(" ")[0]) {
              shouldSwitch= true;
              break;
            }
          } else {
            if (x.innerHTML.split(" ")[1] > y.innerHTML.split(" ")[1]) {
              shouldSwitch= true;
              break;
            }
          }
        // Checking if column has teams
        } else if (n === 1) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        // Checking if column has positions
        } else if (n === 2) {
          let newX = x.innerHTML.split("-");
          let newY = y.innerHTML.split("-");

          // Checking for a double position
          if (newX.length > 1) {
            if (newX[0] === "PG") {
              newX = "125";
            } else if (newX[0] === "SG") {
              if (newX[1] === "PG") {
                newX = "175";
              } else {
                newX = "225";
              }
            } else if (newX[0] === "SF") {
              if (newX[1] === "PG" || newX[1] === "SG") {
                newX = "275";
              } else {
                newX = "325";
              }
            } else if (newX[0] === "PF") {
              if (newX[1] === "C") {
                newX = "425";
              } else {
                newX = "375";
              }
            } else if (newX[0] === "C") {
              newX = "475";
            }
          // Otherwise, a single position
          } else {
            if (newX[0] === "PG") {
              newX = "100";
            } else if (newX[0] === "SG") {
              newX = "200";
            } else if (newX[0] === "SF") {
              newX = "300";
            } else if (newX[0] === "PF") {
              newX = "400";
            } else if (newX[0] === "C") {
              newX = "500";
            }
          }

          // Checking for a double position
          if (newY.length > 1) {
            if (newY[0] === "PG") {
              newY = "125";
            } else if (newY[0] === "SG") {
              if (newY[1] === "PG") {
                newY = "175";
              } else {
                newY = "225";
              }
            } else if (newY[0] === "SF") {
              if (newY[1] === "PG" || newY[1] === "SG") {
                newY = "275";
              } else {
                newY = "325";
              }
            } else if (newY[0] === "PF") {
              if (newY[1] === "C") {
                newY = "425";
              } else {
                newY = "375";
              }
            } else if (newY[0] === "C") {
              newY = "475";
            }
          // Otherwise, a single position
          } else {
            if (newY[0] === "PG") {
              newY = "100";
            } else if (newY[0] === "SG") {
              newY = "200";
            } else if (newY[0] === "SF") {
              newY = "300";
            } else if (newY[0] === "PF") {
              newY = "400";
            } else if (newY[0] === "C") {
              newY = "500";
            }
          }

          if (newX > newY) {
            shouldSwitch= true;
            break;
          }
        }
      } else if (dir === "desc") {
        // Checking if column has number stats
        if (n > 2) {
          if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
            shouldSwitch= true;
            break;
          }
        // Checking if column has player names
        } else if (n === 0) {
          if (x.innerHTML.split(" ")[1] === y.innerHTML.split(" ")[1]) {
            if (x.innerHTML.split(" ")[0] < y.innerHTML.split(" ")[0]) {
              shouldSwitch= true;
              break;
            }
          } else {
            if (x.innerHTML.split(" ")[1] < y.innerHTML.split(" ")[1]) {
              shouldSwitch= true;
              break;
            }
          }
        // Checking if column has teams
        } else if (n === 1) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        // Checking if column has positions
        } else if (n === 2) {
          let newX = x.innerHTML.split("-");
          let newY = y.innerHTML.split("-");

          // Checking for a double position
          if (newX.length > 1) {
            if (newX[0] === "PG") {
              newX = "125";
            } else if (newX[0] === "SG") {
              if (newX[1] === "PG") {
                newX = "175";
              } else {
                newX = "225";
              }
            } else if (newX[0] === "SF") {
              if (newX[1] === "PG" || newX[1] === "SG") {
                newX = "275";
              } else {
                newX = "325";
              }
            } else if (newX[0] === "PF") {
              if (newX[1] === "C") {
                newX = "425";
              } else {
                newX = "375";
              }
            } else if (newX[0] === "C") {
              newX = "475";
            }
          // Otherwise, a single position
          } else {
            if (newX[0] === "PG") {
              newX = "100";
            } else if (newX[0] === "SG") {
              newX = "200";
            } else if (newX[0] === "SF") {
              newX = "300";
            } else if (newX[0] === "PF") {
              newX = "400";
            } else if (newX[0] === "C") {
              newX = "500";
            }
          }

          // Checking for a double position
          if (newY.length > 1) {
            if (newY[0] === "PG") {
              newY = "125";
            } else if (newY[0] === "SG") {
              if (newY[1] === "PG") {
                newY = "175";
              } else {
                newY = "225";
              }
            } else if (newY[0] === "SF") {
              if (newY[1] === "PG" || newY[1] === "SG") {
                newY = "275";
              } else {
                newY = "325";
              }
            } else if (newY[0] === "PF") {
              if (newY[1] === "C") {
                newY = "425";
              } else {
                newY = "375";
              }
            } else if (newY[0] === "C") {
              newY = "475";
            }
          // Otherwise, a single position
          } else {
            if (newY[0] === "PG") {
              newY = "100";
            } else if (newY[0] === "SG") {
              newY = "200";
            } else if (newY[0] === "SF") {
              newY = "300";
            } else if (newY[0] === "PF") {
              newY = "400";
            } else if (newY[0] === "C") {
              newY = "500";
            }
          }

          if (newX < newY) {
            shouldSwitch= true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;      
    } else {
      if (switchcount === 0 && dir === "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function App() {

  const [data, setData] = useState([]);
  const [season, setSeason] = useState("2023-24");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);

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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <table id="statsTable">
          <thead>
            <tr>
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
            {currentRows.map((row, index) => (
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

        <div className="pagination">
        {[...Array(Math.ceil(data.length / rowsPerPage)).keys()].map(
          (pageNumber) => (
            <a
              key={pageNumber}
              href="#"
              onClick={() => paginate(pageNumber + 1)}
              className={
                pageNumber + 1 === currentPage ? "active" : undefined
              }
            >
              {pageNumber + 1}
            </a>
          )
        )}
        </div>
        </>

      ) : null}

    </div>
  );
}

export default App;
