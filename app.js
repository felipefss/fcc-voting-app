const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');
const User = require('./server/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', express.static(`${__dirname}/client`));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.find(username).then(user => {
            if (!user || !User.isValidPass(password, user.password)) {
                return done(null, false, { message: 'User/password invalid.' });
            }

            return done(null, user);
        });
    }
));

app.post('/auth',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
