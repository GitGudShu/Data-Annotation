require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const imageRoutes = require('./routes/images');
const annotationRoutes = require('./routes/annotations');
const imageAnnotationsRoute = require('./routes/imageAnnotations'); 
app.use('/api/images', imageRoutes);
app.use('/api/annotations', annotationRoutes);
app.use('/api/image-annotations', imageAnnotationsRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello from the Node.js backend!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
