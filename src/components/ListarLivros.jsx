import React, { useState, useEffect } from "react";
import "./ListarLivros.css";
import logo from "../assets/logo.png";
import livro from "../assets/livro.png";
import usuario from "../assets/usuario.png";
import sair from "../assets/sair.png";
import java from "../assets/java.png";
import { Link } from "react-router-dom";
import clean from "../assets/clean.png";
import mil from "../assets/mil.png";

const ListarLivros = () => {
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
                <th>TCC</th>
                <th>Material Acadêmico</th>
              </tr>
            </table>
          </div>
        </nav>
      </header>

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
          <section className="section-livros">
            <div className="livro">
              <img src={java} alt="" /> <h5>Designer Patterns</h5>
            </div>
            <div className="livro">
              <img src={clean} alt="" /> <h5>Clean Code</h5>
            </div>
            <div className="livro">
              <img src={mil} alt="" /> <h5>Mil ao Milhão</h5>
            </div>
          </section>
        </main>
      </div>
      <footer>
        <h3>
          Faculdade Católica da Paraíba. © 2025 - Todos os direitos reservados.
        </h3>
      </footer>
    </div>
  );
};

export default ListarLivros;
