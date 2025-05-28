import "./App.css";
import TelaInicial from "./components/TelaInicial";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListarLivros from "./components/ListarLivros";
import Livro from "./components/Livro";
import ListarTCC from "./components/ListarTCC";
import Material from "./components/Material";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/livros" element={<ListarLivros />} />
        <Route path="/livro/:id" element={<Livro />} />
        <Route path="/tcc" element={<ListarTCC />} />
        <Route path="/material" element={<Material />} />
      </Routes>
    </Router>
  );
}

export default App;
