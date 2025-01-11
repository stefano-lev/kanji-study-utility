import { useEffect, useState } from "react";
import { setCookie, getCookie } from "../utils/storage";

const FlashcardQuiz = () => {
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [kanjiData, setKanjiData] = useState([]);
  const [currentKanji, setCurrentKanji] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("5");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProgress = getCookie("flashcard-progress");
    if (savedProgress !== null) {
      setCurrentKanjiIndex(savedProgress);
    }

    fetchKanjiData(selectedLevel);
  }, [selectedLevel]);

  const fetchKanjiData = async (level) => {
    try {
      const response = await fetch(`http://localhost:5000/api/kanji/${level}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setKanjiData(data);
          setCurrentKanji(data[0]);
        } else {
          console.error("No kanji data received");
          alert('No kanji data found for the selected level.');
        }
      } else {
        console.error('Failed to load kanji data');
        alert('Failed to load kanji data');
      }
    } catch (error) {
      console.error('Error fetching kanji data:', error);
      alert('Error fetching kanji data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizProgress = () => {
    const newProgress = currentKanjiIndex + 1;
    setCurrentKanjiIndex(newProgress);
    setCookie("flashcard-progress", newProgress);

    const nextIndex = (newProgress) % kanjiData.length;
    setCurrentKanji(kanjiData[nextIndex]);
  };

  if (isLoading) {
    return <div>Loading kanji data...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Kanji Flashcard Quiz</h1>

      {/* JLPT Level Selector */}
      <div>
        <label htmlFor="jlpt-level">Select JLPT Level: </label>
        <select
          id="jlpt-level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={styles.select}
        >
          <option value="5">JLPT Level N5</option>
          <option value="4">JLPT Level N4</option>
          <option value="3">JLPT Level N3</option>
          <option value="2">JLPT Level N2</option>
          <option value="1">JLPT Level N1</option>
        </select>
      </div>

      {/* Kanji Flashcard */}
      {currentKanji && (
        <div style={styles.kanjiCard}>
          <div id="kanji-display">
            <h2 style={styles.kanjiLiteral}>{currentKanji.literal}</h2>
          </div>
          <div id="meaning-display">
            <p style={styles.meaningText}>
              {currentKanji.reading_meaning.meaning.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Progress Info */}
      <p style={styles.progress}>
        Current Progress: {currentKanjiIndex + 1} of {kanjiData.length}
      </p>

      {/* Next Card Button */}
      <button
        style={styles.button}
        onClick={handleQuizProgress}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Next Card
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    boxSizing: 'border-box',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  select: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  kanjiCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'center',
  },
  kanjiLiteral: {
    fontSize: '12rem',
    fontWeight: 'bold',
    marginTop: '-20px',
    marginBottom: '10px',
  },
  meaningText: {
    fontSize: '1.2rem',
    color: '#555',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  progress: {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: '#333',
  },
};

export default FlashcardQuiz;
