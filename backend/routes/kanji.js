const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Read kanji data
const kanjiDataPath = path.join(__dirname, '../data/cleaned_kanjidic2.json');

// API route to get kanji by JLPT level
router.get('/:level', (req, res) => {
  const level = req.params.level;

  // Read the JSON data file
  fs.readFile(kanjiDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data file' });
    }

    let kanjiData = JSON.parse(data);

    if (kanjiData && kanjiData.kanjidic2 && Array.isArray(kanjiData.kanjidic2.character)) {
      // Filter the kanji characters based on the JLPT level
      const filteredKanji = kanjiData.kanjidic2.character.filter((kanji) => {
        if (kanji.misc && kanji.misc.jlpt) {
          return kanji.misc.jlpt === level;
        }
        // Skip any kanji entries without a jlpt tag
        return false;
      });

      // Simplify and sanitize the filtered kanji data
      const sanitizedKanji = filteredKanji.map((kanji) => {
        return {
          literal: kanji.literal,
          reading_meaning: {
            meaning: kanji.reading_meaning.rmgroup?.meaning || []
          },
          misc: {
            grade: kanji.misc.grade,
            stroke_count: kanji.misc.stroke_count,
            freq: kanji.misc.freq,
            jlpt: kanji.misc.jlpt
          }
        };
      });

      if (sanitizedKanji.length > 0) {
        // Send the sanitized kanji data as JSON
        return res.json(sanitizedKanji);
      } else {
        return res.status(404).json({ error: `No kanji found for JLPT level ${level}` });
      }
    } else {
      return res.status(500).json({ error: 'Data is not in the expected format' });
    }
  });
});

module.exports = router;
