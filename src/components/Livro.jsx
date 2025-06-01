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
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

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

  const handleReserva = async () => {
    setCarregando(true);
    setMensagem(null);
    
    try {
      const usuarioId = localStorage.getItem("usuarioId");

      if (!usuarioId) {
        throw new Error("Você precisa estar logado para reservar livros");
      }

      if (!livro?.idLivro) {
        throw new Error("Livro não encontrado");
      }

  
      const disponivel = await api.get(`/reserva/disponibilidade/${livro.idLivro}`);
      if (!disponivel.data) {
        throw new Error("Este livro não está disponível para reserva");
      }


      const reservaData = {
        idUsuario: usuarioId,
        idLivro: livro.idLivro
      };

      const response = await api.post("/reserva", reservaData);
      
      if (response.status === 201) {
        setMensagem("Reserva realizada com sucesso!");
      } else {
        throw new Error("Não foi possível completar a reserva");
      }
    } catch (err) {
      console.error("Erro na reserva:", err);
      setMensagem(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        "Erro ao reservar o livro"
      );
    } finally {
      setCarregando(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!livro) {
    return <div className="loading">Carregando livro...</div>;
  }

  return (
    <div>
      <Header />

      <div className="class-main">
        <main>
          <section className="sec">
            <div className="livro-info">
              <img src={java} alt="Capa do livro" />
              <ul>
                <li>Autor: {livro.autor}</li>
                <li>Publicado: {livro.anoPublicado}</li>
                <li>Editora: {livro.editora}</li>
              </ul>
            </div>

            <div className="livro-sinopse">
              <div className="sinopse-content">
                <h5>Sinopse</h5>
                <p>{livro.sinopse}</p>
              </div>

              <button 
                onClick={handleReserva} 
                disabled={carregando}
                className={carregando ? "loading-button" : ""}
              >
                {carregando ? "Processando..." : "Reservar"}
              </button>

              {mensagem && (
                <div className={`mensagem ${mensagem.includes("sucesso") ? "success" : "error"}`}>
                  {mensagem}
                </div>
              )}
            </div>

            <div className="aviso">
              <h5>Atenção!</h5>
              <p>
                Ao reservar o livro, ele ficará disponível para o aluno por um
                dia. Este livro pertence à instituição, portanto, o discente
                deve ter cuidado e devolvê-lo em perfeito estado. Após a
                reserva, o aluno terá uma semana para ler e devolver o
                livro. Em caso de atraso, será aplicada uma multa.
                <span>Só é possível reservar um exemplar por vez!</span>
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