"use client";

import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />;
}

export function FullPageLoading({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-lg font-medium text-foreground">{message}</p>
    </div>
  );
}
