import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Livro.css";
import java from "../assets/java.png";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const Livro = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [error, setError] = useState(null);

  const fetchLivro = async () => {
    try {
      const response = await api.get(`/livro/${id}`);
      setLivro(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Erro ao buscar o livro"
      );
    }
  };

  useEffect(() => {
    fetchLivro();
  }, [id]);

  if (error) {
    return <p className="error">Erro: {error}</p>;
  }

  if (!livro) {
    return <p className="loading">Carregando livro...</p>;
  }

  return (
    <div>
      <Header />

      <div className="class-main">
        <main>
          <section className="sec">
            <div className="livro-info">
              <img src={java} alt="Livro" />
              <ul>
                <li>Autor: {livro.autor}</li>
                <li>Publicado: {livro.anoPublicado}</li>
                <li>Editora:{livro.editora}</li>
              </ul>
            </div>
            <div className="livro-sinopse">
              <h5>Sinopse</h5>
              <p>{livro.sinopse}</p>
              <button>Reservar</button>
            </div>
            <div className="aviso">
              <h5>Atenção!</h5>
              <p>
                Ao reservar o livro, ele ficará disponível para o aluno por um
                dia. Este livro pertence à instituição, portanto, o discente
                deve ter cuidado e devolvê-lo em perfeito estado. Após a
                reserva, o aluno terá uma semana para ler e devolver o
                livro. Em caso de atraso, será aplicada uma multa.<span>So é possivel reservar um exemplar!</span>
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Livro;
