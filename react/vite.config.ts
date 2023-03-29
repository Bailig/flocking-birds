import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

if (!process.env.VITE_BIRD_TYPE) {
  process.env.VITE_BIRD_TYPE = "mutable";
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${process.env.VITE_BIRD_TYPE}`,
  build: {
    target: "esnext",
  },
});
