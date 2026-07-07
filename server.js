require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Item } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URL)
    .then(() => console.log('db ok'))
    .catch(() => console.log('db bad'));

app.get('/api/products', async (req, res) => {
    try {
        const all = await Item.find({});
        res.json(all);
    } catch (err) {
        res.status(500).json({ msg: 'err' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const active = await User.findOne({ email, pass });
        if (!active) {
            return res.status(400).json({ msg: 'bad log' });
        }
        res.json({ token: 'xyz123' });
    } catch (err) {
        res.status(500).json({ msg: 'err' });
    }
});

app.listen(5000, () => console.log('live'));
