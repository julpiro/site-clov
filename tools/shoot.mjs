// Full-page screenshot via Chrome DevTools Protocol (Node 23 global fetch + WebSocket).
import { writeFileSync } from "node:fs";

const target = process.argv[2] || "http://localhost:8081/";
const out = process.argv[3] || "/tmp/full.png";
const width = parseInt(process.argv[4] || "1440", 10);

const targets = await (await fetch("http://localhost:9222/json")).json();
const page = targets.find((t) => t.type === "page") || targets[0];
const wsUrl = page.webSocketDebuggerUrl;
const ws = new WebSocket(wsUrl);
let id = 0;
const pending = new Map();
function send(method, params) {
  return new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params: params || {} }));
  });
}
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
};

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
await send("Page.navigate", { url: target });
await new Promise((r) => setTimeout(r, 3500));
const metrics = await send("Page.getLayoutMetrics");
const h = Math.ceil(metrics.cssContentSize.height);
const res = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height: h, scale: 1 }
});
writeFileSync(out, Buffer.from(res.data, "base64"));
console.log("Saved", out, width + "x" + h);
ws.close();
process.exit(0);
