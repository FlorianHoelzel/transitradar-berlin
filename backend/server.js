import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }

    next();
});

app.get("/health", async (_request, response, next) => {
    try {
        response.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

app.use(express.static(projectRoot));

app.get("/", (_request, response) => {
    response.sendFile(path.join(projectRoot, "index.html"));
});

app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
        error: "Internal server error."
    });
});

app.listen(port, () => {
    console.log(`TransitRadar backend listening on http://localhost:${port}`);
});
