import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import CSS datoteke

function App() {
  const [query, setQuery] = useState('restaurant');
  const [location, setLocation] = useState('51.5074,-0.1278'); // Koordinate Londona
  const [radius, setRadius] = useState(5000); // Radijus pretrage u metrima
  const [leads, setLeads] = useState([]);

  // Funkcija za pretragu mjesta koristeći naš backend
  const searchPlaces = async () => {
    console.log("Search button clicked");  // Dodaj ovo
    try {
      const response = await axios.get('http://localhost:5000/api/places', {
        params: {
          query,
          location,
          radius,
        },
      });

      console.log(response.data);  // Da provjeriš odgovore
      const placeResults = response.data.results;

      const leadDetailsPromises = placeResults.map(async (place) => {
        const placeDetailsResponse = await axios.get('http://localhost:5000/api/place-details', {
          params: {
            place_id: place.place_id,
          },
        });

        return {
          name: placeDetailsResponse.data.result.name,
          address: placeDetailsResponse.data.result.formatted_address,
          phone: placeDetailsResponse.data.result.formatted_phone_number || 'N/A',
          website: placeDetailsResponse.data.result.website || 'N/A',
        };
      });

      const leads = await Promise.all(leadDetailsPromises);
      setLeads(leads);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  return (
    <div className="App">
      <h1>Google Places Lead Finder</h1>

      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query (e.g., restaurant)"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (latitude,longitude)"
        />
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius in meters"
        />
        <button onClick={searchPlaces}>Search</button>
      </div>

      {leads.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {leads.map((lead, index) => (
              <li key={index}>
                <h3>{lead.name}</h3>
                <p>Address: {lead.address}</p>
                <p>Phone: {lead.phone}</p>
                <p>Website: {lead.website}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
