import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <header>
        <nav className="nav-bar">
          <div className="navbar-inner">
            <div className="navbar-top">
              <Link to={"/"}>
                <img src={logo} alt="logo-biblioteca" />
              </Link>

              <form className="form">
                <input type="text" placeholder="Buscar..." />
              </form>
              <ul className="list">
                <li>
                  <img className="livro-img" src={livro} alt="livrinho" />
                  <a href="#">
                    Livros <br />
                    Reservado
                  </a>
                </li>
                <li>
                  <img className="usuario-img" src={usuario} alt="usuario" />{" "}
                  <a href="#">
                    Meu <br />
                    Perfil
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img className="sair-img" src={sair} alt="" />
                  </a>
                </li>
              </ul>
            </div>
            <hr />
            <table className="table">
              <tr>
                <Link to={"/livros"}>
                  <th>Livros</th>
                </Link>
                <th>Artigos</th>
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
