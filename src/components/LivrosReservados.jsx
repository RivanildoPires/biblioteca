import React, { useEffect, useState } from "react";
import "./LivrosReservados.css";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const LivrosReservados = ({ isOpen, onClose }) => {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReservas = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const usuarioId = userData?.id;

        if (!usuarioId) {
          throw new Error("Usuário não autenticado");
        }

        const response = await api.get(`/reserva/${usuarioId}`);
        setReservas(response.data);
      } catch (err) {
        setErro(
          err.response?.data?.message ||
            err.message ||
            "Erro ao carregar reservas"
        );
      } finally {
        setCarregando(false);
      }
    };

    fetchReservas();
  }, [isOpen]);

  if (!isOpen) return null;

 
  const calcularDiferencaDias = (dataDevolucao) => {
    if (!dataDevolucao) return null;

    const agora = new Date();
    const devolucao = new Date(dataDevolucao);

    const diffTime = devolucao - agora;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDias;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="btn-close">
          <button onClick={onClose}>✕</button>
        </div>
        <h2>Livros Reservados</h2>

        {carregando && <div className="loading">Carregando reservas...</div>}
        {erro && <div className="error-message">{erro}</div>}

        {!carregando && !erro && (
          <>
            {reservas.length === 0 ? (
              <p>Você não possui livros reservados.</p>
            ) : (
              reservas.map((reserva) => {
                const diffDias = calcularDiferencaDias(reserva.dataDevolucao);

                return (
                  <div key={reserva.idReserva} className="reserva-board">
                    <ul>
                      <li>
                        <strong>Título:</strong>{" "}
                        {reserva.livro?.titulo || "N/A"}
                      </li>
                      <li>
                        <strong>Autor:</strong>{" "}
                        {reserva.livro?.autor || "N/A"}
                      </li>
                      <li>
                        <strong>Ano:</strong>{" "}
                        {reserva.livro?.anoPublicado || "N/A"}
                      </li>
                      <li>
                        <strong>Área:</strong>{" "}
                        {reserva.livro?.area || "N/A"}
                      </li>
                    </ul>

                    <div className="status-reserva">
                      <div className="status-h6">
                      <h6>Status de Reserva</h6>
                      </div>
                      <h3 data-status={reserva.statusReserva}>
                        {reserva.statusReserva}
                      </h3>

                      {reserva.statusReserva === "RESERVADO" && (
                        <>
                          <p>Prazo para retirada:</p>
                          <p>
                            {diffDias > 0 ? diffDias : 0} dias úteis
                          </p>
                        </>
                      )}

                      {reserva.statusReserva === "OK" && (
                        <>
                          <p>Prazo para devolução:</p>
                          <p>
                            {diffDias > 0 ? diffDias : 0} dias úteis
                          </p>
                        </>
                      )}

                      {reserva.statusReserva === "ATRASADO" && (
                        <>
                          <p>Dias em atraso:</p>
                          <p>
                            {diffDias < 0 ? Math.abs(diffDias) : 0} dias
                          </p>
                        </>
                      )}

                      {reserva.statusReserva === "DEVOLVIDO" && (
                        <p>Livro devolvido.</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LivrosReservados;
