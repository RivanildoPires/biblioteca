import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MeuPerfil from "./MeuPerfil";
import CadastrarUsuario from "./CadastrarUsuario";
import cadastroU from "../assets/cadastroU.png";
import CadastrarLivro from "./CadastrarLivro";
import LivrosReservados from "./LivrosReservados";

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);
  }, []);

  const openModalHandler = (type) => {
    setModalType(type);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setModalType("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div>
      <header>
        <nav className="nav-bar">
          <div className="navbar-inner">
            <div className="navbar-top">
              <Link to={"/telaInicial"}>
                <img src={logo} alt="logo-biblioteca" />
              </Link>

              {userData && (
                <h3 className="bem-vindo">Bem-vindo, {userData.nome}</h3>
              )}

              <ul className="list">
                {userData?.tipo === "BIBLIOTECARIO" && (
                  <li>
                    <img
                      className="livro-img"
                      src={cadastroU}
                      alt="cadastroU"
                    />
                    <button onClick={() => openModalHandler("cadastrar")}>
                      Cadastrar <br />
                      Usuário
                    </button>
                    {modalType === "cadastrar" && (
                      <CadastrarUsuario
                        isOpen={openModal}
                        onClose={closeModalHandler}
                      />
                    )}
                  </li>
                )}

                {userData?.tipo === "BIBLIOTECARIO" && (
                  <li>
                    <img className="livro-img" src={livro} alt="addlivro" />
                    <button onClick={() => openModalHandler("livro")}>
                      Adicionar <br />
                      Material
                    </button>
                    {modalType === "livro" && (
                      <CadastrarLivro
                        isOpen={openModal}
                        onClose={closeModalHandler}
                      />
                    )}
                  </li>
                )}

                <li>
                  <img className="livro-img" src={livro} alt="livrinho" />
                  <button onClick={() => openModalHandler("livros")}>
                    Livros <br />
                    Reservados
                  </button>
                  {modalType === "livros" && (
                    <LivrosReservados
                      isOpen={openModal}
                      onClose={closeModalHandler}
                    />
                  )}
                </li>

                <li>
                  <img className="usuario-img" src={usuario} alt="usuario" />
                  <button onClick={() => openModalHandler("perfil")}>
                    Meu <br />
                    Perfil
                  </button>
                  {modalType === "perfil" && (
                    <MeuPerfil isOpen={openModal} onClose={closeModalHandler} />
                  )}
                </li>

                <li>
                  <button onClick={handleLogout} className="logout-button">
                    <img className="sair-img" src={sair} alt="sair" />
                  </button>
                </li>
              </ul>
            </div>

            <hr />

            <table className="table">
              <tr>
                <Link to={"/livros"}>
                  <th>Livros</th>
                </Link>
                <Link to={"/livrosPublicos"}>
                <th>Livros Públicos</th>
                </Link>
                <Link to={"/tcc"}>
                  <th>TCC</th>
                </Link>
                <Link to={"/material"}>
                  <th>Material Acadêmico</th>
                </Link>
              </tr>
            </table>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
