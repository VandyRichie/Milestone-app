const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const index = require('./index.js');


mongoose.connect('mongodb+srv://adminbarb:<barbsshoesstore>@barbsshoesstore.jwbnktu.mongodb.net/?retryWrites=true&w=majority&appName=Barbsshoesstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Registration error:', err);
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate key error (username or email already exists)
        res.status(409).json({ message: 'Username or email already exists' });
      } else {
        res.status(500).json({ message: 'Registration failed' });
      }
    }
  });


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
    if (!user) {
      throw new MongooseError('User not found'); 
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new MongooseError('Incorrect password');
    }
    
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    if (err instanceof MongooseError) {
      console.error('Mongoose error:', err.message); 
      res.status(401).json({ message: err.message }); // Send an error response
    } else {
      console.error('Error:', err.message); 
      res.status(500).json({ message: 'Login failed' }); 
    }
  }
});


app.post('/cart', async (req, res) => {
    try {
      const userId = req.user._id; // Get the user's ID from the authenticated user
      const { item } = req.body; // Get the item to add to the cart
      // Find the user
      const user = await User.findById(userId);
      // Add the item to the user's cart array
      user.cart.push(item);
      await user.save();
      res.status(200).json({ message: 'Item added to cart' });
    } catch (err) {
      console.error('Cart error:', err);
      res.status(500).json({ message: 'Cart operation failed' });
    }
  });
  
  // Checkout route
  app.post('/checkout', async (req, res) => {
    try {
      const userId = req.user._id; // Get the user's ID from the authenticated user
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      // Process checkout logic (e.g., update order status, clear cart)
      // ...
      res.status(200).json({ message: 'Checkout successful' });
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).json({ message: 'Checkout failed' });
    }
  });
  

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
