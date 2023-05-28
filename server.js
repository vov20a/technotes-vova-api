const express = require('express');
require('dotenv').config();
require('express-async-errors');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/root');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');
const { logger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

const Port = process.env.PORT || 3500;
app.use(logger);

console.log(process.env.NODE_ENV);
connectDB();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 not found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(Port, () => {
    console.log(`Server started on port=${Port}`);
  });
});
mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
