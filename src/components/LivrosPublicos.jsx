import React, { useState, useEffect } from "react";
import "./ListarLivros.css";
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

const LivrosPublicos = () => {
  const [livros, setLivros] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await api.get("/livropublico");
        setLivros(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar livros. Tente novamente mais tarde.");
        setLoading(false);
        console.error("Erro ao buscar livros:", err);
      }
    };

    fetchLivros();
  }, []);

  const handleAreaClick = (value) => {
    setSelectedArea((prev) => (prev === value ? "" : value));
  };

  const filteredLivros = selectedArea
    ? livros.filter((livro) => 
        livro.area && livro.area.toLowerCase() === selectedArea.toLowerCase())
    : livros;

  const handleReadOnline = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const handleViewDetails = (livro) => {

    console.log("Detalhes do livro:", livro);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container loading-container">
          <p>Carregando livros...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container error-container">
          <p>{error}</p>
        </div>
        <Footer />
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
                  <div key={livro.id} className="livro-card">
                    <div className="livro-imagem-container">
                      <img
                        src={livro.imagemUrl || "https://placehold.co/300x450?text=Sem+Imagem"}
                        alt={`Capa do livro ${livro.titulo}`}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/300x450?text=Imagem+Não+Disponível";
                        }}
                      />
                    </div>
                    <div className="livro-info">
                      <h3>{livro.titulo}</h3>
                      <p className="autor">{livro.autor}</p>
                      <p className="editora">{livro.editora}, {livro.anoPublicado}</p>
                      <p className="sinopse">{livro.sinopse}</p>
                      <div className="livro-actions">
                        <button 
                          onClick={() => handleViewDetails(livro)}
                          className="btn-details"
                        >
                          Detalhes
                        </button>
                        {livro.pdfUrl && (
                          <button 
                            onClick={() => handleReadOnline(livro.pdfUrl)}
                            className="btn-read"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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

export default LivrosPublicos;