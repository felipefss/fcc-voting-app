const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const Polls = require('./server/polls');
const User = require('./server/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', express.static(`${__dirname}/client`));
app.use(cookieParser());
app.use(bodyParser.json());

const generateJWT = (user) => {
    const payload = {
        user: user.username,
        polls: user.polls,
        id: user.id
    };

    return jwt.sign(payload, process.env.JWTSECRET);
};

const validateJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(payload);
        });
    });
};

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
            console.error(err.message);
            res.sendStatus(500);
        });
});

app.post('/compute-vote', (req, res) => {
    const id = req.body.id;
    const data = {
        options: req.body.options
    };

    Polls.update(id, data)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.post('/create-poll', (req, res) => {
    const data = req.body;

    Polls.createPoll(data)
        .then(id => {
            res.send(id);
        })
        .catch(err => {
            console.error(err.message);
            res.sendStatus(500);
        });
});

app.get('/get-polls', (req, res) => {
    Polls.getAll()
        .then(polls => {
            res.send(polls);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

app.delete('/poll/:id', (req, res) => {
    Polls.remove(req.params.id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err.message);
        });
});

app.get('/poll/:id', (req, res) => {
    Polls.findById(req.params.id)
        .then(poll => {
            res.send(poll);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.post('/register', (req, res) => {
    const user = req.body;
    User.create(user.username, user.password)
        .then(() => {
            user.polls = [];

            res.cookie('session', generateJWT(user));
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.code === 11000) {
                console.log('USER ALREADY EXISTS');
                res.sendStatus(401);
            } else {
                console.error(err.message);
                res.sendStatus(500);
            }
        });
});

app.get('/user-polls/:user', (req, res) => {
    Polls.getUserPolls(req.params.user)
        .then(polls => {
            res.send(polls);
        })
        .catch(err => {
            console.error(err.message);
            res.sendStatus(500);
        });
});

app.use((req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
