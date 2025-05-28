import React, { useState } from "react";
import "./MeuPerfil.css";
import LopeLindo from "../assets/LopeLindo.jpg";
import fotinha from "../assets/foto.png";
import MacianoYasuo from "../assets/MacianoYasuo.jpg";

const MeuPerfil = ({ isOpen, onClose }) => {
  const[nome, setNome] = useState("");
  const[email, setEmail] = useState("");
  const[telefone, setTelefone] = useState("");


  if (isOpen) {
    return (
      <div className="container-modal">
        <div className="conteudo">
          <div className="btn-close">
            <button onClick={onClose}>X</button>
          </div>
          <div className="cont-info">
            <img src={MacianoYasuo} alt="" />
            <div className="form-container">
              <p className="text">Alterar Perfil</p>
              <form>
                <input type="text" value={nome}/>
                <input type="text" value={email}/>
                <input type="text" value={telefone} />
              </form>
              <div className="send">
                <button>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MeuPerfil;
