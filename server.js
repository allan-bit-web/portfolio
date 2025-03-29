const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Path to the JSON file
const jsonFilePath = path.join(__dirname, 'contact_submissions.json');

// Function to read JSON file
async function readJsonFile() {
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, create it with initial structure
            const initialData = { submissions: [] };
            await fs.writeFile(jsonFilePath, JSON.stringify(initialData, null, 4));
            return initialData;
        }
        throw error;
    }
}

// Function to write JSON file
async function writeJsonFile(data) {
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 4));
}

// GET endpoint to retrieve all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const data = await readJsonFile();
        res.json(data);
    } catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).json({ error: 'Failed to read submissions' });
    }
});

// POST endpoint to add new submission
app.post('/api/submissions', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Read existing data
        const data = await readJsonFile();
        
        // Create new submission
        const newSubmission = {
            id: Date.now(),
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };

        // Add new submission
        data.submissions.push(newSubmission);

        // Write updated data back to file
        await writeJsonFile(data);

        // Send success response
        res.status(201).json({
            message: 'Submission received successfully',
            submission: newSubmission
        });

    } catch (error) {
        console.error('Error handling submission:', error);
        res.status(500).json({ error: 'Failed to process submission' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 