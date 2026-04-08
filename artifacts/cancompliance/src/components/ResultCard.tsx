import { CheckCircle, XCircle, AlertTriangle, ShieldAlert } from "lucide-react";

type ResultType = "pass" | "fail" | "flag" | "block";

interface MetaRow {
  label: string;
  val: string | number;
}

interface ResultCardProps {
  result: ResultType;
  title: string;
  statute: string;
  action: string;
  meta?: MetaRow[];
}

const COLORS: Record<ResultType, string> = {
  pass: "var(--green)",
  fail: "var(--red)",
  flag: "var(--amber)",
  block: "var(--red)",
};

const ICONS: Record<ResultType, React.FC<{ size?: number; color?: string }>> = {
  pass: ({ size, color }) => <CheckCircle size={size} color={color} />,
  fail: ({ size, color }) => <XCircle size={size} color={color} />,
  flag: ({ size, color }) => <AlertTriangle size={size} color={color} />,
  block: ({ size, color }) => <ShieldAlert size={size} color={color} />,
};

export default function ResultCard({ result, title, statute, action, meta }: ResultCardProps) {
  const color = COLORS[result];
  const Icon = ICONS[result];

  return (
    <div style={{
      marginTop: 24,
      border: `1px solid ${color}44`,
      borderRadius: 10,
      background: `${color}08`,
      padding: "20px 22px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5, fontStyle: "italic" }}>{statute}</div>
        </div>
      </div>

      <div
        style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.7, marginBottom: meta && meta.length ? 16 : 0 }}
        dangerouslySetInnerHTML={{ __html: action }}
      />

      {meta && meta.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 8,
          borderTop: "1px solid var(--border)",
          paddingTop: 14,
          marginTop: 4,
        }}>
          {meta.map((m, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "var(--text1)", fontFamily: "var(--mono)" }}>{m.val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
