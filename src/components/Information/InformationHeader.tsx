interface InformationHeaderProps {
  mode: string;
  title: string;
}

export function InformationHeader({ mode, title }: InformationHeaderProps) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          color: "grey",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "4px",
        }}
      >
        {mode}
      </div>
      <h2 style={{ fontSize: "20px", margin: 0 }}>{title}</h2>
    </div>
  );
}
