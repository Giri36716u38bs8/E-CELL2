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
const supportSchema = new mongoose.Schema({
 name: { type: String, required: true },
 message: { type: String, required: true },
 createdAt: { type: Date, default: Date.now }
});
const orderSchema = new mongoose.Schema({
 orderNumber: { type: String, required: true, unique: true },
 email: { type: String, required: true },
 items: [{
 name: String,
 price: Number,
 qty: Number
 }],
 total: { type: Number, required: true },
 status: { type: String, default: 'Processing' },
 createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const Support = mongoose.model('Support', supportSchema);
const Order = mongoose.model('Order', orderSchema);
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.URL)
 .then(async () => {
 console.log('db ok');
 const count = await Item.countDocuments({});
 if (count === 0) {
 await Item.create([
 { name: 'Alpha Heavy Jacket', price: 8900 },
 { name: 'Steel Chrono Watch', price: 15000 },
 { name: 'Tactical Leather Boots', price: 12000 }
 ]);
 console.log('Sample stock items inserted.');
 }
 })
 .catch((err) => console.log('db bad', err.message));
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
app.post('/api/register', async (req, res) => {
 const { email, pass } = req.body;
 if (!email || !pass) return res.status(400).json({ msg: 'email and pass required' });
 try {
 const existing = await User.findOne({ email });
 if (existing) return res.status(409).json({ msg: 'account already exists' });
 const user = await User.create({ email, pass });
 res.status(201).json({ msg: 'account created', email: user.email });
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

app.post('/api/support', async (req, res) => {
 const { name, message } = req.body;
 if (!name || !message) return res.status(400).json({ msg: 'name and message required' });
 try {
 const ticket = await Support.create({ name, message });
 res.status(201).json({ msg: 'ticket received', id: ticket._id });
 } catch (err) {
 res.status(500).json({ msg: 'err' });
 }
});

app.post('/api/checkout', async (req, res) => {
 const { email, items } = req.body;
 if (!email || !items || items.length === 0) {
 return res.status(400).json({ msg: 'email and at least one item are required' });
 }
 try {
 const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
 const orderNumber = 'FLUX-' + Math.floor(100000 + Math.random() * 900000);
 const order = await Order.create({ orderNumber, email, items, total });
 res.status(201).json({ msg: 'order placed', orderNumber: order.orderNumber, total: order.total });
 } catch (err) {
 res.status(500).json({ msg: 'err' });
 }
});
app.get('/api/orders/:orderNumber', async (req, res) => {
 try {
 const order = await Order.findOne({
 orderNumber: req.params.orderNumber,
 email: req.query.email
 });
 if (!order) return res.status(404).json({ msg: 'no order found for that number and email' });
 res.json(order);
 } catch (err) {
 res.status(500).json({ msg: 'err' });
 }
});
app.listen(process.env.PORT || 5000, () => console.log('live'));
