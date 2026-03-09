const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get("/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const parsed = new URL(target);

    // Safety: only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).send("Only http/https URLs are allowed");
    }

    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": req.get("user-agent") || "Mozilla/5.0"
      }
    });

    const contentType = upstream.headers.get("content-type") || "";
    const body = await upstream.arrayBuffer();

    res.status(upstream.status);

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Allow your iframe app to try rendering proxied content
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");

    res.send(Buffer.from(body));
  } catch (err) {
    res.status(500).send("Proxy error: " + String(err));
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
