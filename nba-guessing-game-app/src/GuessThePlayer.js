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
  //const headers = ["Player", "Tm", "Conf", "Div", "Pos", "Age", "Ht", "FGpct", "Threepct", "FTpct"];
    // I need Conf, Div, and Height
  // const headers = ["Player", "Pos", "Age", "FGpct", "Threepct", "FTpct"];

  const [numGuesses, setNumGuesses] = useState(1);
  const [randomPlayer, setRandomPlayer] = useState("");
  const randomPlayerRef = useRef();

  const [playerLastRows, setPlayerLastRows] = useState({});
  const [uniquePlayerNames, setUniquePlayerNames] = useState([]);

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
    (option) => option.text.replace(/\s/g, "").toLowerCase().includes(filterText.replace(/\s/g, "").toLowerCase())): [];

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

      const lastRows = parsedData.reduce((acc, row) => {
        acc[row.Player] = row;
        return acc;
      }, {});

      setPlayerLastRows(lastRows);
      const uniqueNames = Array.from(new Set(parsedData.map(row => row.Player)));
      setUniquePlayerNames(uniqueNames);

      const dropdown = document.createElement("select");
      const options = uniqueNames.map((name, index) => {
        const option = document.createElement("option");
        option.text = name;
        option.value = index;
        return option;
      });

      options.forEach((option) => dropdown.add(option));

      setPlayerSelections(dropdown);

      const randomPlayerIndex = Math.floor(Math.random() * (uniqueNames.length - 1) + 1);
      setRandomPlayer(uniqueNames[randomPlayerIndex]);
      randomPlayerRef.current = uniqueNames[randomPlayerIndex];
      console.log("randomPlayerIndex = " + randomPlayerIndex);
    };

    fetchData();

  }, [season]);

  useEffect(() => {
    console.log("randomPlayer = " + randomPlayer);
  }, [randomPlayer])

  filteredOptions = filteredOptions.slice(0, 10);

  if (playerSelections) {
    if (filteredOptions.length === 0 || filterText.length === 0) {
      document.getElementById("playerNames").style.display = "none";
    } else {
      document.getElementById("playerNames").style.display = "block";
    };
  }

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
    const selectedPlayerName = e.target.textContent;
    const selectedPlayerFirstOccurrence = data.find((player) => player.Player === selectedPlayerName);
    const selectedPlayerLastOccurrence = playerLastRows[selectedPlayerName];


    document.getElementById("guessingTextEntryBox").value = "";
    setFilterText("");
  
    const newRow = document.createElement("tr");

    const cell = document.createElement("td");
    cell.textContent = numGuesses;
    newRow.appendChild(cell);
  
    headers.forEach((header) => {
      const cell = document.createElement("td");

      if (header === "Tm") {
        cell.textContent = selectedPlayerLastOccurrence[header];
      } else {
        cell.textContent = selectedPlayerFirstOccurrence[header];
      }

      newRow.appendChild(cell);
    });
  
    const tableBody = document.querySelector("#guessTable tbody");
    tableBody.appendChild(newRow);

    console.log("selectedPlayer.Player = " + selectedPlayerFirstOccurrence.Player);
    console.log("randomPlayer = " + randomPlayerRef.current);

    if (selectedPlayerName === randomPlayerRef.current) {
      if (numGuesses === 1) {
        document.getElementById("gameOverModalText").innerHTML = "Congratulations! You won in " + numGuesses + " guess."; //modal pop up (correct!)
      } else {
        document.getElementById("gameOverModalText").innerHTML = "Congratulations! You won in " + numGuesses + " guesses."; //modal pop up (correct!)
      }
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

        <div id="gameOverModal">
          <div className="gameOverModalContent">
            <span className="closeModalButton" onClick={closeModal}>&times;</span>
            <p id="gameOverModalText">You Lost! The player was {randomPlayerRef.current}.</p>
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
