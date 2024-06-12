require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linkRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


const MONGO_URI = 'mongodb://' + ('localhost:27017' || process.env.MONGO_URI)

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/purchases', purchaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
