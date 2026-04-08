import { createContext, useContext, useState, ReactNode } from "react";

export type CheckResult = "pass" | "fail" | "flag" | "block";

export interface AuditEntry {
  id: string;
  module: string;
  ruleId: string;
  input: string;
  result: string;
  statute: string;
  timestamp: string;
}

export interface CaslRecord {
  id: string;
  email: string;
  type: string;
  consentText: string;
  source: string;
  ip: string;
  purpose: string;
  hasUnsub: boolean;
  capturedAt: string;
  expiresAt: string;
  unsubscribed: boolean;
}

interface Metrics {
  total: number;
  pass: number;
  fail: number;
  flag: number;
  block: number;
}

interface AuditContextType {
  auditLog: AuditEntry[];
  metrics: Metrics;
  caslRecords: CaslRecord[];
  currentJurisdiction: string;
  setCurrentJurisdiction: (j: string) => void;
  logCheck: (entry: AuditEntry) => void;
  clearAudit: () => void;
  addCaslRecord: (r: CaslRecord) => void;
  unsubscribeCasl: (id: string) => void;
  computeScore: () => number | null;
}

const AuditContext = createContext<AuditContextType | null>(null);

let counter = 0;
export function uid() {
  return `CC-${Date.now().toString(36).toUpperCase()}-${(++counter).toString(36).toUpperCase()}`;
}

export function ts() {
  return new Date().toLocaleTimeString("en-CA", { hour12: false, hour: "2-digit", minute: "2-digit" });
}

export function AuditProvider({ children }: { children: ReactNode }) {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, pass: 0, fail: 0, flag: 0, block: 0 });
  const [caslRecords, setCaslRecords] = useState<CaslRecord[]>([]);
  const [currentJurisdiction, setCurrentJurisdiction] = useState("");

  const logCheck = (entry: AuditEntry) => {
    setAuditLog(prev => [entry, ...prev]);
    const r = entry.result.toLowerCase() as CheckResult;
    setMetrics(prev => ({
      total: prev.total + 1,
      pass: prev.pass + (r === "pass" ? 1 : 0),
      fail: prev.fail + (r === "fail" ? 1 : 0),
      flag: prev.flag + (r === "flag" ? 1 : 0),
      block: prev.block + (r === "block" ? 1 : 0),
    }));
  };

  const clearAudit = () => {
    setAuditLog([]);
    setMetrics({ total: 0, pass: 0, fail: 0, flag: 0, block: 0 });
  };

  const addCaslRecord = (r: CaslRecord) => {
    setCaslRecords(prev => [r, ...prev]);
  };

  const unsubscribeCasl = (id: string) => {
    setCaslRecords(prev => prev.map(r => r.id === id ? { ...r, unsubscribed: true } : r));
  };

  const computeScore = (): number | null => {
    if (metrics.total === 0) return null;
    const rawPct = Math.max(0, Math.round(((metrics.pass + metrics.flag * 0.5) / metrics.total) * 100));
    const blockPenalty = metrics.block > 0 ? Math.min(30, metrics.block * 15) : 0;
    return Math.max(0, rawPct - blockPenalty);
  };

  return (
    <AuditContext.Provider value={{
      auditLog, metrics, caslRecords, currentJurisdiction, setCurrentJurisdiction,
      logCheck, clearAudit, addCaslRecord, unsubscribeCasl, computeScore,
    }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within AuditProvider");
  return ctx;
}
