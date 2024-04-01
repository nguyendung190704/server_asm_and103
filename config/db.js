const mongoose = require('mongoose');
mongoose.set('strictQuery',true)

// MongoDB connection URI
const local = 'mongodb://localhost:27017/ASM'; // Update with your MongoDB URI

// Establish connection to MongoDB
const connect = async ()=>{
    try {
        mongoose.connect(local)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

    } catch (error) {
        console.log(error);
    }
}
module.exports = {connect};
