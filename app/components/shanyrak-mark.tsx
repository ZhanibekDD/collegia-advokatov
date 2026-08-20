const JETISU_EMBLEM_URL =
  "https://upload.wikimedia.org/wikipedia/commons/f/f1/%D0%93%D0%B5%D1%80%D0%B1_%D0%96%D0%B5%D1%82%D1%8B%D1%81%D1%83%D1%81%D0%BA%D0%BE%D0%B9_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8.svg";

export function ShanyrakMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`jetisu-region-emblem ${className}`.trim()}
      role="img"
      aria-label="Эмблема области Жетісу"
      title="Эмблема области Жетісу"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        backgroundImage: `url(${JETISU_EMBLEM_URL})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "94% 94%",
        boxShadow: "0 0 0 1px rgba(197,155,85,.35)",
      }}
    />
  );
}
