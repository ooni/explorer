import React from 'react';
import axios from 'axios';

const APIButtons = () => {
  const handleSearch = (asns) => {
    axios.get('/api/search', {
      params: {
        asns: asns
      }
    })
      .then(response => {
        // handle response
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={() => handleSearch(['asn1', 'asn2'])}>Search</button>
    </div>
  );
};

export default APIButtons;