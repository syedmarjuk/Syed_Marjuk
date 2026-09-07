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

  /* ============================================================
     MODEL 3 — Tertiary (fishery) production
     ------------------------------------------------------------
     A four-tier satellite-driven trophic-transfer chain for the
     southwestern Bay of Bengal, calibrated on fishery-independent
     survey CPUE (1,022 sets: 726 bottom trawl + 296 longline).

     Tier 1  primary production      VGPM, Behrenfeld & Falkowski (1997)
     Tier 2  plankton biomass        Marjuk et al. (2025) RSMA — the model
                                     already on this site
     Tier 3  secondary production    P/B growth × zooplankton biomass
     Tier 4  fish production, yield  Ryther (1969); Gulland (1971)

     Every coefficient below is taken from pipeline/constants.py, the
     project's single source of truth.
     ============================================================ */

  /* --- Tier 1: optimal carbon fixation rate, mg C (mg Chl)^-1 h^-1 --- */
  // Behrenfeld & Falkowski (1997) 7th-order polynomial, with the
  // published saturation clamps.
  function pboptVGPM(sst) {
    const t = sst;
    let p = 1.2956 + 2.749e-1 * t + 6.17e-2 * t ** 2 - 2.05e-2 * t ** 3
          + 2.462e-3 * t ** 4 - 1.348e-4 * t ** 5 + 3.4132e-6 * t ** 6
          - 3.27e-8 * t ** 7;
    if (t > 28.5) p = 4.0;      // the polynomial saturates here
    if (t < -1.0) p = 1.13;
    return p;
  }

  // Eppley-VGPM. Does NOT saturate above 28.5 °C, which matters because
  // most of this domain is warmer than that.
  function pboptEppley(sst) {
    return 1.54 * Math.pow(10, 0.0275 * sst - 0.07);
  }

  /** Daylength in hours — CBM model, from latitude and day of year. */
  function photoperiod(latDeg, doy) {
    const lat = latDeg * Math.PI / 180;
    const decl = (23.45 * Math.PI / 180) * Math.sin(2 * Math.PI * (284 + doy) / 365);
    let cosH = -Math.tan(lat) * Math.tan(decl);
    cosH = Math.max(-1, Math.min(1, cosH));
    return 2 * (Math.acos(cosH) * 180 / Math.PI) / 15;
  }

  /** Depth-integrated daily primary production, mg C m^-2 d^-1. */
  function primaryProduction(chl, sst, par, kd490, lat, doy, eppley) {
    const pb = eppley ? pboptEppley(sst) : pboptVGPM(sst);
    const zeu = 4.6 / kd490;                 // euphotic depth, m
    const dayl = photoperiod(lat, doy);
    return 0.66125 * pb * (par / (par + 4.1)) * zeu * chl * dayl;
  }

  /* --- Tier 3: mesozooplankton weight-specific growth P/B, d^-1 --- */
  // Three published models. They disagree roughly sixfold at 28 °C, which
  // is the single largest parameter uncertainty in the chain — so all three
  // are carried rather than one being chosen silently.
  const pbModels = {
    hirst_bunker03: {
      form: 'loglinear', a: -1.209, b: -0.174, c: 0.0442,
      label: 'Hirst & Bunker (2003)', valid: [-2.3, 34.0],
      note: 'default — the only model covering every observation in this dataset'
    },
    hirst_lampitt98: {
      form: 'loglinear', a: -1.725, b: -0.174, c: 0.0442,
      label: 'Hirst & Lampitt (1998)', valid: [0.0, 29.0],
      note: 'low vs measured warm-water rates; 43% of match-ups fall outside its range'
    },
    huntley_lopez92: {
      form: 'exponential', a: 0.0445, c: 0.111,
      label: 'Huntley & López (1992)', valid: [-1.7, 30.7],
      note: 'high vs measured warm-water rates; temperature only'
    }
  };

  const PB_BODY_UGC = 50.0;      // mesozooplankton individual body carbon
  const PB_MIN = 0.01, PB_MAX = 1.50;   // measured warm-water envelope

  /** P/B ratio, d^-1, clipped to the measured envelope. */
  function pbRatio(sst, modelName) {
    const m = pbModels[modelName] || pbModels.hirst_bunker03;
    let g;
    if (m.form === 'loglinear') {
      g = Math.pow(10, m.a + m.b * Math.log10(PB_BODY_UGC) + m.c * sst);
    } else {
      g = m.a * Math.exp(m.c * sst);
    }
    return Math.max(PB_MIN, Math.min(PB_MAX, g));
  }

  /** True when SST sits outside a P/B model's published calibration range. */
  function pbOutOfRange(sst, modelName) {
    const m = pbModels[modelName] || pbModels.hirst_bunker03;
    return sst < m.valid[0] || sst > m.valid[1];
  }

  /* --- Transfer efficiency posterior, from the Bayesian fit --- */
  const teValues = {
    posteriorMean: 0.0491,   // 95% HDI 0.0243 – 0.0881
    hdiLo:         0.0243,
    hdiHi:         0.0881,
    threePathway:  0.0390,
    textbook:      0.1000    // Ryther (1969); Pauly & Christensen (1995)
  };

  const TL_ZOO = 2.0;        // herbivorous mesozooplankton
  const E_EXPLOIT = 0.5;     // Gulland (1971) exploitation rate at MSY

  /**
   * Run the whole four-tier chain for one satellite pixel.
   * Returns every intermediate value so the page can show the chain, not
   * just the answer.
   */
  function tertiaryChain(opts) {
    const sst   = opts.sst;
    const chl   = opts.chl;
    const par   = opts.par;
    const kd490 = opts.kd490;
    const lat   = opts.lat;
    const doy   = opts.doy;
    const tlFish = opts.tlFish;
    const te     = opts.te;
    const pbModel = opts.pbModel || 'hirst_bunker03';

    // Tier 1
    const dayl   = photoperiod(lat, doy);
    const zeu    = 4.6 / kd490;
    const ppVgpm   = primaryProduction(chl, sst, par, kd490, lat, doy, false);
    const ppEppley = primaryProduction(chl, sst, par, kd490, lat, doy, true);

    // Tier 2 — the published RSMA algorithms (same as the biomass model)
    const pbmVal = pbm('Linear', sst, chl);
    const zbmVal = zbm('Linear', chl, pbmVal);

    // Tier 3
    const pbr = pbRatio(sst, pbModel);
    const sp  = zbmVal * pbr;                 // mg DW m^-3 d^-1

    // Tier 4 — trophic transfer then Gulland exploitation
    const tlGap = tlFish - TL_ZOO;
    const pfp   = sp * Math.pow(te, tlGap);   // mg DW m^-3 d^-1
    const py    = pfp * E_EXPLOIT;

    return {
      daylength: dayl,
      pbopt: pboptVGPM(sst),
      pboptEppley: pboptEppley(sst),
      zeu: zeu,
      pp: ppVgpm,
      ppEppley: ppEppley,
      pbm: pbmVal,
      zbm: zbmVal,
      pbRatio: pbr,
      pbOutOfRange: pbOutOfRange(sst, pbModel),
      sp: sp,
      tlGap: tlGap,
      pfp: pfp,
      py: py,
      // the mesozooplankton pathway as a share of primary production,
      // expressed in comparable carbon units
      pathwayShare: (sp * zeu * 0.40 / 5.0) / ppVgpm
    };
  }

  /* ---------- Valid input ranges (from the training data) ---------- */
  const ranges = {
    temp: [15, 35],   // °C
    sal:  [26, 34],   // PSU
    ph:   [6.5, 9],   // pH units
    sst:  [25, 32],   // °C
    chl:  [0.1, 6],   // mg/m³
    // tertiary-chain inputs, from the pipeline's own sanity gate
    par:   [5, 75],   // mol m^-2 d^-1
    kd490: [0.01, 5], // m^-1
    lat:   [8, 20],   // °N, the study domain
    doy:   [1, 365]
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
    // model 1 — Acartia steueri reproduction
    regress, classify,
    // model 2 — Bay of Bengal plankton biomass
    pbm, zbm, biomass,
    optimise,
    // model 3 — tertiary (fishery) production
    tertiary: {
      chain: tertiaryChain,
      primaryProduction, photoperiod, pbRatio, pbOutOfRange,
      pboptVGPM, pboptEppley,
      pbModels, te: teValues,
      TL_ZOO, E_EXPLOIT,
      shelfKm2: 41412.0,          // published Tamil Nadu continental shelf area
      cmfriDemersalT: 214830.0    // 682,000 t × 0.315 demersal share (2-yr mean)
    },
    ranges,
    equations: bob.equations,
    surfaces: bob.surfaces,
    tierLabels: patternnet.labels,
    r2: fitnet.r2
  };
})();
