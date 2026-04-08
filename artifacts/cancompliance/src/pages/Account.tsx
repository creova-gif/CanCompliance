import { useState } from "react";
import { useUser } from "@clerk/react";
import { Download, Trash2, Shield, User, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLocation } from "wouter";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Account() {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [, setLocation] = useLocation();

  const handleExport = async () => {
    const [historyRes, auditRes] = await Promise.all([
      fetch(`${API_BASE}/api/compliance/history`, { credentials: "include" }),
      fetch(`${API_BASE}/api/compliance/audit-log`, { credentials: "include" }),
    ]);
    const history = await historyRes.json();
    const auditLog = await auditRes.json();

    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      complianceChecks: history,
      auditLog,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cancompliance-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/api/compliance/account`, {
        method: "DELETE",
        credentials: "include",
      });
      setDeleted(true);
      setTimeout(() => setLocation("/"), 2000);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <AppLayout title="Account" subtitle="Privacy, data, and your rights">
      <div className="max-w-2xl space-y-6">

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Your account</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground font-mono text-xs">{user?.primaryEmailAddress?.emailAddress ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">User ID</span>
              <span className="text-foreground font-mono text-xs">{user?.id?.slice(0, 20) ?? "—"}…</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Member since</span>
              <span className="text-foreground font-mono text-xs">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-CA") : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-4 h-4" style={{ color: "#c8f135" }} />
            <span className="text-sm font-semibold text-foreground">Your data rights (PIPEDA + Law 25)</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">You have the right to access, export, and permanently delete all data we hold about you.</p>

          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm font-medium text-foreground mb-1">Export your data</div>
              <p className="text-xs text-muted-foreground mb-3">Download all your compliance check history and audit log as a JSON file.</p>
              <button
                data-testid="btn-export-data"
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors text-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                Export data
              </button>
            </div>

            <div className="border border-red-500/20 rounded-lg p-4">
              <div className="text-sm font-medium text-foreground mb-1">Delete all your data</div>
              <p className="text-xs text-muted-foreground mb-3">
                Permanently deletes all compliance checks, AI conversations, and audit logs associated with your account. This cannot be undone.
              </p>

              {deleted ? (
                <div className="text-sm" style={{ color: "#c8f135" }}>All data deleted. Redirecting…</div>
              ) : showConfirm ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    This will permanently delete all your compliance data and AI conversations.
                  </div>
                  <div className="flex gap-2">
                    <button
                      data-testid="btn-confirm-delete"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting ? "Deleting…" : "Yes, delete everything"}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  data-testid="btn-delete-data"
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete all data
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href={`${API_BASE === "" ? "/" : API_BASE}/privacy-policy`} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
            Read our Privacy Policy
          </a>
        </div>

      </div>
    </AppLayout>
  );
}
