const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Paths for the JLPT-level JSON files
const jlptDataDirectory = path.join(__dirname, '../data/jlpt_levels');

// Route to get kanji data for a specific JLPT level
router.get('/:level', (req, res) => {
    const level = req.params.level;
  
    // console.log(`Received request for JLPT level: ${level}`); // Log level received
  
    if (!['1', '2', '3', '4', '5'].includes(level)) {
      console.warn(`Invalid JLPT level: ${level}`);
      return res.status(400).json({ error: 'Invalid JLPT level' });
    }
  
    const filePath = path.join(jlptDataDirectory, `jlpt_level_${level}.json`);
    // console.log(`Looking for file: ${filePath}`); // Log file path being accessed
  
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: 'Kanji data not found for this level' });
    }
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file for JLPT level ${level}:`, err);
        return res.status(500).json({ error: 'Failed to load kanji data' });
      }
  
      try {
        const kanjiData = JSON.parse(data);
        // console.log(`Successfully loaded data for JLPT level ${level}`);
        res.json(kanjiData);
      } catch (parseError) {
        console.error('Error parsing kanji data:', parseError);
        res.status(500).json({ error: 'Failed to parse kanji data' });
      }
    });
  });  

module.exports = router;
