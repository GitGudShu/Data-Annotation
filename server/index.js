require('dotenv').config();
const express = require('express');
const cors = require('cors');
const User = require('./models/user.model');
const userRoutes = require('./routes/user');
const sequelize = require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const imageRoutes = require('./routes/images');
const annotationRoutes = require('./routes/annotations');
const imageAnnotationsRoute = require('./routes/imageAnnotations'); 
const authRoutes = require('./routes/auth');

app.use('/api/images', imageRoutes);
app.use('/api/annotations', annotationRoutes);
app.use('/api/image-annotations', imageAnnotationsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello from the Node.js backend!" });
});

sequelize.sync()
    .then(() => {
        console.log('Connected to the database!');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
  });