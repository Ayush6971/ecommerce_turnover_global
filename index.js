const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const { sequelize } = require('./models')
const { seedData } = require('./seeder/seedDB')
const { getLoginPage } = require('./controller/authController')

require('dotenv').config({})

// request body parser middleware
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'assets')));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require("./config/passport");

//routes
require("./routes/r-index")(app);

// authenticate db connection
sequelize.authenticate()
    .then(() => {
        console.log('DB Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err.message);
    });

sequelize.sync({ force: false }).then(() => seedData())

app.use('/', getLoginPage)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});