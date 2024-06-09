require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/userRoutes');
const linkRoutes = require('./src/routes/linkRoutes');

const app = express();
app.use(express.json());
const MONGO_URI = 'mongodb://' + ('localhost:27017' || process.env.MONGO_URI)

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
