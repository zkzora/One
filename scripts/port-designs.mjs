/**
 * Re-ports every Claude Design export into React.
 *
 * Run this after re-exporting from the design tool. The generated files are
 * overwritten wholesale, so never hand-edit them — change the design, or change
 * the converter.
 */
import { execFileSync } from "node:child_process";

const OUT = "apps/web/src/generated";

const JOBS = [
  // The shell (banner, header, footer) is taken from the landing export and
  // shared by every route, so the nav only exists in one place.
  ["One Landing v2.dc.html", `${OUT}/chrome.tsx`, "Chrome", "chrome"],
  ["One Landing v2.dc.html", `${OUT}/landing.tsx`, "Landing", "main"],
  ["One Marketplace v2.dc.html", `${OUT}/marketplace.tsx`, "Marketplace", "main"],
  ["One Dashboard v2.dc.html", `${OUT}/dashboard.tsx`, "Dashboard", "main"],
  // Registration is lifted out of the dashboard onto its own route.
  ["One Dashboard v2.dc.html", `${OUT}/register.tsx`, "Register", "register"],
];

for (const args of JOBS) {
  execFileSync("node", ["scripts/dc-to-react.mjs", ...args], {
    stdio: "inherit",
  });
}
