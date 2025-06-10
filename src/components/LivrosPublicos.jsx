import React, { useState, useEffect } from "react";
import "./ListarLivros.css";
import axios from "axios";
import Header from "./Header";
import "./Footer2.css";

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
    ? livros.filter(
        (livro) =>
          livro.area && livro.area.toLowerCase() === selectedArea.toLowerCase()
      )
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
                  <div className="livro">
                    <div className="livro-imagem-container">
                      <img
                        src={
                          livro.imagemUrl ||
                          "https://placehold.co/300x450?text=Sem+Imagem"
                        }
                        alt={`Capa do livro ${livro.titulo}`}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/300x450?text=Imagem+Não+Disponível";
                        }}
                      />
                    </div>
                    <h5>{livro.titulo}</h5>

                    <button className="download">Download</button>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>

      <div className="page-container">
        <div className="foooter">
          <h3 className="foooter-h3">
            Faculdade Católica da Paraíba. © 2025 - Todos os direitos reservados.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LivrosPublicos;
