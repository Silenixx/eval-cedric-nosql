const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/restaurants', { useNewUrlParser: true, useUnifiedTopology: true });




const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({}, { strict: false }), 'new_york');


// Route pour récupérer tous les restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.send(restaurants);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Récupérer un restaurant par son name
app.get('/restaurants/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const restaurant = await Restaurant.findOne({ name: name });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du restaurant.' });
  }
});

// Insérer un nouveau restaurant
app.post('/restaurants', async (req, res) => {
  const newRestaurant = req.body;
  try {
    const restaurant = await Restaurant.create(newRestaurant);
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du restaurant.' });
  }
});

// Modifier un restaurant existant
app.put('/restaurants/:id', async (req, res) => {
  const id = req.params.id;
  const updatedRestaurant = req.body;
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(id, updatedRestaurant, { new: true });
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification du restaurant.' });
  }
});

// Supprimer un restaurant existant
app.delete('/restaurants/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du restaurant.' });
  }
});



app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
