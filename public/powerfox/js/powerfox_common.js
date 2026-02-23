/* powerfox_common.js
   Gemeinsame Helfer für:
   - Auth (credentials) / 401-Handling
   - DemoMode Umschaltung (global via localStorage.demoMode)
   - Devices laden (API oder Demo)
   - Demo-Dateipfade (HT/NT Tagesdateien)
   Nutzung (in HTML):
     <script src="js/powerfox_common.js"></script>
   Dann im Page-Script:
     const demo = PF.isDemoMode();
*/

(function (global) {
  "use strict";

  const PF = {};

  // ---------------------------
  // Konfiguration
  // ---------------------------
  PF.API_BASE = "https://backend.powerfox.energy/api/2.0";
  PF.STORAGE = {
    credentials: "credentials",
    devices: "devices",
    demoMode: "demoMode",
    demoDeviceId: "demoDeviceId"
  };

  // Wichtig: In deinem Repo existiert der Ordner "public/powerfox/demo/Stromzähler/..."
  // (Case-Sensitive auf manchen Hosts!)
  PF.DEMO = {
    // Basispfad relativ zur powerfox-Seite (weil HTML unter /powerfox/ liegt)
    basePath: "demo",
    // Default deviceId für Demo, passend zu deinen Dateien
    defaultDeviceId: "Stromzähler",
    // Tages-HT/NT-Dateien liegen aktuell direkt unter demo/<deviceId>/YYYY-MM-DD.json
    htntDayPath: (deviceId, yyyy_mm_dd) => `demo/${encodeURIComponent(deviceId)}/${yyyy_mm_dd}.json`,
    // optional: falls du später Demo-devices.json anlegen willst
    devicesPath: "demo/devices.json"
  };

  // ---------------------------
  // DemoMode / Auth State
  // ---------------------------
  PF.isDemoMode = function () {
    return localStorage.getItem(PF.STORAGE.demoMode) === "1";
  };

  PF.enableDemoMode = function () {
    localStorage.setItem(PF.STORAGE.demoMode, "1");
  };

  PF.disableDemoMode = function () {
    localStorage.removeItem(PF.STORAGE.demoMode);
    localStorage.removeItem(PF.STORAGE.demoDeviceId);
  };

  PF.getCredentials = function () {
    return localStorage.getItem(PF.STORAGE.credentials);
  };

  PF.hasLiveCredentials = function () {
    return !!PF.getCredentials();
  };

  PF.getAuthHeader = function () {
    const creds = PF.getCredentials();
    return { Authorization: `Basic ${creds}` };
  };

  // Wenn Live-Modus und nicht angemeldet: redirect
  PF.requireAuthIfLive = function (redirectTo = "index.html") {
    if (PF.isDemoMode()) return true;
    if (PF.hasLiveCredentials()) return true;
    alert("Nicht angemeldet.");
    window.location.href = redirectTo;
    return false;
  };

  // Logout / "Session" beenden
  PF.logout = function (redirectTo = "index.html") {
    localStorage.removeItem(PF.STORAGE.credentials);
    localStorage.removeItem(PF.STORAGE.devices);
    PF.disableDemoMode(); // optional: wenn du Logout auch Demo beenden willst
    window.location.href = redirectTo;
  };

  // ---------------------------
  // Helpers (Datum / Format)
  // ---------------------------
  PF.pad2 = function (n) {
    return n < 10 ? "0" + n : "" + n;
  };

  PF.formatYYYYMMDD_local = function (d) {
    // Lokalzeit → YYYY-MM-DD
    return `${d.getFullYear()}-${PF.pad2(d.getMonth() + 1)}-${PF.pad2(d.getDate())}`;
  };

  // ---------------------------
  // Fetch Helfer
  // ---------------------------
  PF.fetchJSON = async function (url, opts = {}) {
    const r = await fetch(url, opts);
    // Standard: 401/403 = credentials invalid → zurück zu index
    if (r.status === 401 || r.status === 403) {
      localStorage.removeItem(PF.STORAGE.credentials);
      if (!PF.isDemoMode()) window.location.href = "index.html";
      throw new Error("Unauthorized");
    }
    if (!r.ok) {
      throw new Error("HTTP " + r.status);
    }
    return r.json();
  };

  PF.fetchAPI = async function (path, opts = {}) {
    // path kann full url sein oder "/my/all/devices" etc.
    const isFull = /^https?:\/\//i.test(path);
    const url = isFull ? path : PF.API_BASE + path;

    if (PF.isDemoMode()) {
      throw new Error("fetchAPI called in demoMode: " + url);
    }
    if (!PF.hasLiveCredentials()) {
      throw new Error("No credentials");
    }
    const headers = Object.assign({}, opts.headers || {}, PF.getAuthHeader());
    return PF.fetchJSON(url, Object.assign({}, opts, { headers }));
  };

  // ---------------------------
  // Devices
  // ---------------------------
  PF.getSelectedDemoDeviceId = function () {
    return localStorage.getItem(PF.STORAGE.demoDeviceId) || PF.DEMO.defaultDeviceId;
  };

  PF.setSelectedDemoDeviceId = function (id) {
    localStorage.setItem(PF.STORAGE.demoDeviceId, id);
  };

  PF.loadDevices = async function () {
    // Einheitliche Rückgabe: Array von Objekten mit DeviceId
    if (PF.isDemoMode()) {
      // Demo: entweder devices.json (falls vorhanden) oder fallback auf einen "virtuellen" Eintrag
      try {
        const dev = await PF.fetchJSON(PF.DEMO.devicesPath, { cache: "no-store" });
        if (Array.isArray(dev) && dev.length) return dev;
      } catch (_) {
        // ignore, fallback below
      }
      return [{ DeviceId: PF.getSelectedDemoDeviceId(), DeviceType: "demo" }];
    }

    // Live
    return PF.fetchAPI("/my/all/devices");
  };

  PF.loadDevicesIntoSelect = async function (selectEl, { onChange } = {}) {
    selectEl.innerHTML = "<option>Lade Geräte...</option>";
    let dev = [];
    try {
      dev = await PF.loadDevices();
    } catch (e) {
      selectEl.innerHTML = '<option value="">Fehler beim Laden</option>';
      throw e;
    }

    if (!Array.isArray(dev) || dev.length === 0) {
      selectEl.innerHTML = '<option value="">Keine Geräte</option>';
      return { devices: [], selectedDeviceId: null };
    }

    selectEl.innerHTML = dev
      .map(d => `<option value="${d.DeviceId}">${d.DeviceId}${d.DeviceType ? " - " + d.DeviceType : ""}</option>`)
      .join("");

    let selected = dev[0].DeviceId;
    if (PF.isDemoMode()) selected = PF.getSelectedDemoDeviceId();

    selectEl.value = selected;

    selectEl.onchange = (e) => {
      const id = e.target.value;
      if (PF.isDemoMode()) PF.setSelectedDemoDeviceId(id);
      if (typeof onChange === "function") onChange(id);
    };

    return { devices: dev, selectedDeviceId: selected };
  };

  // ---------------------------
  // Demo Daten: HT/NT Tagesdatei laden
  // ---------------------------
  PF.loadDemoHtntDay = async function ({ deviceId, yyyy_mm_dd }) {
    const path = PF.DEMO.htntDayPath(deviceId, yyyy_mm_dd);
    return PF.fetchJSON(path, { cache: "no-store" });
  };

  // Expose global
  global.PF = PF;
})(window);
