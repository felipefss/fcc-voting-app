const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./server/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', express.static(`${__dirname}/client`));
app.use(cookieParser());
app.use(bodyParser.json());

const generateJWT = (user) => {
    const payload = {
        user: user.username,
        id: user.id
    };

    return jwt.sign(payload, process.env.JWTSECRET || 'myvotingapp');
};

const validateJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWTSECRET || 'myvotingapp', (err, payload) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(payload);
        });
    });
};

app.post('/register', (req, res) => {
    const user = req.body;
    User.create(user.username, user.password)
        .then((userId) => {
            user.id = userId;

            res.cookie('session', generateJWT(user));
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.code === 11000) {
                console.log('USER ALREADY EXISTS');
                res.sendStatus(401);
            } else {
                console.error(err.message);
            }
        });
});

app.post('/auth', (req, res) => {
    const reqUser = req.body;
    User.findByName(reqUser.username)
        .then(user => {
            if (user && User.isValidPass(reqUser.password, user.password)) {
                res.cookie('session', generateJWT(user));
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        })
        .catch(err => {
            console.error(err);
        });
});

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

app.use((req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
