const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const jobroutes = require('./routes/jobs.js');
const optionRoutes = require('./routes/options');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobroutes);
app.use('/api/options', optionRoutes);

app.get('/', (req, res)=>{
    res.send('Welcome to the Job Portal API');
})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=>{
        console.log(`Server running at http://localhost:${PORT}` );
    })
}).catch(err => console.error('MongoDB connection error:', err));