import { useEffect, useState } from "react";
import { setCookie, getCookie } from "../utils/storage";

const FlashcardQuiz = () => {
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [kanjiData, setKanjiData] = useState([]);
  const [currentKanji, setCurrentKanji] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("5");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedProgress = getCookie("flashcard-progress");
    if (savedProgress !== null) {
      setCurrentKanjiIndex(parseInt(savedProgress, 10));
    }
    fetchKanjiData(selectedLevel).catch((error) => console.error("Error in useEffect:", error));
  }, [selectedLevel]);
  

  const fetchKanjiData = async (level) => {
    console.log(`[INFO] Fetching kanji data for JLPT Level ${level}...`);
    setIsLoading(true);
  
    try {
      const response = await fetch(`http://localhost:5000/api/kanji/${level}`);
      if (response.ok) {
        console.log(`[INFO] Successfully fetched data for JLPT Level ${level}`);
        const data = await response.json();
  
        if (data.length > 0) {
          console.log(`[INFO] Loaded ${data.length} kanji for JLPT Level ${level}`);
          setKanjiData(data);
          setCurrentKanji(data[0]);
        } else {
          console.warn(`[WARN] No kanji data available for JLPT Level ${level}`);
          alert("No kanji data available for the selected level.");
        }
      } else {
        console.error(`[ERROR] Failed to fetch data for JLPT Level ${level}. Response:`, response);
        alert("Failed to load kanji data.");
      }
    } catch (error) {
      console.error(`[ERROR] Network error fetching data for JLPT Level ${level}:`, error);
      alert("An error occurred while fetching kanji data.");
    } finally {
      setIsLoading(false);
    }
  };  

  const handleQuizProgress = () => {
    const nextIndex = (currentKanjiIndex + 1) % kanjiData.length;
    setCurrentKanjiIndex(nextIndex);
    setCurrentKanji(kanjiData[nextIndex]);
    setCookie("flashcard-progress", nextIndex);
  };

  if (isLoading) {
    //return <div>Loading kanji data...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Kanji Flashcard Quiz</h1>
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
        <button
          style={styles.button}
          onClick={handleQuizProgress}
        >
          Next Card
        </button>
      </div>
      <p style={styles.progress}>
        Current Progress: {currentKanjiIndex + 1} of {kanjiData.length}
      </p>
      {currentKanji ? (
        <div style={styles.kanjiCard}>
          <div style={styles.cardSection}>
            <div style={styles.kanjiLiteral}>
              <h2>{currentKanji.literal || "No Kanji"}</h2>
            </div>
          </div>

          <div style={styles.cardSection}>
          <p>Kun Readings: {currentKanji.reading_meaning.rmgroup.reading.filter(r => r["@r_type"] === "ja_kun")
            .map(r => r["#text"]).join(", ") || "None"}</p>
          </div>

          <div style={styles.cardSection}>
          <p>On Readings: {currentKanji.reading_meaning.rmgroup.reading.filter(r => r["@r_type"] === "ja_on")
          .map(r => r["#text"]).join(", ") || "None"}</p>
          </div>
          
          <div style={styles.cardSection}>
          <p>Meanings: {currentKanji.reading_meaning.rmgroup.meaning?.join(", ") || "None"}</p>
          </div>
        </div>
      ) : (
        <p>No Kanji available.</p>
      )}
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
    minHeight: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginTop: '-10px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    color: '#333',
  },  
  cardSection: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    marginBottom: '15px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    width: '500px', // Fixed width
    height: '700px', // Fixed height
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'center',
    overflowY: 'auto', // Enable scrolling for excess content
  },  
  kanjiReadingKun: {
    fontSize: '1.2rem',
    color: '#555',
  },
  kanjiReadingOn: {
    fontSize: '1.2rem',
    color: '#555',
  },
  kanjiLiteral: {
    fontSize: '8rem',
    fontWeight: 'bold',
    marginTop: '-250px',
    marginBottom: '-250px',
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
    margin: '20px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  progress: {
    marginTop: '5px',
    fontSize: '1.2rem',
    color: '#333',
  },
};

export default FlashcardQuiz;
