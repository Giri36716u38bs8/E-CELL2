require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, default: 'placeholder.jpg' }
});

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URL)
    .then(() => console.log('db ok'))
    .catch(() => console.log('db bad'));

// ADD THIS NEW ROOT ROUTE HERE
app.get('/', (req, res) => {
    res.send('E-CELL2 API Server Is Running Active');
});

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
