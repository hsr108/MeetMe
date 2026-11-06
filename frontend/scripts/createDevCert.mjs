// Creates a self-signed HTTPS certificate for the Vite dev server (frontend/certs/),
// valid for localhost and every current IPv4 address of this machine.
// Re-run whenever the PC's network IP changes:  npm run cert
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";

const certDir = fileURLToPath(new URL("../certs/", import.meta.url));

const localIPv4Addresses = () =>
  Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => address.address);

const ips = ["127.0.0.1", ...localIPv4Addresses()];
const subjectAltName = ["DNS:localhost", ...ips.map((ip) => `IP:${ip}`)].join(",");

mkdirSync(certDir, { recursive: true });
execFileSync(
  "openssl",
  [
    "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "825",
    "-keyout", `${certDir}dev-key.pem`,
    "-out", `${certDir}dev-cert.pem`,
    "-subj", "/CN=MeetMe dev",
    "-addext", `subjectAltName=${subjectAltName}`,
  ],
  { stdio: ["ignore", "ignore", "inherit"] }
);

console.log(`Dev certificate written to ${certDir}`);
ips.slice(1).forEach((ip) => console.log(`  Open on other devices: https://${ip}:5173`));
console.log("Restart the dev server to use it.");
