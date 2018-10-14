const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);
// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Load keys
const keys = require('./config/keys');

// Connect to mongoose
mongoose.connect(keys.mongoURI, {
        autoIndex: false,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MongoDB Connected');
    }).catch(err => console.log(err));



const app = express();

// Handlebars

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Set global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

app.use('/', index);
app.use('/auth', auth);
// Passport MiddleWare



const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});