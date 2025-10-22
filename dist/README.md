# Freelancermatrix static site (Node.js)

This project serves the existing static site files (for example `index.html`) using a minimal Express server.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser. `index.html` will be served as the home page.

Developer

- Use `npm run dev` to start the server with `nodemon` for automatic restarts during development.

Netlify

- This repository includes a simple build step that copies the site into a `dist/` folder. Netlify is configured via `netlify.toml` to run `npm run build` and publish the `dist/` folder.

- To deploy on Netlify:

```bash
# from the project root
npm install
npm run build
# then push the repository to GitHub and connect the repo in Netlify. Netlify will run the same build and publish `dist/`.
```
