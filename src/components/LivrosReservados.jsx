import React, { useEffect, useState } from "react";
import "./LivrosReservados.css";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const LivrosReservadosModal = ({ isOpen, onClose }) => {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReservas = async () => {
      try {
        const usuarioId = localStorage.getItem("usuarioId");
        if (!usuarioId) {
          throw new Error("Usuário não autenticado");
        }
        const response = await api.get(`/reserva/usuario/${usuarioId}`);
        setReservas(response.data);
      } catch (err) {
        setErro(
          err.response?.data?.message || err.message || "Erro ao carregar reservas"
        );
      } finally {
        setCarregando(false);
      }
    };

    fetchReservas();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Livros Reservados</h2>

        {carregando && <div className="loading">Carregando reservas...</div>}
        {erro && <div className="error-message">{erro}</div>}

        {!carregando && !erro && (
          <>
            {reservas.length === 0 ? (
              <p>Você não possui livros reservados.</p>
            ) : (
              reservas.map((reserva) => (
                <div key={reserva.idReserva} className="reserva-board">
                  <ul>
                    <li><strong>Título:</strong> {reserva.livro.titulo}</li>
                    <li><strong>Autor:</strong> {reserva.livro.autor}</li>
                    <li><strong>Ano:</strong> {reserva.livro.anoPublicado}</li>
                    <li><strong>Área:</strong> {reserva.livro.area}</li>
                  </ul>

                  <div className="status-reserva">
                    <h6>Status de Reserva</h6>
                    <h3 data-status={reserva.status}>
                      {reserva.status}
                    </h3>

                    {reserva.status === "RESERVADO" && (
                      <>
                        <p>Prazo para retirada:</p>
                        <p>{reserva.diasRestantes} dias úteis</p>
                      </>
                    )}

                    {reserva.status === "OK" && (
                      <>
                        <p>Prazo para devolução:</p>
                        <p>{reserva.diasRestantes} dias úteis</p>
                      </>
                    )}

                    {reserva.status === "ATRASADO" && (
                      <>
                        <p>Dias em atraso:</p>
                        <p>{reserva.diasEmAtraso} dias</p>
                      </>
                    )}

                    {reserva.status === "DEVOLVIDO" && (
                      <p>Livro devolvido.</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LivrosReservadosModal;
