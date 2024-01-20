import './GuessThePlayer.css';
import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

const GuessThePlayer = () => {

  const [data, setData] = useState([]);   // data is all the stats from the file
  const [season, setSeason] = useState("2023-24");   // season is the season the stats are from
  const [playerSelections, setPlayerSelections] = useState(null);   // playerSelections is the names of all players from that season
  const [filterText, setFilterText] = useState("");   // filterText is the string typed into the text entry box
  const [filterBy, setFilterBy] = useState("firstName");
  // const headers = ["Player", "Tm", "Pos", "Age", "G", "MP", "PTS", "TRB", "AST", "STL", "BLK", "TOV", "FG", "FGA", "FGpct", "Threes", "ThreesA", "Threepct", "FT", "FTA", "FTpct"];
  //const headers = ["Player", "Tm", "Conf", "Div", "Pos", "Age", "Ht", "FGpct", "Threepct", "FTpct"];
    // I need Conf, Div, and Height
  // const headers = ["Player", "Pos", "Age", "FGpct", "Threepct", "FTpct"];
  const headers = ["Player", "Tm", "Conf", "Div", "Pos", "Age", "PTS", "TRB", "AST", "Threes"];

  const [numGuesses, setNumGuesses] = useState(1);
  const [randomPlayer, setRandomPlayer] = useState("");
  const randomPlayerRef = useRef();

  const [playerLastRows, setPlayerLastRows] = useState({});
  const [uniquePlayerNames, setUniquePlayerNames] = useState([]);
  const statsOfRandomPlayer = useRef();
  const randomPlayerCurrentTeam = useRef();

  const randomPlayerConf = useRef();
  const randomPlayerDivision = useRef();

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
      const randomlyGeneratedPlayer = uniqueNames[randomPlayerIndex];
      setRandomPlayer(randomlyGeneratedPlayer);
      randomPlayerRef.current = randomlyGeneratedPlayer;

      console.log("randomPlayerIndex = " + randomPlayerIndex);

      statsOfRandomPlayer.current = parsedData.find(player => player.Player === randomlyGeneratedPlayer);
      console.log("Stats of randomly generated player: ", statsOfRandomPlayer);

      randomPlayerCurrentTeam.current = lastRows[randomlyGeneratedPlayer].Tm;
      var randomPlayerTeam = lastRows[randomlyGeneratedPlayer].Tm;
      
      if (randomPlayerTeam === "BOS" || randomPlayerTeam === "BRK" || randomPlayerTeam === "NYK" || randomPlayerTeam === "PHI" || randomPlayerTeam === "TOR") {
        randomPlayerDivision.current = "Atlantic";
        randomPlayerConf.current = "East";
      } else if (randomPlayerTeam === "CLE" || randomPlayerTeam === "CHI" || randomPlayerTeam === "DET" || randomPlayerTeam === "IND" || randomPlayerTeam === "MIL") {
        randomPlayerDivision.current = "Central";
        randomPlayerConf.current = "East";
      } else if (randomPlayerTeam === "ATL" || randomPlayerTeam === "CHO" || randomPlayerTeam === "MIA" || randomPlayerTeam === "ORL" || randomPlayerTeam === "WAS") {
        randomPlayerDivision.current = "Southeast";
        randomPlayerConf.current = "East";
      } else if (randomPlayerTeam === "DEN" || randomPlayerTeam === "MIN" || randomPlayerTeam === "POR" || randomPlayerTeam === "OKC" || randomPlayerTeam === "UTA") {
        randomPlayerDivision.current = "Northwest";
        randomPlayerConf.current = "West";
      } else if (randomPlayerTeam === "GSW" || randomPlayerTeam === "LAC" || randomPlayerTeam === "LAL" || randomPlayerTeam === "PHO" || randomPlayerTeam === "SAC") {
        randomPlayerDivision.current = "Pacific";
        randomPlayerConf.current = "West";
      } else if (randomPlayerTeam === "DAL" || randomPlayerTeam === "HOU" || randomPlayerTeam === "MEM" || randomPlayerTeam === "NOP" || randomPlayerTeam === "SAS") {
        randomPlayerDivision.current = "Southwest";
        randomPlayerConf.current = "West";
      };
      
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

    var team;
  
    headers.forEach((header) => {
      const cell = document.createElement("td");

      if (header === "Tm") {
        cell.textContent = selectedPlayerLastOccurrence[header];
        console.log("DEBUG: selectedPlayerLastOccurrence[header]: " + selectedPlayerLastOccurrence[header]);
        console.log("DEBUG: randomPlayerCurrentTeam.current: " + randomPlayerCurrentTeam.current);
        if (selectedPlayerLastOccurrence.Tm === randomPlayerCurrentTeam.current) {
          cell.classList.add("highlightGreen");
        };
        newRow.appendChild(cell);
      
      } else if (header === "Conf") {
        team = selectedPlayerLastOccurrence["Tm"];
        if (team === "BOS" || team === "BRK" || team === "NYK" || team === "PHI" || team === "TOR" || 
            team === "CLE" || team === "CHI" || team === "DET" || team === "IND" || team === "MIL" || 
            team === "ATL" || team === "CHO" || team === "MIA" || team === "ORL" || team === "WAS") {
              cell.textContent = "East";
        } else {
          cell.textContent = "West";
        };
        if (randomPlayerConf.current === cell.textContent) {
          cell.classList.add("highlightGreen");
        };
        newRow.appendChild(cell);

      } else if (header === "Div") {
        team = selectedPlayerLastOccurrence["Tm"];
        if (team === "BOS" || team === "BRK" || team === "NYK" || team === "PHI" || team === "TOR") {
          cell.textContent = "Atlantic";
        } else if (team === "CLE" || team === "CHI" || team === "DET" || team === "IND" || team === "MIL") {
          cell.textContent = "Central";
        } else if (team === "ATL" || team === "CHO" || team === "MIA" || team === "ORL" || team === "WAS") {
          cell.textContent = "Southeast";
        } else if (team === "DEN" || team === "MIN" || team === "POR" || team === "OKC" || team === "UTA") {
          cell.textContent = "Northwest";
        } else if (team === "GSW" || team === "LAC" || team === "LAL" || team === "PHO" || team === "SAC") {
          cell.textContent = "Pacific";
        } else if (team === "DAL" || team === "HOU" || team === "MEM" || team === "NOP" || team === "SAS") {
          cell.textContent = "Southwest";
        };
        if (randomPlayerDivision.current === cell.textContent) {
          cell.classList.add("highlightGreen");
        };
        newRow.appendChild(cell);

      } else if (header === "Pos") {
        cell.textContent = selectedPlayerFirstOccurrence[header];
        if (selectedPlayerFirstOccurrence.Pos === statsOfRandomPlayer.current.Pos) {
          cell.classList.add("highlightGreen");
        };
        newRow.appendChild(cell);
        
      } else if (header === "Age") {
        var selectedPlayerAge = parseFloat(selectedPlayerFirstOccurrence.Age);
        var randomPlayerAge = parseFloat(statsOfRandomPlayer.current.Age);
        if (selectedPlayerAge === randomPlayerAge) {
          cell.textContent = selectedPlayerAge;
          cell.classList.add("highlightGreen");
        } else if (Math.abs(selectedPlayerAge - randomPlayerAge) <= 2) {
          cell.classList.add("highlightYellow");
        };
        if (selectedPlayerAge < randomPlayerAge) {
          cell.textContent = (selectedPlayerAge + " ↑");
        } else if (selectedPlayerAge > randomPlayerAge) {
          cell.textContent = (selectedPlayerAge + " ↓");
        };
        newRow.appendChild(cell);

      } else if (header === "PTS") {
        var selectedPlayerPTS = parseFloat(selectedPlayerFirstOccurrence.PTS);
        var randomPlayerPTS = parseFloat(statsOfRandomPlayer.current.PTS);
        if (selectedPlayerPTS === randomPlayerPTS) {
          cell.textContent = selectedPlayerPTS;
          cell.classList.add("highlightGreen");
        } else if (Math.abs(selectedPlayerPTS - randomPlayerPTS) <= 2) {
          cell.classList.add("highlightYellow");
        };
        if (selectedPlayerPTS < randomPlayerPTS) {
          cell.textContent = (selectedPlayerPTS + " ↑");
        } else if (selectedPlayerPTS > randomPlayerPTS){
          cell.textContent = (selectedPlayerPTS + " ↓");
        };
        newRow.appendChild(cell);

      } else if (header === "TRB") {
        var selectedPlayerREB = parseFloat(selectedPlayerFirstOccurrence.TRB);
        var randomPlayerREB = parseFloat(statsOfRandomPlayer.current.TRB);
        if (selectedPlayerREB === randomPlayerREB) {
          cell.textContent = selectedPlayerREB;
          cell.classList.add("highlightGreen");
        } else if (Math.abs(selectedPlayerREB - randomPlayerREB) <= 2) {
          cell.classList.add("highlightYellow");
        };
        if (selectedPlayerREB < randomPlayerREB) {
          cell.textContent = (selectedPlayerREB + " ↑");
        } else if (selectedPlayerREB > randomPlayerREB){
          cell.textContent = (selectedPlayerREB + " ↓");
        };
        newRow.appendChild(cell);

      } else if (header === "AST") {
        var selectedPlayerAST = parseFloat(selectedPlayerFirstOccurrence.AST);
        var randomPlayerAST = parseFloat(statsOfRandomPlayer.current.AST);
        if (selectedPlayerAST === randomPlayerAST) {
          cell.textContent = selectedPlayerAST;
          cell.classList.add("highlightGreen");
        } else if (Math.abs(selectedPlayerAST - randomPlayerAST) <= 2) {
          cell.classList.add("highlightYellow");
        };
        if (selectedPlayerAST < randomPlayerAST) {
          cell.textContent = (selectedPlayerAST + " ↑");
        } else if (selectedPlayerAST > randomPlayerAST){
          cell.textContent = (selectedPlayerAST + " ↓");
        };
        newRow.appendChild(cell);

      } else if (header === "Threes") {
        var selectedPlayer3PM = parseFloat(selectedPlayerFirstOccurrence.Threes);
        var randomPlayer3PM = parseFloat(statsOfRandomPlayer.current.Threes);
        if (selectedPlayer3PM === randomPlayer3PM) {
          cell.textContent = selectedPlayer3PM;
          cell.classList.add("highlightGreen");
        } else if (Math.abs(selectedPlayer3PM - randomPlayer3PM) <= 2) {
          cell.classList.add("highlightYellow");
        };
        if (selectedPlayer3PM < randomPlayer3PM) {
          cell.textContent = (selectedPlayer3PM + " ↑");
        } else if (selectedPlayer3PM > randomPlayer3PM){
          cell.textContent = (selectedPlayer3PM + " ↓");
        };
        newRow.appendChild(cell);

      } else {
        cell.textContent = selectedPlayerFirstOccurrence[header];
        newRow.appendChild(cell);
      };

    });
  
    const tableBody = document.querySelector("#guessTable tbody");
    tableBody.appendChild(newRow);

    //console.log("selectedPlayer.Player = " + selectedPlayerFirstOccurrence.Player);
    //console.log("selectedPlayer stats = ", selectedPlayerFirstOccurrence);
    //console.log("randomPlayer = " + randomPlayerRef.current);
    //console.log("statsOfRandomPlayer.current.Player = " + statsOfRandomPlayer.current.Player);

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

        {/* 
        <div id="switchDiv">
          <label id="switchLabel">Sorting by First Name</label>
          <label className="sortingSwitch">
            <input onClick={toggleFilterMethod} type="checkbox"></input>
            <span className="slider"></span>
          </label>
        </div>
        */}

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
                  <th className="generalStatsGuessing">CONF</th>
                  <th className="generalStatsGuessing">DIV</th>
                  <th className="generalStatsGuessing">POS</th>
                  <th className="generalStatsGuessing">AGE</th>
                  <th className="generalStatsGuessing">PTS</th>
                  <th className="generalStatsGuessing">REB</th>
                  <th className="generalStatsGuessing">AST</th>
                  <th className="generalStatsGuessing">3PM</th>
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
