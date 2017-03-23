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
    done(null, user.id);
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

app.post('/register', (req, res, next) => {
    const user = req.body;
    User.create(user.username, user.password)
        .then((userId) => {
            user.id = userId;
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })
        .catch(err => {
            if (err.code === 11000) {
                console.log('USER ALREADY EXISTS');
                /**
                 * ARRUMAR ISSO AQUI!!!
                 */
                res.redirect('/');
            } else {
                console.error(err.message);
            }
        });
});

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
