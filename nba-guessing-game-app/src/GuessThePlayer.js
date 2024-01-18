import './GuessThePlayer.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const GuessThePlayer = () => {

  const [data, setData] = useState([]);   // data is all the stats from the file
  const [season, setSeason] = useState("2023-24");   // season is the season the stats are from
  const [playerSelections, setPlayerSelections] = useState(null);   // playerSelections is the names of all players from that season
  const [filterText, setFilterText] = useState("");   // filterText is the string typed into the text entry box
  const [filterBy, setFilterBy] = useState("firstName");
  const headers = ["Player", "Tm", "Pos", "Age", "G", "MP", "PTS", "TRB", "AST", "STL", "BLK", "TOV", "FG", "FGA", "FGpct", "Threes", "ThreesA", "Threepct", "FT", "FTA", "FTpct"];
  const [numGuesses, setNumGuesses] = useState(1);

  var filteredOptions = playerSelections ? Array.from(playerSelections.options).filter(
    (option) => option.text.replace(/\s/g, "").toLowerCase().startsWith(filterText.replace(/\s/g, "").toLowerCase())): [];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`./NBA_Stats_by_Season/${season}.csv`);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parsedData);

      const dropdown = document.createElement("select");
      const options = parsedData.map((row, index) => {
        const option = document.createElement("option");
        option.text = row.Player;
        option.value = index;
        return option;
      });

      options.forEach((option) => dropdown.add(option));

      setPlayerSelections(dropdown);
    };

    fetchData();

  }, [season]);

  if (playerSelections) {
    console.log("filterBy = " + filterBy);
    if (filterBy === "lastName") {
      console.log("I got into the if, meaning that filterBy === 'lastName' ");
      filteredOptions = playerSelections ? Array.from(playerSelections.options).filter(
        (option) => option.text.split(" ")[1].replace(/\s/g, "").toLowerCase().startsWith(filterText.replace(/\s/g, "").toLowerCase())): [];
    } else {
      console.log("I got into the else, meaning that filterBy === 'firstName' ");
      filteredOptions = playerSelections ? Array.from(playerSelections.options).filter(
        (option) => option.text.replace(/\s/g, "").toLowerCase().startsWith(filterText.replace(/\s/g, "").toLowerCase())): [];
    };

    filteredOptions = filteredOptions.slice(0, 6);

    if (filteredOptions.length === 0 || filterText.length === 0) {
      document.getElementById("playerNames").style.display = "none";
    } else {
      document.getElementById("playerNames").style.display = "block";
    };
  };

  const toggleFilterMethod = () => {
    if (filterBy === "firstName") {
      setFilterBy("lastName");
      document.getElementById("switchLabel").innerHTML = "Sorting by Last Name";
    } else {
      setFilterBy("firstName");
      document.getElementById("switchLabel").innerHTML = "Sorting by First Name";
    }
  };
  
  const selectPlayer = (e) => {
    const selectedPlayerIndex = e.target.value;
    const selectedPlayer = data[selectedPlayerIndex];

    document.getElementById("guessingTextEntryBox").value = "";
    setFilterText("");
  
    const newRow = document.createElement("tr");
  
    headers.forEach((header) => {
      const cell = document.createElement("td");
      cell.textContent = selectedPlayer[header];
      newRow.appendChild(cell);
    });
  
    const tableBody = document.querySelector("#statsTable tbody");
    tableBody.appendChild(newRow);

    if (numGuesses === 1) {
      document.getElementById("statsTable").style.display = "block";
    }

    setNumGuesses((previousNumGuesses) => previousNumGuesses + 1);
  };

  return (
    <>
      <div className="title">
        <h1>Guess The NBA Player</h1>
      </div>

      <div className="body">
        <h1>{season} NBA Stats</h1>
        <p>Select a season to view stats from</p>

        <select id="dropdown" value={season} onChange={e => setSeason(e.target.value)}>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </select>

        <div id="switchDiv">
          <label id="switchLabel">Sorting by First Name</label>
          <label className="sortingSwitch">
            <input onClick={toggleFilterMethod} type="checkbox"></input>
            <span className="slider"></span>
          </label>
        </div>

        <p></p>

        <input 
          className="guessingTextEntry"
          id="guessingTextEntryBox"
          type="text" 
          autoComplete="off" 
          aria-autocomplete="list" 
          aria-activedescendant="" 
          aria-controls="autosuggest-autosuggest__results" 
          placeholder={"Guess " + numGuesses + " of 8"}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <br></br>

        {playerSelections ? (
          <ul id="playerNames">
            {filteredOptions.map((option, index) => (
              <li key={index} value={option.value} id="playerName" onClick={selectPlayer}>
                {option.text}
              </li>
            ))}
          </ul>
        ) : <ul className="guessingTextEntry" id="playerNames"></ul>}

        {data.length ? (
          <div id="statsTableDiv">
            <table id="statsTable" style={{display: "none"}}>
              <thead>
                <tr>
                  <th id="namesColumn">PLAYER NAME</th>
                  <th className="generalStats">TEAM</th>
                  <th className="generalStats">POS</th>
                  <th className="generalStats">AGE</th>
                  <th className="generalStats">GP</th>
                  <th className="generalStats">MIN</th>
                  <th className="generalStats">PTS</th>
                  <th className="generalStats">REB</th>
                  <th className="generalStats">AST</th>
                  <th className="generalStats">STL</th>
                  <th className="generalStats">BLK</th>
                  <th className="generalStats">TOV</th>
                  <th className="generalStats">FGM</th>
                  <th className="generalStats">FGA</th>
                  <th className="generalStats">FG%</th>
                  <th className="generalStats">3PM</th>
                  <th className="generalStats">3PA</th>
                  <th className="generalStats">3P%</th>
                  <th className="generalStats">FTM</th>
                  <th className="generalStats">FTA</th>
                  <th className="generalStats">FT%</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          ) : null}

      </div>
    </>
  );
};
  
export default GuessThePlayer;
