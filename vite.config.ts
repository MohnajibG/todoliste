import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ou ce que tu utilises
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
