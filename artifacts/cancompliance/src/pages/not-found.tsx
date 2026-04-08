import { AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function NotFound() {
  return (
    <AppLayout title="404" subtitle="Page not found">
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="h-10 w-10 text-fail" />
        <h1 className="text-2xl font-bold text-foreground">404 — Page Not Found</h1>
        <p className="text-[13px] text-muted-foreground">This page doesn't exist. Use the sidebar to navigate to a compliance module.</p>
      </div>
    </AppLayout>
  );
}
