const http = require("http");

const html = `
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Mimo API</title></head>
  <body>
    <h1>Mimo Laundry OS API</h1>
    <p>Swagger placeholder endpoint is planned for Chapter 5.1.</p>
    <p>Health: OK</p>
  </body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === "/swagger" || req.url === "/api") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not found" }));
});

server.listen(3001, () => {
  console.log("Mimo API placeholder running on http://localhost:3001");
  console.log("Swagger placeholder on http://localhost:3001/swagger");
});
