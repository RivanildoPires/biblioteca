import Header from "./Header";
import "./ListarTCC.css"
import Footer from "./Footer";

const Material = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <aside className="categories">
          <h4>Material</h4>
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
            <section className="section-tcc">
              <div className="tcc">
                <h3>Questões de calculo 1</h3>
                <h5>Autor: </h5>
                <h5>Publicado: </h5>
                <div className="tcc-disc">
                  <p>
                    Introducao ao cálculo, focando em limites, derivadas e a introdução básica das integrais, com algumas aplicações práticas.
                  </p>
                </div>

                <button className="download">Baixar PDF</button>
              </div>
              <div className="tcc"></div>
              <div className="tcc"></div>
            </section>
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Material;
