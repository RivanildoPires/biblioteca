import "./LivrosReservados.css";

const LivrosReservados = () => {
  return (
    <div className="container-reserva">
      <h2>Status de Reserva</h2>
      
      <div className="reserva-board">
        <ul>
          <li>Título: Design Pattern com Java</li>
          <li>Autor: Casa do Código - Alura</li>
          <li>Ano: 2001</li>
          <li>Área: Programação em Java</li>
        </ul>

        <div className="status-reserva">
          <h6>Status de Reserva</h6>
          <h3 data-status="RESERVADO">(RESERVADO)</h3>
          <p>Prazo para retirada:</p>
          <p>2 Dias úteis</p>
        </div>
      </div>

      <div className="reserva-board">
        <ul>
          <li>Título: Clean Code</li>
          <li>Autor: Robert Cecil Martin</li>
          <li>Ano: Edição padrão, 8 setembro 2009</li>
          <li>Área: Habilidades Práticas do Agile Software</li>
        </ul>

        <div className="status-reserva">
          <h6>Status de Reserva</h6>
          <h3 data-status="OK">OK</h3>
          <p>Prazo para devolução:</p>
          <p>7 Dias úteis</p>
        </div>
      </div>

      <div className="reserva-board">
        <ul>
          <li>Título: Clean Code</li>
          <li>Autor: Robert Cecil Martin</li>
          <li>Ano: Edição padrão, 8 setembro 2009</li>
          <li>Área: Habilidades Práticas do Agile Software</li>
        </ul>

        <div className="status-reserva">
          <h6>Status de Reserva</h6>
          <h3 data-status="Em Atraso">Em Atraso</h3>
          <p>Dias em atraso:</p>
          <p>2 dias</p>
        </div>
      </div>
    </div>
  );
};

export default LivrosReservados;