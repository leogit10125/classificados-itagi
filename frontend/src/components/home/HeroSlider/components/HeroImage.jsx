import "./HeroImage.css";

function HeroImage({ imagem, titulo }) {
  return (
    <div className="hero-image">
      <img
        src={imagem}
        alt={titulo}
        loading="lazy"
      />
    </div>
  );
}

export default HeroImage;