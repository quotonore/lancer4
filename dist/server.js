const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the project root (so existing index.html, css/, js/, images/ work)
app.use(express.static(path.join(__dirname)));

// Simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
