import React, { useState, useEffect } from "react";
import "./ListarLivros.css";
import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import java from "../assets/java.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const LivroList = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLivros = async () => {
    try {
      const response = await api.get("/livro");

      if (response.status === 204) {
        setError("Nenhum livro encontrado");
        setLivros([]);
      } else {
        setLivros(response.data);
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
            <li>Ciências da Computação</li>
            <li>Direito</li>
            <li>Educação Fisica</li>
            <li>Marketing</li>
            <li>Matemática</li>
          </ul>
        </aside>
        <div className="container-main">
          <main className="main-content">
            {livros.length === 0 ? (
              <p>Nenhum livro cadastrado.</p>
            ) : (
              <section className="section-livros">
                {livros.map((livro) => (
                  <Link key={livro.idLivro} to={`/livro/${livro.idLivro}`}>
                    <div className="livro">
                      <img
                        src={livro.imagem || java}
                        alt={`Capa do livro ${livro.titulo}`}
                      />
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
