import { useEffect, useState } from "react";

const KanjiDictionary = () => {
  const [kanjiData, setKanjiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [sortFilter, setSortFilter] = useState("0");
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const fetchKanjiData = async (level) => {
    console.log(`[INFO] Fetching kanji data for JLPT Level ${level}...`);
    setIsLoading(true);

    try {
      const url =
        level === "0"
          ? `http://localhost:5000/api/kanji/all`
          : `http://localhost:5000/api/kanji/${level}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setKanjiData(data);
      } else {
        alert("Failed to load kanji data.");
      }
    } catch (error) {
      console.error("Error fetching kanji data:", error);
      alert("An error occurred while fetching kanji data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKanjiData(selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    const sortedData = [...kanjiData].sort((a, b) => {
      if (sortFilter === "1") {
        return a.misc.stroke_count - b.misc.stroke_count; // Sort by stroke count
      } else if (sortFilter === "2") {
        return a.misc.freq - b.misc.freq; // Sort by frequency
      }
      return a.id - b.id; // Default sort by ID
    });
    setKanjiData(sortedData);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortFilter]);

  const handleKanjiClick = (kanji) => {
    setSelectedKanji(kanji);
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    setSelectedKanji(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Kanji Dictionary</h1>
      <div>
        <label htmlFor="jlpt-level">Filter: </label>
        <select
          id="jlpt-level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={styles.select}
        >
          <option value="0">All</option>
          <option value="5">JLPT Level N5</option>
          <option value="4">JLPT Level N4</option>
          <option value="3">JLPT Level N3</option>
          <option value="2">JLPT Level N2</option>
          <option value="1">JLPT Level N1</option>
        </select>

        <label htmlFor="filter-sort">Sort by: </label>
        <select
          id="filter-sort"
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
          style={styles.select}
        >
          <option value="0">ID</option>
          <option value="1">Stroke Count</option>
          <option value="2">Frequency</option>
        </select>
      </div>

      <div style={styles.gridContainer}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          kanjiData.map((kanji, index) => (
            <button
              key={index}
              style={styles.kanjiButton}
              onClick={() => handleKanjiClick(kanji)}
            >
              {kanji.literal || "No Kanji"}
              <div style={styles.kanjiId}>#{kanji.id}</div>
            </button>
          ))
        )}
      </div>

      {isOverlayVisible && selectedKanji && (
        <div
          style={styles.overlay}
          onClick={(e) => {
            // Close overlay if backdrop is clicked
            if (e.target === e.currentTarget) {
              closeOverlay();
            }
          }}
        >
          <div style={styles.overlayContent}>
            <h2>{selectedKanji.literal}</h2>
            <p>ID: {selectedKanji.id}</p>
            <p>Stroke Count: {selectedKanji.misc.stroke_count}</p>
            <p>Frequency: {selectedKanji.misc.freq}</p>
            <p>Kun Readings: {selectedKanji.reading_meaning.rmgroup.reading.filter(r => r["@r_type"] === "ja_kun")
              .map(r => r["#text"]).join(", ") || "None"}</p>
            <p>On Readings: {selectedKanji.reading_meaning.rmgroup.reading.filter(r => r["@r_type"] === "ja_on")
              .map(r => r["#text"]).join(", ") || "None"}</p>
            <p>Meanings: {selectedKanji.reading_meaning.rmgroup.meaning?.join(", ") || "None"}</p>
            <button onClick={closeOverlay} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    minHeight: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#444444',
    color: '#e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0)',
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: '#fff',
  },
  select: {
    margin: "0 10px",
    padding: "5px",
    fontSize: "1rem",
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '5px',
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
    padding: "20px",
    width: "100%",
    maxWidth: "800px",
  },
  kanjiButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#333",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    height: "100px",
    width: "100px",
    border: "none",
    cursor: "pointer",
    transition: 'all 0.3s ease',
    color: "#e0e0e0",
  },
  kanjiButtonHover: {
    backgroundColor: '#f7a61e',
    color: '#fff',
  },
  kanjiId: {
    position: "absolute",
    bottom: "5px",
    right: "12px",
    fontSize: "0.75rem",
    color: "#ccc",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayContent: {
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    width: "300px",
    color: "#e0e0e0",
  },
  closeButton: {
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: 'all 0.3s ease',
  },
  closeButtonHover: {
    backgroundColor: "#c9302c",
  },
};

export default KanjiDictionary;
