import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3001;

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

// To resolve __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve static HTML files from the public directory
app.use(express.static(path.join(_dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
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
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Serve preview page
app.get('/preview', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

// Serve hotels page
app.get('/hotels', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hotels.html'));
});

// Serve restaurants page
app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rest.html'));
});

// Serve rest page (redirect after login)
app.get('/rest', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rest.html'));
});

// Serve tourism page
app.get('/tourism', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tourism.html'));
});

app.get('/conclusion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'conclusion.html'));
});

// Handle Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const existing = await Users.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existing) {
            return res.status(400).json({
                error: 'Email or username already exists'
            });
        }

        const user = new Users({
            username,
            email,
            password
        });

        await user.save();

        res.status(200).json({
            message: 'Registration successful!'
        });

    } catch (err) {
        console.error('Registration error:', err);

        res.status(500).json({
            error: 'An error occurred during registration'
        });
    }
});

// Handle Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({
                error: 'Invalid username or password'
            });
        }

        res.status(200).json({
            message: 'Login successful!',
            username
        });

    } catch (err) {
        console.error('Login error:', err);

        res.status(500).json({
            error: 'An error occurred during login'
        });
    }
});

/* =========================================================
   VERIFIED / CURATED TOURIST ATTRACTIONS
   ========================================================= */

const verifiedAttractions = {

    Vijayawada: [
        {
            name: 'Kanaka Durga Temple',
            address: 'Indrakeeladri, Vijayawada',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Prakasam Barrage',
            address: 'Krishna River, Vijayawada',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Undavalli Caves',
            address: 'Undavalli, Vijayawada',
            price: 25,
            feeSource: 'Verified estimate'
        },
        {
            name: 'Bhavani Island',
            address: 'Vijayawada',
            price: 20,
            feeSource: 'Verified estimate'
        },
        {
            name: 'Gandhi Hill',
            address: 'Vijayawada',
            price: 20,
            feeSource: 'Verified estimate'
        },
        {
            name: 'Kondapalli Fort',
            address: 'Kondapalli, Vijayawada',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Mogalarajapuram Caves',
            address: 'Vijayawada',
            price: 5,
            feeSource: 'Verified estimate'
        }
    ],

    Visakhapatnam: [
        {
            name: 'Kailasagiri',
            address: 'Visakhapatnam',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'RK Beach',
            address: 'Visakhapatnam',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'INS Kursura Submarine Museum',
            address: 'RK Beach Road, Visakhapatnam',
            price: 100,
            feeSource: 'Verified estimate'
        },
        {
            name: 'Simhachalam Temple',
            address: 'Simhachalam, Visakhapatnam',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Rushikonda Beach',
            address: 'Visakhapatnam',
            price: 0,
            feeSource: 'Free'
        }
    ],

    Bhimavaram: [
        {
            name: 'Someswara Temple',
            address: 'Bhimavaram',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Mavullamma Temple',
            address: 'Bhimavaram',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Perupalem Beach',
            address: 'Perupalem, West Godavari',
            price: 0,
            feeSource: 'Free'
        }
    ],

    Rajamundry: [
        {
            name: 'Godavari Bridge',
            address: 'Rajahmundry',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Kambala Park',
            address: 'Rajahmundry',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Pushkar Ghat',
            address: 'Rajahmundry',
            price: 0,
            feeSource: 'Free'
        }
    ],

    Palakollu: [
        {
            name: 'Ksheerarama Temple',
            address: 'Palakollu',
            price: 0,
            feeSource: 'Free'
        },
        {
            name: 'Perupalem Beach',
            address: 'Perupalem',
            price: 0,
            feeSource: 'Free'
        }
    ],

    Tirupati: [
        {
            name: 'Tirumala Venkateswara Temple',
            address: 'Tirumala, Tirupati',
            price: 0,
            feeSource: 'Free'
        }
    ]
};

/* =========================================================
   CITY COORDINATES
   ========================================================= */

const cityCoordinates = {
    Anantapur: [14.6819, 77.6006],
    Bhimavaram: [16.5449, 81.5212],
    Chilakaluripet: [16.0892, 80.1670],
    Chittoor: [13.2172, 79.1003],
    Eluru: [16.7107, 81.0952],
    Guntur: [16.3067, 80.4365],
    Kadapa: [14.4674, 78.8241],
    Kakinada: [16.9891, 82.2475],
    Kurnool: [15.8281, 78.0373],
    Machilipatnam: [16.1875, 81.1389],
    Narasaraopet: [16.2350, 80.0498],
    Nellore: [14.4426, 79.9865],
    Ongole: [15.5057, 80.0499],
    Palakollu: [16.5167, 81.7300],
    Rajamundry: [16.9891, 81.2293],
    Srikakulam: [18.2969, 83.8973],
    Tadepalligudem: [16.8147, 81.5275],
    Tenali: [16.2428, 80.6400],
    Tirupati: [13.6288, 79.4192],
    Vijayawada: [16.5062, 80.6480],
    Vinukonda: [16.0531, 79.7396],
    Visakhapatnam: [17.6868, 83.2185],
    Vizianagaram: [18.1067, 83.3956]
};

function getCityCoordinates(city) {
    return cityCoordinates[city] || null;
}

/* =========================================================
   GEOAPIFY HELPERS
   ========================================================= */

async function fetchGeoapify(url) {

    if (!GEOAPIFY_API_KEY) {
        throw new Error('GEOAPIFY_API_KEY is missing in .env');
    }
};

    const separator = url.includes('?') ? '&' : '?';

    const response = await fetch(
        `${url}${separator}apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || `Geoapify error ${response.status}`
        );
    }

    if (!Array.isArray(data.features)) {
        throw new Error('Geoapify response missing features');
    }

    return data.features;
}

/* =========================================================
   TOURISM
   ========================================================= */

async function fetchTourism(city) {

    /*
     * Locked architecture:
     *
     * 1. Use curated/verified attractions where available.
     * 2. Do NOT return random places of worship as tourist
     *    attractions.
     * 3. For cities without a curated list, use Geoapify only
     *    for genuine tourism/sight/museum categories.
     */

    if (verifiedAttractions[city]) {
        return verifiedAttractions[city];
    }

// Function to fetch hotels
const fetchHotels = async (city) => {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) return [];

    if (!coordinates) {
        return [];
    }

    const [lat, lon] = coordinates;

    const url =
        'https://api.geoapify.com/v2/places' +
        '?categories=tourism.attraction,tourism.sights,entertainment.museum,heritage' +
        `&filter=circle:${lon},${lat},15000` +
        `&bias=proximity:${lon},${lat}` +
        '&limit=20';

    const features = await fetchGeoapify(url);

    return features
        .filter(place => place.properties.name)
        .map(place => ({
            name: place.properties.name,
            address:
                place.properties.formatted ||
                'Address unavailable',
            price: null,
            feeSource: 'Not available'
        }))
        .slice(0, 12);
}

/* =========================================================
   HOTELS
   ========================================================= */

async function fetchHotels(city) {

    const coordinates = getCityCoordinates(city);

    if (!coordinates) {
        return [];
    }

    const [lat, lon] = coordinates;

    const url =
        'https://api.geoapify.com/v2/places' +
        '?categories=accommodation.hotel' +
        `&filter=circle:${lon},${lat},10000` +
        `&bias=proximity:${lon},${lat}` +
        '&limit=15';

    const features = await fetchGeoapify(url);

    return features
        .filter(place => place.properties.name)
        .map(place => ({
            name: place.properties.name,
            address:
                place.properties.formatted ||
                'Address unavailable',
            rating:
                place.properties.rating ||
                'N/A'
        }));
}

/* =========================================================
   RESTAURANTS
   ========================================================= */

async function fetchRestaurants(city) {

// Function to fetch restaurants
const fetchRestaurants = async (city) => {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) return [];

    if (!coordinates) {
        return [];
    }

    const [lat, lon] = coordinates;

    const url =
        'https://api.geoapify.com/v2/places' +
        '?categories=catering.restaurant' +
        `&filter=circle:${lon},${lat},10000` +
        `&bias=proximity:${lon},${lat}` +
        '&limit=15';

    const features = await fetchGeoapify(url);

    return features
        .filter(place => place.properties.name)
        .map(place => ({
            name: place.properties.name,
            address:
                place.properties.formatted ||
                'Address unavailable',
            rating:
                place.properties.rating ||
                'N/A'
        }));
}

/* =========================================================
   API ENDPOINTS
   ========================================================= */

app.post('/get_tourist_attractions', async (req, res) => {

    try {

        const { city } = req.body;

        if (!city) {
            return res.status(400).json({
                error: 'City is required'
            });
        } else {
            console.error('API Error:', response.status, response.statusText);
            return [];
        }

        const attractions = await fetchTourism(city);

        res.json(attractions);

    } catch (err) {

        console.error('Tourism error:', err);

        res.status(500).json({
            error: 'Failed to fetch tourist attractions'
        });
    }
});

// API endpoint to get hotels
app.post('/get_hotels', async (req, res) => {

    try {

        const { city } = req.body;

        if (!city) {
            return res.status(400).json({
                error: 'City is required'
            });
        }

        const hotels = await fetchHotels(city);

        res.json(hotels);

    } catch (err) {

        console.error('Hotel error:', err);

        res.status(500).json({
            error: 'Failed to fetch hotels'
        });
    }
});

// API endpoint to get restaurants
app.post('/get_restaurants', async (req, res) => {

    try {

        const { city } = req.body;

        if (!city) {
            return res.status(400).json({
                error: 'City is required'
            });
        }

        const restaurants = await fetchRestaurants(city);

        res.json(restaurants);

    } catch (err) {

        console.error('Restaurant error:', err);

        res.status(500).json({
            error: 'Failed to fetch restaurants'
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
