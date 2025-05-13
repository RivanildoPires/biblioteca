import "./App.css";
import TelaInicial from "./components/TelaInicial";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListarLivros from "./components/ListarLivros";
import LivroList from "./components/LivroList"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/livros" element={<ListarLivros />} />
        <Route path="/listar" element={<LivroList />} />
      </Routes>
    </Router>
  );
}

export default App;
