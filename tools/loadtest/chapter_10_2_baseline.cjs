import autocannon from "autocannon";
import http from "node:http";

const BASE_URL = process.env.LOADTEST_BASE_URL || "http://localhost:3001";

function login(phone, password) {
  const body = JSON.stringify({ phone, password });

  return new Promise((resolve, reject) => {
    const req = http.request(
      `${BASE_URL}/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const token = parsed?.data?.tokens?.accessToken;
            if (!token) {
              reject(new Error(`Login failed for ${phone}: token missing`));
              return;
            }
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function runScenario(title, options) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== ${title} ===`);
    const instance = autocannon(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    autocannon.track(instance, {
      renderProgressBar: true,
      renderResultsTable: true,
      renderLatencyTable: true,
    });
  });
}

function summarize(name, result) {
  return {
    name,
    requestsAverage: result.requests.average,
    requestsP95: result.requests.p95,
    latencyAverageMs: result.latency.average,
    latencyP95Ms: result.latency.p95,
    latencyMaxMs: result.latency.max,
    errors: result.errors,
    timeouts: result.timeouts,
    non2xx: result.non2xx,
  };
}

(async () => {
  const adminToken = await login("+255700000001", "Pass123!");
  const affiliateToken = await login("+255700000004", "Pass123!");

  const scenarios = [];

  scenarios.push(
    summarize(
      "health",
      await runScenario("GET /v1/health", {
        url: `${BASE_URL}/v1/health`,
        method: "GET",
        connections: 10,
        duration: 30,
      })
    )
  );

  scenarios.push(
    summarize(
      "affiliate-orders",
      await runScenario("GET /v1/affiliate/orders?page=1&pageSize=20", {
        url: `${BASE_URL}/v1/affiliate/orders?page=1&pageSize=20`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${affiliateToken}`,
        },
        connections: 10,
        duration: 30,
      })
    )
  );

  scenarios.push(
    summarize(
      "order-timeline",
      await runScenario("GET /v1/orders/order_customer_a/timeline", {
        url: `${BASE_URL}/v1/orders/order_customer_a/timeline`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        connections: 10,
        duration: 30,
      })
    )
  );

  scenarios.push(
    summarize(
      "admin-audit",
      await runScenario("GET /v1/admin/audit?page=1&pageSize=20", {
        url: `${BASE_URL}/v1/admin/audit?page=1&pageSize=20`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        connections: 10,
        duration: 30,
      })
    )
  );

  console.log("\n=== LOAD TEST SUMMARY JSON ===");
  console.log(JSON.stringify({ scenarios }, null, 2));

  const failures = scenarios.filter((s) => s.errors > 0 || s.timeouts > 0 || s.non2xx > 0);
  if (failures.length > 0) {
    console.error("\nLOAD TEST FAILED: non-zero errors/timeouts/non2xx detected");
    process.exit(1);
  }

  console.log("\nLOAD TEST PASS: zero errors, zero timeouts, zero non-2xx responses");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
