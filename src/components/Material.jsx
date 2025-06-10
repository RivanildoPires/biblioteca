import { useEffect, useState } from "react";
import Header from "./Header";
import "./ListarTCC.css";
import "./Footer2.css";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

const areas = [
  { label: "Ciências da Computação", value: "computacao" },
  { label: "Direito", value: "direito" },
  { label: "Educação Física", value: "edfisica" },
  { label: "Marketing", value: "marketing" },
  { label: "Matemática", value: "matematica" },
];

const Material = () => {
  const [materiais, setMateriais] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const response = await api.get("/materialacademico");
        setMateriais(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar materiais. Tente novamente mais tarde.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchMateriais();
  }, []);

  const handleAreaClick = (area) => {
    setSelectedArea((prev) => (prev === area ? "" : area));
  };

  const filteredMateriais = selectedArea
    ? materiais.filter(
        (mat) =>
          mat.area && mat.area.toLowerCase() === selectedArea.toLowerCase()
      )
    : materiais;

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
            {areas.map((area) => (
              <li
                key={area.value}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedArea === area.value ? "bold" : "normal",
                }}
                onClick={() => handleAreaClick(area.value)}
              >
                {area.label}
              </li>
            ))}
          </ul>
        </aside>
        <div className="container-main">
          <main className="main-content">
            <section className="section-tcc">
              {loading ? (
                <p>Carregando materiais...</p>
              ) : error ? (
                <p>{error}</p>
              ) : filteredMateriais.length === 0 ? (
                <p>Nenhum material encontrado para esta área.</p>
              ) : (
                filteredMateriais.map((mat) => (
                  <div className="tcc" key={mat.idMaterialAcademico}>
                    <h3>{mat.titulo}</h3>
                    <div className="line"></div>
                    <h5>Autor: {mat.autor}</h5>
                    <h5>Área: {mat.area}</h5>
                    <div className="tcc-disc">
                      <p>{mat.sinopse}</p>
                    </div>
                    <a
                      href={mat.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="download">Baixar PDF</button>
                    </a>
                  </div>
                ))
              )}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Material;
