import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./pages/NavBar"
import Home from "./pages/Home";
import FlashcardQuiz from "./pages/FlashcardQuiz";
import KanjiDictionary from "./pages/KanjiDictionary";
import StrokeOrder from "./pages/StrokeOrder";

const App = () => {
  const styles = {
    content: {
      marginTop: "4rem", // Adjust this value based on the height of your NavBar
    },
  };

  return (
    <Router>
      <NavBar />
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcard-quiz" element={<FlashcardQuiz />} />
          <Route path="/kanji-dictionary" element={<KanjiDictionary />} />
          <Route path="/stroke-order" element={<StrokeOrder />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

