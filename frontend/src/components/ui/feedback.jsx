import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "white",
          color: "var(--dark)",
          border: "1px solid #e5e7eb",
          borderRadius: "var(--radius)",
        },
      }}
    />
  );
}
