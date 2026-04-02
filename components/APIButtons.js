import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APIButtons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://explorer.ooni.org/search?test_name=web_connectivity&failure=true&since=2022-08-01&until=2022-08-02&domain=${searchTerm}`);
      const ipResponse = await axios.get(`https://explorer.ooni.org/search?test_name=web_connectivity&failure=true&since=2022-08-01&until=2022-08-02&ip=${searchTerm}`);
      const results = [...response.data, ...ipResponse.data];
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {searchResults.map((result) => (
        <div key={result.id}>{result.domain || result.ip}</div>
      ))}
    </div>
  );
};

export default APIButtons;