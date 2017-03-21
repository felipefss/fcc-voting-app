const express = require('express');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', express.static(`${__dirname}/src/site`));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
