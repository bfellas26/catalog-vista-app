// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Read from .env, or use default local Firebase emulator target
  const apiBaseUrl = env.VITE_API_BASE_URL || "http://127.0.0.1:5001/digital-catalog-saas/us-central1/api";
  let backendOrigin = "http://127.0.0.1:5001";
  try {
    backendOrigin = new URL(apiBaseUrl).origin;
  } catch (e) {
    // fallback if URL parsing fails
  }

  return {
    vite: {
      server: {
        port: 9080,
        proxy: {
          "/digital-catalog-saas": {
            target: backendOrigin,
            changeOrigin: true,
            secure: false,
          },
          "/api-proxy": {
            target: apiBaseUrl,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api-proxy/, ""),
          },
        },
      },
    },
    tanstackStart: {
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
    },
  };
});
