# Country Explorer

A small, browser-based country browser that loads country data from the REST Countries API. It displays each country's flag, capital, region, population, and area.

## Features

- Search by country name or capital city
- Filter by region
- Sort by name, population, or area
- Responsive country cards

## Run locally

The API requires a browser origin that is allowed for your API key. Don't open `index.html` directly from the filesystem (`file://`), since browsers send that request with a `null` origin.

1. In `app.js`, set `API_KEY` to your REST Countries API key.
2. In your REST Countries API key settings, allow the hostname you'll use, such as `localhost`. Enter only the hostname—no protocol, port, or path.
3. Serve this folder over HTTP. For example, with Python installed:

   ```powershell
   python -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000).

Alternatively, use VS Code Live Server and allow `localhost` in your API key settings.

## API key safety

This is a static frontend, so any API key in `app.js` is visible to visitors. Do not publish a real key in a public repository or deploy this app with an unrestricted key. Restrict its allowed hostnames and usage in the REST Countries dashboard; for a public deployment, use a server-side proxy to keep the key off the client.

## Project files

- `index.html` — page structure and search/filter controls
- `app.js` — API request, data normalization, filtering, sorting, and rendering
- `style.css` — page and country-card styles

    