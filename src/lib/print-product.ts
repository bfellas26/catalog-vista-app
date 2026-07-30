import { formatINR, brandMark, type Jewel } from "@/lib/jewellery-data";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function printProduct(product: Jewel, onlyCatalogue: boolean = false) {
  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) return;

  // Build all images grid
  const imageGrid = product.images
    .map(
      (src, idx) =>
        `<div class="imgwrap${idx === 0 ? " main" : ""}"><img src="${src}" alt="${escape(product.name)} ${idx + 1}"/></div>`,
    )
    .join("");

  const html = `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>${escape(product.name)} — Lumière Jewels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:#faf6f1;color:#3a1f2d;font-family:'Inter',system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{max-width:820px;margin:0 auto;padding:48px 56px;min-height:100vh;background:#faf6f1;position:relative}
  .page::before{content:"";position:absolute;inset:24px;border:1px solid rgba(58,31,45,.12);border-radius:16px;pointer-events:none}
  .header{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid rgba(58,31,45,.15);position:relative;z-index:1}
  .brand{display:flex;align-items:center;gap:14px}
  .brand img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid rgba(58,31,45,.1)}
  .brand h1{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;letter-spacing:-.5px}
  .brand h1 i{font-style:italic;font-weight:500}
  .brand p{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:rgba(58,31,45,.55);margin-top:2px}
  .meta{text-align:right;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(58,31,45,.55)}
  .meta strong{display:block;font-size:12px;color:#3a1f2d;letter-spacing:.15em;margin-bottom:4px}
  /* Hero: main image left, details right */
  .hero{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;position:relative;z-index:1}
  .imgwrap{overflow:hidden;border-radius:14px;background:#fff;border:1px solid rgba(58,31,45,.08);box-shadow:0 8px 24px -10px rgba(58,31,45,.2)}
  .imgwrap.main{aspect-ratio:1}
  .imgwrap img{width:100%;height:100%;object-fit:cover;display:block}
  .details .eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#b8862b;font-weight:600}
  .details h2{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;line-height:1.15;margin-top:10px;letter-spacing:-.5px}
  .price{margin-top:14px;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#3a1f2d}
  .divider{height:1px;background:linear-gradient(to right,transparent,rgba(58,31,45,.2),transparent);margin:20px 0}
  .desc{font-size:12.5px;line-height:1.7;color:rgba(58,31,45,.82);font-weight:300;white-space:pre-line}
  /* Additional images grid below hero */
  .extra-images{margin-top:24px;position:relative;z-index:1}
  .extra-images h3{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;margin-bottom:12px;color:rgba(58,31,45,.6);letter-spacing:.05em}
  .img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
  .img-grid .imgwrap{aspect-ratio:1}
  .footer{margin-top:36px;padding-top:20px;border-top:1px solid rgba(58,31,45,.15);display:flex;justify-content:space-between;align-items:center;font-size:10px;color:rgba(58,31,45,.6);letter-spacing:.12em;text-transform:uppercase;position:relative;z-index:1}
  .footer .ref{font-family:'Cormorant Garamond',serif;font-size:11px;font-style:italic;letter-spacing:.05em;text-transform:none;color:rgba(58,31,45,.7)}
  @page{size:A4;margin:0}
  @media print{.page{min-height:auto;padding:40px 48px}}
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <img src="${brandMark}" alt=""/>
        <div>
          <h1>Lumière <i>Jewels</i></h1>
          <p>Handcrafted Fine Jewellery</p>
        </div>
      </div>
      <div class="meta">
        <strong>Product Card</strong>
        <span>${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
    </div>

    <div class="hero">
      <div class="imgwrap main"><img src="${product.images[0]}" alt="${escape(product.name)}"/></div>
      <div class="details">
        <div class="eyebrow">Exclusive Collection</div>
        <h2>${escape(product.name)}</h2>
        ${onlyCatalogue ? "" : `<div class="price">${formatINR(product.price)}</div>`}
        <div class="divider"></div>
        <p class="desc">${escape(product.description)}</p>
      </div>
    </div>

    ${
      product.images.length > 1
        ? `<div class="extra-images">
        <h3>More Views</h3>
        <div class="img-grid">
          ${product.images
            .slice(1)
            .map(
              (src, idx) =>
                `<div class="imgwrap"><img src="${src}" alt="${escape(product.name)} view ${idx + 2}"/></div>`,
            )
            .join("")}
        </div>
      </div>`
        : ""
    }

    <div class="footer">
      <span>concierge@lumierejewels.com &nbsp;·&nbsp; +351 21 000 0000</span>
      <span class="ref">Ref. ${escape(product.id.toUpperCase())}</span>
    </div>
  </div>
  <script>
    window.onload = () => {
      const imgs = Array.from(document.images);
      Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })))
        .then(() => setTimeout(() => window.print(), 300));
    };
  </script>
</body></html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
