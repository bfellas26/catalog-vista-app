import { formatINR, brandMark, type Jewel } from "@/lib/jewellery-data";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function printProduct(product: Jewel) {
  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) return;

  const specs: Array<[string, string | undefined]> = [
    ["Metal", product.metal],
    ["Purity", product.purity],
    ["Weight", product.weight],
    ["Stones", product.stones],
  ];
  const specRows = specs
    .filter(([, v]) => !!v)
    .map(
      ([k, v]) =>
        `<tr><th>${escape(k)}</th><td>${escape(String(v))}</td></tr>`,
    )
    .join("");

  const tags = (product.tags || [])
    .map((t) => `<span class="tag">${escape(t)}</span>`)
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
  .hero{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;position:relative;z-index:1}
  .imgwrap{aspect-ratio:1;overflow:hidden;border-radius:14px;background:#fff;border:1px solid rgba(58,31,45,.08);box-shadow:0 10px 30px -12px rgba(58,31,45,.25)}
  .imgwrap img{width:100%;height:100%;object-fit:cover;display:block}
  .details .eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#b8862b;font-weight:600}
  .details h2{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;line-height:1.15;margin-top:10px;letter-spacing:-.5px}
  .price{margin-top:14px;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#3a1f2d}
  .tags{margin-top:14px;display:flex;flex-wrap:wrap;gap:6px}
  .tag{font-size:10px;padding:4px 10px;border-radius:999px;background:rgba(58,31,45,.06);color:rgba(58,31,45,.75);letter-spacing:.08em;text-transform:uppercase}
  .divider{height:1px;background:linear-gradient(to right,transparent,rgba(58,31,45,.2),transparent);margin:20px 0}
  .desc{margin-top:16px;font-size:12.5px;line-height:1.7;color:rgba(58,31,45,.82);font-weight:300;white-space:pre-line}
  .specs{margin-top:22px;position:relative;z-index:1}
  .specs h3{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;margin-bottom:10px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th,td{padding:10px 14px;text-align:left;border-bottom:1px solid rgba(58,31,45,.08)}
  th{font-weight:500;color:rgba(58,31,45,.55);text-transform:uppercase;letter-spacing:.15em;font-size:10px;width:35%}
  td{color:#3a1f2d;font-weight:500}
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
      <div class="imgwrap"><img src="${product.images[0]}" alt="${escape(product.name)}"/></div>
      <div class="details">
        <div class="eyebrow">Signature Collection</div>
        <h2>${escape(product.name)}</h2>
        <div class="price">${formatINR(product.price)}</div>
        ${tags ? `<div class="tags">${tags}</div>` : ""}
        <div class="divider"></div>
        <p class="desc">${escape(product.description)}</p>
      </div>
    </div>

    ${specRows ? `<div class="specs"><h3>Specifications</h3><table>${specRows}</table></div>` : ""}

    <div class="footer">
      <span>concierge@lumierejewels.com &nbsp;·&nbsp; +351 21 000 0000</span>
      <span class="ref">Ref. ${escape(product.id.toUpperCase())}</span>
    </div>
  </div>
  <script>
    window.onload = () => {
      const imgs = Array.from(document.images);
      Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })))
        .then(() => setTimeout(() => window.print(), 250));
    };
  </script>
</body></html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
