const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); 

const API_KEY = 'put-a-new-api-here'; // Bro put your API here


app.get('/api/places', async (req, res) => {
  const { query, location, radius } = req.query;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query,
          location,
          radius,
          key: API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Error fetching places' });
  }
});

// Root for places that is all
app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id,
          fields: 'name,formatted_address,formatted_phone_number,website',
          key: API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'Error fetching place details' });
  }
});

// Server run on 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
