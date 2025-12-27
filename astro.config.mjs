// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import path from "node:path";

import cloudflare from "@astrojs/cloudflare";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://agrotastingchallenge.fr/";
const tailwindPlugin = /** @type {any} */ (tailwindcss());

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: "/",
	integrations: [mdx(), sitemap()],
	// Cloudflare adapter auto-enables KV-backed sessions unless a driver is set.
	// This site doesn't currently use sessions, so keep it simple and avoid KV bindings.
	session: {
		driver: "memory",
	},
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	server: {
		port: 5200,
	},
	vite: {
		envPrefix: "PUBLIC_",
		plugins: [tailwindPlugin],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},
});
