const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cart');
const favoritesRoutes = require('./routes/favourites');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Import your routes
const adminRoutes     = require('./routes/admin');
const authMiddleware   = require('./middlewares/adminMiddleware');  // ← add this



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', productRoutes);
app.use('/api/favourites', favoritesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes); // API will be /api/users/:id
app.use('/api/orders', orderRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
