const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Import your User model

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB (mydb)
const mongoURIMyDB = process.env.MONGODB_URI_MYDB;
const mongoURIMyBlogs = process.env.MONGODB_URI_MYBLOGS;

mongoose.connect(mongoURIMyDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB (mydb)'))
.catch(error => console.error('Error connecting to MongoDB (mydb):', error));

mongoose.connect(mongoURIMyBlogs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB (myblogs)'))
.catch(error => console.error('Error connecting to MongoDB (myblogs):', error));

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(require('express-session')({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Login Route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful' });
});

// Logout Route
app.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out' });
});

const AgeOfAI = mongoose.model('ageofai', {
  title: String,
  overview: [String],
  keypoints: [String],
});

const DevTools = mongoose.model('devtools', {
  title: String,
  overview: [String],
  CourseDetails: [String],
  keypoints: [String],
  imageURL: [String],
  videoURL: [String],
});

const WebDev = mongoose.model('webdev', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
});

const Road = mongoose.model('road', {
  title: String,
  overview: [String],
  description: [String],
  keypoints: [String],
});

const Tools = mongoose.model('tools', {
  title: String,
  overview: String,
  description: String,
  keypoints: [String],
  imageURL: [String],
});

const Working = mongoose.model('working', {
  title: String,
  overview: String,
  description: String,
  keypoints: [String],
  imageURL: [String],
});

// Routes for all collections
app.get('/api/:collection', async (req, res) => {
  const collection = req.params.collection;
  try {
    let data;
    switch (collection) {
      case 'ageofai':
        data = await AgeOfAI.find().lean();
        break;
      case 'devtools':
        data = await DevTools.find().lean();
        break;
      case 'webdev':
        data = await WebDev.find().lean();
        break;
      case 'road':
        data = await Road.find().lean();
        break;
      case 'tools':
        data = await Tools.find().lean();
        break;
      case 'working':
        data = await Working.find().lean();
        break;
      default:
        return res.status(404).json({ error: 'Collection not found' });
    }
    console.log('Data fetched successfully from', collection, 'collection:', data);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching data from ${collection} collection:`, error);
    res.status(500).json({ error: `Error fetching data from ${collection} collection` });
  }
});

// Serving static images and videos
app.use('/api/images', express.static('E:\\Dev Projects\\workREwork\\src\\assets'));
app.use('/api/videos', express.static('E:\\Dev Projects\\workREwork\\src\\assets'));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to My API');
});

// Not Found route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Listen for MongoDB collection events
mongoose.connection.on('collection', (collectionName) => {
  console.log(`Collection ${collectionName} changed.`);
});
