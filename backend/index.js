// Import the Express module
const express = require('express');
const jobRoutes=require('./routes/jobRoute');
const userRoutes=require('./routes/userRoute');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3000;

connectDB();

app.use('/api',jobRoutes);
app.use('/api',userRoutes)



app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
