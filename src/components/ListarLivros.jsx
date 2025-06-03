import React, { useState, useEffect } from "react";
import "./ListarLivros.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const areas = [
  { label: "Ciências da Computação", value: "computacao" },
  { label: "Direito", value: "direito" },
  { label: "Educação Física", value: "edfisica" },
  { label: "Marketing", value: "marketing" },
  { label: "Matemática", value: "matematica" },
];

const LivroList = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");

  const fetchLivros = async () => {
    try {
      const response = await api.get("/livro");
      if (response.status === 204) {
        setError("Nenhum livro encontrado");
        setLivros([]);
      } else {
        setLivros(response.data);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Erro ao buscar livros"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
    const intervalId = setInterval(fetchLivros, 200000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAreaClick = (value) => {
    setSelectedArea((prev) => (prev === value ? "" : value));
  };

  const filteredLivros = selectedArea
    ? livros.filter((livro) => livro.area?.toLowerCase() === selectedArea)
    : livros;

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando livros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Erro: {error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="container">
        <aside className="categories">
          <h4>Livros</h4>
          <div className="separator">
            <div className="line"></div>
          </div>
          <ul>
            {areas.map(({ label, value }) => (
              <li
                key={value}
                onClick={() => handleAreaClick(value)}
                className={selectedArea === value ? "selected" : ""}
                style={{ cursor: "pointer" }}
              >
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="container-main">
          <main className="main-content">
            {filteredLivros.length === 0 ? (
              <p>
                Nenhum livro encontrado para{" "}
                {selectedArea
                  ? areas.find((a) => a.value === selectedArea)?.label
                  : "todas as áreas"}
                .
              </p>
            ) : (
              <section className="section-livros">
                {filteredLivros.map((livro) => (
                  <Link key={livro.idLivro} to={`/livro/${livro.idLivro}`}>
                    <div className="livro">
                      <div className="livro-imagem-container">
                        <img
                          src={livro.imagemUrl || "https://placehold.co/300x450?text=Sem+Imagem"}
                          alt={`Capa do livro ${livro.titulo}`}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/300x450?text=Imagem+Não+Disponível";
                          }}
                        />
                      </div>
                      <h5>{livro.titulo}</h5>
                    </div>
                  </Link>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LivroList;