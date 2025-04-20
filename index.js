require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const employeeRoutes = require('./routes/employees');
const taskRoutes = require('./routes/tasks');

// Enable CORS so frontend can access the backend
app.use(cors());

// Parse JSON body data
app.use(express.json());

// Route to handle all /api/tasks endpoints
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});