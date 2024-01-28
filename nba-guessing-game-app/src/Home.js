import './App.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";

const Home = () => {

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
    <div className="Stats">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Hello World</h1>
      </motion.div>
    </div>
  );
}
  
export default Home;
