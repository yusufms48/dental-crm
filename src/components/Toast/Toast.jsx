export default function Toast({ message, type }) {
  const colors = {
    success: { bg: "#22c55e", icon: "✓" },
    error: { bg: "#ef4444", icon: "✕" },
    info: { bg: "#38bdf8", icon: "ℹ" },
  };

  const { bg, icon } = colors[type] || colors.success;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium"
      style={{ backgroundColor: bg }}
    >
      <span className="text-lg">{icon}</span>
      {message}
    </div>
  );
}
