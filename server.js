import express from 'express';
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});