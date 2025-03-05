const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection string (replace with your actual connection string)
/*const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Mongouser:mongomongo2005@cluster0.yjmil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  });*/

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Standard User', 'Organizer', 'System Admin'],
    default: 'Standard User',
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;