import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// To resolve __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML files from the public directory
app.use(express.static(path.join(_dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb+srv:', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const Users = mongoose.model('User', userSchema);

// Routes
// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.resolve('public/signup.html'));
});

// Serve preview page
app.get('/preview', (req, res) => {
    res.sendFile(path.resolve('public/preview.html'));
});

// Serve hotels page
app.get('/hotels', (req, res) => {
    res.sendFile(path.resolve('public/hotels.html'));
});

// Serve restaurants page
app.get('/restaurants', (req, res) => {
    res.sendFile(path.resolve('public/restaurants.html'));
});

// Serve rest page (redirect after login)
app.get('/rest', (req, res) => {
    res.sendFile(path.resolve('public/rest.html'));
});

// Serve tourism page
app.get('/tourism', (req, res) => {
    res.sendFile(path.resolve('public/tourism.html'));
});

// Handle Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email or username already exists. Please use different credentials.',
            });
        }

        const user = new Users({ username, email, password });
        await user.save();
        console.log('New user registered:', user);
        res.status(200).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
    }
});

// Handle Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        console.log('Login successful for user:', username);
        res.status(200).json({ message: 'Login successful!', username });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
    }
});

// Function to fetch tourist places
const fetchTourism = async (city) => {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) return [];

    const [latitude, longitude] = coordinates;
    const apiKey = '';
    const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction&conditions=named&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&lang=en&limit=10&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.features.map((place) => {
                const properties = place.properties;
                return {
                    name: properties.name || 'N/A',
                    address: properties.formatted || 'N/A',
                };
            });
        } else {
            console.error('API Error:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

// API endpoint to get tourism places
app.post('/get_tourist_attractions', async (req, res) => {
    const { city } = req.body;
    const tourism = await fetchTourism(city);
    res.json(tourism);
});

// Function to fetch hotels
const fetchHotels = async (city) => {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) return [];

    const [latitude, longitude] = coordinates;
    const apiKey = '';
    const url = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&conditions=named&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&lang=en&limit=10&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.features.map((place) => {
                const properties = place.properties;
                return {
                    name: properties.name || 'N/A',
                    address: properties.formatted || 'N/A',
                };
            });
        } else {
            console.error('API Error:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};
// Function to get city coordinates
const getCityCoordinates = (city) => {
    const cityCoordinates = {
        Vijayawada: ["16.506174", "80.648015"],
        Visakhapatnam: ["17.686816", "83.218482"],
        Tirupati: ["13.628755", "79.419179"],
        Guntur: ["16.306652", "80.436540"],
        Kurnool: ["15.828126", "78.037279"],
        Nellore: ["14.4421", "79.9985"],
        Kakinada: ["16.9513959", "82.23381494658508"],
        Rajamahendravaram: ["16.9975", "81.7785"],
        Kadapa: ["14.4701", "78.8243"],
        Anantapur: ["14.6825", "77.5994"],
        Ongole: ["15.5019", "80.0482"],
        Vizianagaram: ["18.1167", "83.4167"],
        Eluru: ["16.7000", "81.1300"],
        Machilipatnam: ["16.1833", "81.1333"],
        Tenali: ["16.2494", "80.5578"],
        Chittoor: ["13.2167", "79.4167"],
        Srikakulam: ["18.3000", "84.3000"],
        Bhimavaram: ["16.5333", "81.6333"],
        Tadepalligudem: ["16.8500", "81.3000"],
        Narasaraopet: ["16.0833", "80.2500"],
        Chilakaluripet: ["16.0333", "80.0333"],
        Vinukonda: ["15.7000", "79.2000"],
    };
    return cityCoordinates[city] || null; // Return null if the city is not found
};


// Function to fetch restaurants
const fetchRestaurants = async (city) => {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) return [];

    const [latitude, longitude] = coordinates;
    const apiKey = '';
    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant&conditions=named&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&lang=en&limit=10&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.features.map((place) => {
                const properties = place.properties;
                return {
                    name: properties.name || 'N/A',
                    address: properties.formatted || 'N/A',
                };
            });
        } else {
            console.error('API Error:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

// API endpoint to get hotels
app.post('/get_hotels', async (req, res) => {
    const { city } = req.body;
    const hotels = await fetchHotels(city);
    res.json(hotels);
});

// API endpoint to get restaurants
app.post('/get_restaurants', async (req, res) => {
    const { city } = req.body;
    const restaurants = await fetchRestaurants(city);
    res.json(restaurants);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
