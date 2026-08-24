/* ============================================================
   models.js — the trained models, running client-side
   ============================================================
   These are YOUR published networks and fitted surfaces,
   exported from MATLAB and reimplemented in plain JavaScript.

   Nothing is sent to a server. Every prediction is computed
   in the visitor's browser.

   ------------------------------------------------------------
   MODEL 1 — Acartia steueri reproduction
     fitnet 3-10-2      regression   R² 0.9179
       in  : temperature (°C), salinity (PSU), pH
       out : EPR (eggs/female/day), NPR (nauplii/female/day)
     patternnet 3-10-3  classification
       out : production tier — Low / Medium / High
     Published: Aquaculture (2025) — doi 10.1016/j.aquaculture.2025.743482

   MODEL 2 — Bay of Bengal plankton biomass
     Four fitted response surfaces from satellite SST + Chl-a
     Published: Regional Studies in Marine Science (2025)
                doi 10.1016/j.rsma.2025.104425
   ============================================================ */

// NOTE: assigned onto `window` explicitly. A top-level `const` creates a
// lexical global, not a property of window, so `window.MarineModels` would
// be undefined and every page controller would silently bail out.
window.MarineModels = (function () {
  'use strict';

  /* ---------- MATLAB mapminmax helpers ---------- */
  // MATLAB exports: y = gain .* (x - xoffset) + ymin
  function scale(x, s) {
    return x.map((v, i) => s.gain[i] * (v - s.xoffset[i]) + s.ymin);
  }
  function unscale(y, s) {
    return y.map((v, i) => (v - s.ymin) / s.gain[i] + s.xoffset[i]);
  }
  function tansig(n) {
    return n.map(v => (2 / (1 + Math.exp(-2 * v))) - 1);
  }
  function mul(m, v) {
    return m.map(row => row.reduce((acc, w, i) => acc + w * v[i], 0));
  }
  function add(a, b) {
    return a.map((v, i) => v + b[i]);
  }
  function softmax(n) {
    const mx = Math.max(...n);
    const e = n.map(v => Math.exp(v - mx));
    const sum = e.reduce((a, b) => a + b, 0);
    return e.map(v => v / sum);
  }

  /* ---------- MODEL 1a — fitnet 3-10-2 regression ---------- */
  const fitnet = {
    inS:  { xoffset: [10.1, 10.3, 5.1], gain: [0.0727, 0.0673, 0.4082], ymin: -1 },
    outS: { xoffset: [0, 0],            gain: [0.0667, 0.0935],         ymin: -1 },
    IW: [
      [  2.2525, -2.4797,  1.6316],
      [ -0.6451,  2.2179, -3.8969],
      [  0.1047,  1.3012,  4.3041],
      [  1.2186, -0.1704,  1.6745],
      [  1.0524,  2.9847,  1.0920],
      [-10.7126, -7.7284,  0.8962],
      [ -3.0229, -0.5080,  1.0891],
      [  2.7211,  0.9475,  1.8314],
      [  1.9850,  2.3950, -3.0870],
      [  2.0264, -3.6335, -3.7349]
    ],
    b1: [-3.6397, -2.2056, 1.5733, -0.8096, -1.1801, -2.1703, -1.7109, 3.3001, 1.6204, 0.6834],
    LW: [
      [-0.1748, -0.1516, 0.8510, -0.8775, -0.3887, -0.0876, -0.5594, -0.3385, 0.1149, -0.1723],
      [-0.2313, -0.0080, 0.7955, -0.6031, -0.4374, -0.0716, -0.3234, -0.2036, 0.1914, -0.0901]
    ],
    b2: [-1.5486, -1.6679],
    r2: 0.9179
  };

  /* ---------- MODEL 1b — patternnet 3-10-3 classifier ---------- */
  const patternnet = {
    inS: { xoffset: [10.1, 10.3, 5.1], gain: [0.0727, 0.0673, 0.4082], ymin: -1 },
    IW: [
      [-1.1215, -1.1339, -0.2025],
      [ 1.3005, -1.6501,  0.6571],
      [ 2.3333, -0.9434,  3.5015],
      [ 1.6892, -1.1372, -2.6103],
      [ 0.0803,  1.8189, -1.5627],
      [ 0.8410,  2.7535, -0.5832],
      [-2.7471, -1.7964,  3.0733],
      [ 2.3279,  1.2034,  3.3277],
      [-0.8753, -2.3612,  1.7736],
      [ 1.9501, -0.6231, -2.8241]
    ],
    b1: [4.5045, -3.6191, -1.3909, -0.6196, 1.2053, -1.3771, -1.5003, 1.9623, -2.4664, 2.6985],
    LW: [
      [ 1.2737,  0.0557,  1.1314,  0.9383, 1.1268, 0.5724,  1.7000, -1.3215, -0.3773, -0.2285],
      [-0.5255, -0.9533, -0.4293,  0.0557, 0.4930, 0.2089,  0.4204,  0.3706, -0.6172,  0.4848],
      [-0.7534,  1.0519, -1.4031, -0.9693, 0.4787, -2.1111, -2.4153, 1.9251, -0.4102, -0.3743]
    ],
    b2: [2.9098, -0.5729, -1.4053],
    labels: ['Low', 'Medium', 'High']
  };

  /* ---------- MODEL 2 — Bay of Bengal biomass surfaces ---------- */
  const bob = {
    pbm: {
      Linear:     (s, c) => 1.312 + (-0.020 * s) + (1.072 * c),
      Paraboloid: (s, c) => 62.06 + (-4.205 * s) + (0.692 * c) + 0.072 * (s ** 2) + 0.076 * (c ** 2),
      Gaussian:   (s, c) => 55.672 * Math.exp(-0.5 * ((((s + 428.428) / 226.72) ** 2) + (((c - 7.096) / 3.620) ** 2))),
      Lorentzian: (s, c) => 25.9774 / ((1 + (((s + 124.4223) / 78.8066) ** 2)) * (1 + (((c - 4.7088) / 2.5933) ** 2)))
    },
    zbm: {
      Linear:     (c, p) => 1.201 + (0.693 * c) + (1.119 * p),
      Paraboloid: (c, p) => 0.862 + (0.240 * c) + (1.639 * p) + 0.075 * (c ** 2) + (-0.065) * (p ** 2),
      Gaussian:   (c, p) => 10.807 * Math.exp(-0.5 * ((((c - 6.55) / 7.277) ** 2) + (((p - 6.194) / 3.592) ** 2))),
      Lorentzian: (c, p) => 10.078 / ((1 + (((c - 4.468) / 5.973) ** 2)) * (1 + (((p - 5.79) / 4.029) ** 2)))
    },
    equations: {
      Linear: [
        'PBM = 1.312 − 0.020·SST + 1.072·Chl',
        'ZBM = 1.201 + 0.693·Chl + 1.119·PBM'
      ],
      Paraboloid: [
        'PBM = 62.06 − 4.205·SST + 0.692·Chl + 0.072·SST² + 0.076·Chl²',
        'ZBM = 0.862 + 0.240·Chl + 1.639·PBM + 0.075·Chl² − 0.065·PBM²'
      ],
      Gaussian: [
        'PBM = 55.672·exp(−½[((SST+428.428)/226.72)² + ((Chl−7.096)/3.620)²])',
        'ZBM = 10.807·exp(−½[((Chl−6.55)/7.277)² + ((PBM−6.194)/3.592)²])'
      ],
      Lorentzian: [
        'PBM = 25.9774 / ([1+((SST+124.4223)/78.8066)²]·[1+((Chl−4.7088)/2.5933)²])',
        'ZBM = 10.078 / ([1+((Chl−4.468)/5.973)²]·[1+((PBM−5.79)/4.029)²])'
      ]
    },
    surfaces: ['Linear', 'Paraboloid', 'Gaussian', 'Lorentzian']
  };

  /* ---------- Valid input ranges (from the training data) ---------- */
  const ranges = {
    temp: [15, 35],   // °C
    sal:  [26, 34],   // PSU
    ph:   [6.5, 9],   // pH units
    sst:  [25, 32],   // °C
    chl:  [0.1, 6]    // mg/m³
  };

  /* ---------- Public API ---------- */

  /** EPR + NPR from temperature, salinity, pH. */
  function regress(temp, sal, ph) {
    const h = tansig(add(mul(fitnet.IW, scale([temp, sal, ph], fitnet.inS)), fitnet.b1));
    const out = unscale(add(mul(fitnet.LW, h), fitnet.b2), fitnet.outS);
    return { epr: out[0], npr: out[1] };
  }

  /** Production-tier probabilities [Low, Medium, High]. */
  function classify(temp, sal, ph) {
    const h = tansig(add(mul(patternnet.IW, scale([temp, sal, ph], patternnet.inS)), patternnet.b1));
    const p = softmax(add(mul(patternnet.LW, h), patternnet.b2));
    let best = 0;
    for (let i = 1; i < p.length; i++) if (p[i] > p[best]) best = i;
    return { probabilities: p, label: patternnet.labels[best], index: best };
  }

  /** Phytoplankton biomass for a named surface. */
  function pbm(surface, sst, chl) {
    const f = bob.pbm[surface] || bob.pbm.Linear;
    return f(sst, chl);
  }

  /** Zooplankton biomass for a named surface. */
  function zbm(surface, chl, pbmValue) {
    const f = bob.zbm[surface] || bob.zbm.Linear;
    return f(chl, pbmValue);
  }

  /** Both biomass outputs at once. */
  function biomass(surface, sst, chl) {
    const p = pbm(surface, sst, chl);
    return { pbm: p, zbm: zbm(surface, chl, p) };
  }

  /**
   * Coarse grid search for the input combination maximising a target.
   * target: "epr" | "npr" | "both"
   * Deterministic — a fixed grid, then a refine pass around the winner.
   */
  function optimise(target) {
    target = target || 'epr';
    const score = r =>
      target === 'npr'  ? r.npr :
      target === 'both' ? (r.epr / 30 + r.npr / 20) :
                          r.epr;

    let best = null;

    const sweep = (tR, sR, pR, steps) => {
      const step = (a, b) => (b - a) / (steps - 1);
      for (let i = 0; i < steps; i++) {
        const t = tR[0] + step(tR[0], tR[1]) * i;
        for (let j = 0; j < steps; j++) {
          const s = sR[0] + step(sR[0], sR[1]) * j;
          for (let k = 0; k < steps; k++) {
            const p = pR[0] + step(pR[0], pR[1]) * k;
            const r = regress(t, s, p);
            const v = score(r);
            if (!best || v > best.score) {
              best = { temp: t, sal: s, ph: p, epr: r.epr, npr: r.npr, score: v };
            }
          }
        }
      }
    };

    // Pass 1 — coarse over the full valid domain
    sweep(ranges.temp, ranges.sal, ranges.ph, 13);

    // Pass 2 — refine in a small window around the winner
    const win = (v, r, frac) => {
      const half = (r[1] - r[0]) * frac;
      return [Math.max(r[0], v - half), Math.min(r[1], v + half)];
    };
    sweep(
      win(best.temp, ranges.temp, 0.08),
      win(best.sal,  ranges.sal,  0.08),
      win(best.ph,   ranges.ph,   0.08),
      9
    );

    return best;
  }

  return {
    regress, classify,
    pbm, zbm, biomass,
    optimise,
    ranges,
    equations: bob.equations,
    surfaces: bob.surfaces,
    tierLabels: patternnet.labels,
    r2: fitnet.r2
  };
})();
