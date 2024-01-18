import './GuessThePlayer.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const GuessThePlayer = () => {

  const [data, setData] = useState([]);   // data is all the stats from the file
  const [season, setSeason] = useState("2023-24");   // season is the season the stats are from
  const [playerSelections, setPlayerSelections] = useState(null);   // playerSelections is the names of all players from that season
  const [filterText, setFilterText] = useState("");   // filterText is the string typed into the text entry box
  const [filterBy, setFilterBy] = useState("firstName");

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
          type="text" 
          autoComplete="off" 
          aria-autocomplete="list" 
          aria-activedescendant="" 
          aria-controls="autosuggest-autosuggest__results" 
          placeholder="Guess 1 of 8"
          onChange={(e) => setFilterText(e.target.value)}
        />

        <br></br>

        {playerSelections ? (
          <select className="guessingTextEntry" id="playerNames">
            {filteredOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        ) : <select className="guessingTextEntry" id="playerNames"></select>}

      </div>
    </>
  );
};
  
export default GuessThePlayer;
