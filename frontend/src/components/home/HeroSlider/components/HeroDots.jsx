import "./HeroDots.css";

function HeroDots({ total, current, onChange }) {
  if (!total || total <= 1) return null;

  return (
    <div className="hero-dots">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={`hero-dot ${index === current ? "active" : ""}`}
          onClick={() => onChange(index)}
          aria-label={`Slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default HeroDots;