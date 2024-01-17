import './GuessThePlayer.css';
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const GuessThePlayer = () => {

  const [data, setData] = useState([]);   // data is all the stats from the file
  const [season, setSeason] = useState("2023-24");   // season is the season the stats are from
  const [playerSelections, setPlayerSelections] = useState(null);   // playerSelections is the names of all players from that season

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

  return (
    <>
      <div className="title">
        <h1>Guess The NBA Player</h1>

        <input type="text" autocomplete="off" aria-autocomplete="list" aria-activedescendant="" aria-controls="autosuggest-autosuggest__results" placeholder="Guess 1 of 8" class=""></input>

        {playerSelections && (
          <select>
            {Array.from(playerSelections.options).map((option, index) => (
              <option key={index} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        )}
      </div>
    </>
  );
};
  
export default GuessThePlayer;

/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filterable Dropdown</title>
    <style>
        #myDropdown {
            display: none;
        }
    </style>
</head>
<body>

<label for="myTextEntry">Enter Text:</label>
<input type="text" id="myTextEntry" name="myTextEntry" oninput="filterOptions()">

<label for="myDropdown">Select Option:</label>
<select id="myDropdown" name="myDropdown"></select>

<script>
    const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Lemon', 'Orange', 'Peach', 'Strawberry'];

    function filterOptions() {
        const inputText = document.getElementById('myTextEntry').value.toLowerCase();
        const dropdown = document.getElementById('myDropdown');

        // Clear existing options
        dropdown.innerHTML = '';

        // Filter options based on the typed letter
        const filteredOptions = options.filter(option => option.toLowerCase().startsWith(inputText));

        // Populate dropdown with filtered options
        filteredOptions.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option.toLowerCase();
            newOption.textContent = option;
            dropdown.appendChild(newOption);
        });

        // Show/hide the dropdown based on whether there are matching options
        dropdown.style.display = filteredOptions.length > 0 ? 'block' : 'none';
    }
</script>

</body>
</html>

*/
