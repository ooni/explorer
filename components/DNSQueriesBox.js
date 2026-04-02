import React from 'react';
import { getASNumberAndName } from '../utils';

const DNSQueriesBox = ({ dnsQueries, resolverIP }) => {
  const [asNumber, asName] = getASNumberAndName(resolverIP);

  return (
    <div>
      <h2>DNS Queries</h2>
      <p>Resolver IP: {resolverIP}</p>
      <p>AS Number: {asNumber}</p>
      <p>AS Name: {asName}</p>
      {dnsQueries.map((query, index) => (
        <div key={index}>{query}</div>
      ))}
    </div>
  );
};

export default DNSQueriesBox;