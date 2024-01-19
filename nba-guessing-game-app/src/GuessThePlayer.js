import './GuessThePlayer.css';
import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

const GuessThePlayer = () => {

  const [data, setData] = useState([]);   // data is all the stats from the file
  const [season, setSeason] = useState("2023-24");   // season is the season the stats are from
  const [playerSelections, setPlayerSelections] = useState(null);   // playerSelections is the names of all players from that season
  const [filterText, setFilterText] = useState("");   // filterText is the string typed into the text entry box
  const [filterBy, setFilterBy] = useState("firstName");
  const headers = ["Player", "Tm", "Pos", "Age", "G", "MP", "PTS", "TRB", "AST", "STL", "BLK", "TOV", "FG", "FGA", "FGpct", "Threes", "ThreesA", "Threepct", "FT", "FTA", "FTpct"];
  const [numGuesses, setNumGuesses] = useState(1);
  const [randomPlayer, setRandomPlayer] = useState("");
  const randomPlayerRef = useRef();

  var gameOverModal = document.getElementById("gameOverModal");
  function openModal() {
    gameOverModal.style.display = "block";
  };
  function closeModal() {
    gameOverModal.style.display = "none";
    const guessingTextEntryBox = document.getElementById("guessingTextEntryBox");
    guessingTextEntryBox.disabled = true;
    guessingTextEntryBox.value = "Game Over";
  };
  window.onclick = function(event) {
    if (event.target === gameOverModal) {
      closeModal();
    };
  };

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

      const randomPlayerIndex = Math.floor(Math.random() * (parsedData.length - 1) + 1);
      setRandomPlayer(parsedData[randomPlayerIndex].Player);
      randomPlayerRef.current = parsedData[randomPlayerIndex].Player;
      console.log("randomPlayerIndex = " + randomPlayerIndex);
    };

    fetchData();

  }, [season]);

  useEffect(() => {
    console.log("randomPlayer = " + randomPlayer);
  }, [randomPlayer])

  if (playerSelections) {
    if (filterBy === "lastName") {
      filteredOptions = playerSelections ? Array.from(playerSelections.options).filter(
        (option) => option.text.split(" ")[1].replace(/\s/g, "").toLowerCase().startsWith(filterText.replace(/\s/g, "").toLowerCase())): [];
    } else {
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

    const cell = document.createElement("td");
    cell.textContent = numGuesses;
    newRow.appendChild(cell);
  
    headers.forEach((header) => {
      const cell = document.createElement("td");
      cell.textContent = selectedPlayer[header];
      newRow.appendChild(cell);
    });
  
    const tableBody = document.querySelector("#guessTable tbody");
    tableBody.appendChild(newRow);

    console.log("selectedPlayer.Player = " + selectedPlayer.Player);
    console.log("randomPlayer = " + randomPlayerRef.current);

    if (selectedPlayer.Player === randomPlayerRef.current) {
      document.getElementById("gameOverModalText").innerHTML = "Congratulations! You won in " + numGuesses + " guesses."; //modal pop up (correct!)
      openModal(); //gameOver("win");
      return; //maybe return
    }

    if (numGuesses > 0 && numGuesses < 8) {
      document.getElementById("guessTable").style.display = "block";
      setNumGuesses((previousNumGuesses) => previousNumGuesses + 1);
    } else if (numGuesses === 8) {
      openModal();
    };
  };

  return (
    <>
      <div className="title">
        <h1>Guess The NBA Player</h1>
      </div>

      <div className="body">
        <h1>{season} NBA Stats</h1>
        <p>Select a season to view stats from</p>

        {/*
        <select id="dropdown" value={season} onChange={e => setSeason(e.target.value)}>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </select>

        <button onClick={openModal}>Open Modal</button>
        */}

        <div id="gameOverModal">
          <div className="gameOverModalContent">
            <span className="closeModalButton" onClick={closeModal}>&times;</span>
            <p id="gameOverModalText">Modal Text</p>
          </div>
        </div>

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
          placeholder={"Remaining guesses: " + (8 - numGuesses + 1)}
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
          <>
            <table id="guessTable" style={{display: "none"}}>
              <thead id="guessTableHead">
                <tr>
                  <th className="generalStatsGuessing">Guess</th>
                  <th id="namesColumnGuessing">PLAYER NAME</th>
                  <th className="generalStatsGuessing">TEAM</th>
                  <th className="generalStatsGuessing">POS</th>
                  <th className="generalStatsGuessing">AGE</th>
                  <th className="generalStatsGuessing">GP</th>
                  <th className="generalStatsGuessing">MIN</th>
                  <th className="generalStatsGuessing">PTS</th>
                  <th className="generalStatsGuessing">REB</th>
                  <th className="generalStatsGuessing">AST</th>
                  <th className="generalStatsGuessing">STL</th>
                  <th className="generalStatsGuessing">BLK</th>
                  <th className="generalStatsGuessing">TOV</th>
                  <th className="generalStatsGuessing">FGM</th>
                  <th className="generalStatsGuessing">FGA</th>
                  <th className="generalStatsGuessing">FG%</th>
                  <th className="generalStatsGuessing">3PM</th>
                  <th className="generalStatsGuessing">3PA</th>
                  <th className="generalStatsGuessing">3P%</th>
                  <th className="generalStatsGuessing">FTM</th>
                  <th className="generalStatsGuessing">FTA</th>
                  <th className="generalStatsGuessing">FT%</th>
                </tr>
              </thead>
              <tbody id="guessTableBody"></tbody>
            </table>
          </>

          ) : null}

      </div>
    </>
  );
};
  
export default GuessThePlayer;
