import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const SearchListing = () => {
  const [asns, setAsns] = useState([]);
  const [selectedAsns, setSelectedAsns] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get('/api/asns')
      .then(response => {
        setAsns(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    axios.get('/api/search', {
      params: {
        asns: selectedAsns.map(asn => asn.value)
      }
    })
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleAsnChange = (selectedOptions) => {
    setSelectedAsns(selectedOptions);
  };

  return (
    <div>
      <Select
        isMulti
        value={selectedAsns}
        onChange={handleAsnChange}
        options={asns.map(asn => ({ value: asn, label: asn }))}
        placeholder="Select ASNs"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchListing;