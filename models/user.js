const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' // Assuming you have a Product model
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// Create a new user
const newUser = new User({ username:   'newuser',   email:   'newuser@example.com',   password:   'password123' });
newUser.save().then(user => console.log('New user created:  ',   user));


