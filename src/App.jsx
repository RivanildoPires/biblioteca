import "./App.css";
import TelaInicial from "./components/TelaInicial";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListarLivros from "./components/ListarLivros";
import Livro from "./components/Livro";
import ListarTCC from "./components/ListarTCC";
import Material from "./components/Material";
import TelaLogin from "./components/TelaLogin";
import LivrosReservados from "./components/LivrosReservados";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/telaInicial" element={<TelaInicial />} />
        <Route path="/livros" element={<ListarLivros />} />
        <Route path="/livro/:id" element={<Livro />} />
        <Route path="/tcc" element={<ListarTCC />} />
        <Route path="/material" element={<Material />} />
        <Route path="/" element={<TelaLogin />} />
        <Route path="/livroReserva" element={<LivrosReservados />} />
        <Route path="/livrosPublicos" element={<LivrosPublicos />} />
      </Routes>
    </Router>
  );
}

export default App;
