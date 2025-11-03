// assets/metObjects.js
(function () {
  const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

  // ---------- utils ----------
  const toInt = (n) => {
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  };

  const dedupeInts = (arr) =>
    Array.from(new Set((arr || []).map(toInt).filter(Number.isFinite)));

  const https = (url) => (url ? url.replace(/^http:\/\//, "https://") : "");

  const firstTruthy = (arr) => {
    for (const v of arr) if (v) return v;
    return "";
  };

  function withTimeout(fn, ms = 7000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fn(ctrl.signal).finally(() => clearTimeout(t));
  }

  // ---------- data fetch ----------
  async function fetchObjectDetails(objectId, signal) {
    const url = MET_BASE + objectId;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ---------- image helpers ----------
function fallbackImageHTML() {
  return `
    <div style="
      width:100%;
      height:140px;
      display:flex;
      align-items:top;
      justify-content:center;
      background:#f3f3f3;
      border-radius:6px;
      color:#777;
      font-size:10px;
      text-align:center;
      padding:8px;
      box-sizing:border-box;
    ">
      Oops! We didn’t find an image.<br>
      Wanna find the art and sketch it yourself?
    </div>
  `;
}

  function imageHTML(src, alt) {
    if (!src) return fallbackImageHTML();
    const safeAlt = alt ? String(alt).replace(/"/g, "&quot;") : "";
    return `<img src="${https(src)}" alt="${safeAlt}"
              style="width:100%;height:140px;object-fit:cover;border-radius:6px;" loading="lazy">`;
  }

  // ---------- card builder ----------
  function createObjectHTML(data) {
  const title = data.title || "Untitled";
  const metURL = data.objectURL ? https(data.objectURL) : (data.link ? https(data.link) : "");

  const imgSrc = firstTruthy([
    data.primaryImageSmall,
    data.primaryImage,
    Array.isArray(data.additionalImages) && data.additionalImages.length
      ? data.additionalImages[0]
      : ""
  ]);
  const img = imageHTML(imgSrc, title);

  // Moved checkbox under the image
  const imageBlock = `
    <div class="item-image">
      ${img}
      <div class="found-section" style="margin-top:10px;text-align:center;">
        <label style="display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;">
          <input type="checkbox" class="found-checkbox" style="width:20px;height:20px;">
          I found it!
        </label>
      </div>
    </div>
  `;

  // Right column now only has the notes box
  const rightCol = `
<div class="item-description">
  <label class="notes-label">My thoughts on this art:</label>
  <div class="notes-wrap">
    <textarea class="notes-textarea"></textarea>
  </div>
</div>
    `;

  return `
    <div class="hunt-item">
      ${imageBlock}
      <div class="item-details">
        <div class="item-core">
          <div class="item-title">
            ${
              metURL
                ? `<a href="${metURL}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">${title}</a>`
                : title
            }
          </div>
          <div class="item-location">Gallery ${data.GalleryNumber || "TBD"}</div>
          <div class="item-metadata">
            <p><strong>Artist:</strong> ${data.artistDisplayName || "Unknown"}${data.artistNationality ? ` (${data.artistNationality})` : ""}</p>
            <p><strong>Date:</strong> ${data.objectDate || "N/A"}</p>
            <!--<p><strong>Type:</strong> ${data.classification || "N/A"}</p>-->
            ${data.medium ? `<p><strong>Medium:</strong> ${data.medium}</p>` : ""}
            <!--${data.dimensions ? `<p><strong>Dimensions:</strong> ${data.dimensions}</p>` : ""}-->
          </div>
        </div>
        ${rightCol}
      </div>
    </div>`;
}
  

  // ---------- render from IDs (fetch Met API) ----------
  async function generateMetObjectsHTML(objectIds, { limit = 12 } = {}) {
    const ids = dedupeInts(objectIds).slice(0, limit);
    if (!ids.length) return "<div>No results.</div>";

    const settled = await Promise.allSettled(
      ids.map(id =>
        withTimeout((signal) => fetchObjectDetails(id, signal))
      )
    );

    const ok = settled
      .map(r => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean);

    if (!ok.length) return "<div>Unable to load objects.</div>";

    return ok.map(createObjectHTML).join("");
  }

  // ---------- render when backend already sent items ----------
  function renderMetItemsHTML(items) {
    const clean = (Array.isArray(items) ? items : [])
      .map(x => ({
        // allow either API shape or your backend’s mapped fields
        objectID: toInt(x.objectID),
        title: x.title,
        artistDisplayName: x.artistDisplayName || x.artist || null,
        artistNationality: x.artistNationality || null,
        objectDate: x.objectDate || x.date || null,
        classification: x.classification || null,
        medium: x.medium || null,
        dimensions: x.dimensions || null,
        GalleryNumber: x.GalleryNumber || x.gallery || null,
        primaryImageSmall: x.primaryImageSmall || x.image || null,
        primaryImage: x.primaryImage || null,
        additionalImages: x.additionalImages || [],
        objectURL: x.objectURL || x.link || null,
        objectWikidata_URL: x.objectWikidata_URL || null,
        accessionNumber: x.accessionNumber || null,
        creditLine: x.creditLine || null
      }))
      .filter(x => Number.isFinite(x.objectID));

    if (!clean.length) return "<div>No items.</div>";
    return clean.map(createObjectHTML).join("");
  }

  // expose for map.html
  window.generateMetObjectsHTML = generateMetObjectsHTML;
  window.renderMetItemsHTML = renderMetItemsHTML;
})();