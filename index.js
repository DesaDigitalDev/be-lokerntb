
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Selamat datang di API kami!');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
