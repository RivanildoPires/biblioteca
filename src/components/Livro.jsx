import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Livro.css";
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
  const [reservasUsuario, setReservasUsuario] = useState([]);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

  const fetchLivro = async () => {
    try {
      const response = await api.get(`/livro/${id}`);
      setLivro(response.data);
      setQuantidadeDisponivel(response.data.quantidade || 0);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Erro ao buscar o livro"
      );
    }
  };

  const fetchReservasUsuario = async (usuarioId) => {
    try {
      const response = await api.get(`/reserva/${usuarioId}`);
      setReservasUsuario(response.data);
    } catch (err) {
      console.error("Erro ao buscar reservas do usuário:", err);
    }
  };

  useEffect(() => {
    fetchLivro();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const usuarioId = userData?.id;

    if (usuarioId) {
      fetchReservasUsuario(usuarioId);
    }
  }, [id]);

  const handleReserva = async () => {
    setCarregando(true);
    setMensagem(null);

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const usuarioId = userData?.id;

      if (!usuarioId) {
        throw new Error("Você precisa estar logado para reservar livros");
      }

      if (!livro?.idLivro) {
        throw new Error("Livro não encontrado");
      }

      const isLivro6 = livro.idLivro === "6";

      if (!isLivro6 && quantidadeDisponivel <= 1) {
        throw new Error(
          "Não é possível reservar. Resta apenas 1 exemplar disponível."
        );
      }

      const reservasDoMesmoLivro = reservasUsuario.filter(
        (r) =>
          r.livro.idLivro === livro.idLivro && r.statusReserva !== "DEVOLVIDO"
      );

      if (reservasDoMesmoLivro.length >= 1) {
        throw new Error("Você já possui uma reserva ativa deste livro");
      }

      if (reservasUsuario.length >= 3) {
        throw new Error("Você já atingiu o limite de 3 reservas ativas");
      }

      const reservaData = {
        idUsuario: usuarioId,
        idLivro: livro.idLivro,
      };

      const response = await api.post("/reserva", reservaData);

      if (response.status === 201) {
        setMensagem("Reserva realizada com sucesso!");
        fetchLivro();
        fetchReservasUsuario(usuarioId);
      } else {
        throw new Error("Não foi possível completar a reserva");
      }
    } catch (err) {
      console.error("Erro na reserva:", err);
      setMensagem(
        err.response?.data?.message || err.message || "Erro ao reservar o livro"
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

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
              <ul>
                <li>Autor: {livro.autor}</li>
                <li>Publicado: {livro.anoPublicado}</li>
                <li>Editora: {livro.editora}</li>
                <li>Disponíveis: {quantidadeDisponivel}</li>
              </ul>
            </div>

            <div className="livro-sinopse">
              <div className="sinopse-content">
                <h5>Sinopse</h5>
                <p>{livro.sinopse}</p>
              </div>

              <button
                onClick={handleReserva}
                disabled={
                  carregando ||
                  (quantidadeDisponivel <= 1 && livro.idLivro !== "6")
                }
                className={carregando ? "loading-button" : ""}
              >
                {carregando ? "Processando..." : "Reservar"}
              </button>

              {mensagem && (
                <div
                  className={`mensagem ${
                    mensagem.includes("sucesso") ? "success" : "error"
                  }`}
                  role="alert"
                >
                  {mensagem.includes("sucesso") ? "✅" : "❌"} {mensagem}
                </div>
              )}

              {reservasUsuario.length > 0 && (
                <div className="reservas-info">
                  <p>
                    Você tem {reservasUsuario.length} livro(s) reservado(s) de
                    um máximo de 3.
                  </p>
                </div>
              )}
            </div>

            <div className="aviso">
              <h5>Atenção!</h5>
              <p>
                Ao reservar o livro, ele ficará disponível para o aluno por um
                dia. Este livro pertence à instituição, portanto, o discente
                deve ter cuidado e devolvê-lo em perfeito estado. Após a
                reserva, o aluno terá uma semana para ler e devolver o livro. Em
                caso de atraso, será aplicada uma multa.
                <span> Limite de 3 reservas por usuário!</span>
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
