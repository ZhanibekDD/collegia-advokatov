const JETISU_EMBLEM_URL = "/logo-placeholder.svg";

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
