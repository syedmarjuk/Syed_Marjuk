/* ============================================================
   data.js  —  YOUR CONTENT LIVES HERE
   ============================================================
   This is the ONLY file you need to edit to add new
   publications or new AI/ML models.

   Rules:
   1. Keep the commas and quotes exactly as you see them.
   2. Each entry sits inside { curly braces }.
   3. Separate entries with a comma.
   4. Save the file, then push to GitHub. Netlify does the rest.
   ============================================================ */


/* ------------------------------------------------------------
   1. PUBLICATIONS
   ------------------------------------------------------------
   To add a paper, copy one { ... } block and change the values.
   Put the newest paper at the TOP.

   year     : number, e.g. 2026
   authors  : full author string. Put **Marjuk, M. S.** in
              double asterisks to make your name bold.
   title    : the paper title
   journal  : journal name
   publisher: "Elsevier" | "Springer" | "Other"
   doi      : the full https://doi.org/... link (or "" if none)
   tags     : short labels shown as chips
------------------------------------------------------------ */
const PUBLICATIONS = [
  {
    year: 2026,
    authors: "Gowthami, A., **Marjuk, M. S.**, Sarangi, R. K., Santhanam, P., & Perumal, P.",
    title: "Functional trait responses of phytoplankton and zooplankton to environmental variability in nearshore waters of the Bay of Bengal, Tamil Nadu coast",
    journal: "Continental Shelf Research",
    publisher: "Elsevier",
    doi: "https://doi.org/10.1016/j.csr.2026.105704",
    tags: ["Plankton Ecology", "Bay of Bengal"]
  },
  {
    year: 2026,
    authors: "Sridhar, P., **Marjuk, M. S.**, Babu, T. D., Muralisankar, T., Santhanam, P., & Perumal, P.",
    title: "Influence of culture conditions and dietary regimes on survival, population dynamics and naupliar production of the copepod Paramphiascella fulvofasciata",
    journal: "Aquaculture International 34(5), 144",
    publisher: "Springer",
    doi: "https://doi.org/10.1007/s10499-026-02545-8",
    tags: ["Copepod Culture", "Aquaculture"]
  },
  {
    year: 2025,
    authors: "**Marjuk, M. S.**, Sarangi, R. K., Ayyasamy, G., Perumal, S., & Pachiappan, P.",
    title: "Modeling phytoplankton and zooplankton biomass in the southwestern Bay of Bengal: a remote sensing approach with MODIS-Aqua and Oceansat-3 data",
    journal: "Regional Studies in Marine Science, 104425",
    publisher: "Elsevier",
    doi: "https://doi.org/10.1016/j.rsma.2025.104425",
    tags: ["Remote Sensing", "First Author", "ISRO"]
  },
  {
    year: 2025,
    authors: "**Marjuk, M. S.**, Sridhar, P., Gowthami, A., Santhanam, P., Sarangi, R. K., & Perumal, P.",
    title: "Systematic optimization and neural network modelling of Acartia steueri copepod reproduction for enhanced live feed solutions in sustainable aquaculture",
    journal: "Aquaculture, 743482",
    publisher: "Elsevier",
    doi: "https://doi.org/10.1016/j.aquaculture.2025.743482",
    tags: ["Neural Networks", "First Author", "Aquaculture"]
  },
  {
    year: 2025,
    authors: "Gowthami, A., **Marjuk, M. S.**, Santhanam, P., Thirumurugan, R., Muralisankar, T., & Perumal, P.",
    title: "Marine microalgae-mediated biodegradation of polystyrene microplastics: insights from enzymatic and molecular docking studies",
    journal: "Chemosphere, 370, 144024",
    publisher: "Elsevier",
    doi: "https://doi.org/10.1016/j.chemosphere.2024.144024",
    tags: ["Microplastics", "Biodegradation"]
  },
  {
    year: 2023,
    authors: "Santhanam, P., **Marjuk, M. S.**, Gunabal, S., et al.",
    title: "A novel technology towards the high-density and continuous production of the marine copepod, Pseudodiaptomus annandalei (Sewell, 1919)",
    journal: "Biomass Conversion and Biorefinery",
    publisher: "Springer",
    doi: "https://doi.org/10.1007/s13399-023-04348-w",
    tags: ["Copepod Culture", "Technology"]
  },
  {
    year: 2023,
    authors: "Gowthami, A., **Marjuk, M. S.**, Raju, P., Devi, K. N., Santhanam, P., Kumar, S. D., & Perumal, P.",
    title: "Biodegradation efficacy of selected marine microalgae against Low-Density Polyethylene (LDPE)",
    journal: "Marine Pollution Bulletin, 190, 114889",
    publisher: "Elsevier",
    doi: "https://doi.org/10.1016/j.marpolbul.2023.114889",
    tags: ["Microplastics", "Biodegradation"]
  },
  {
    year: 2021,
    authors: "Meeran, M., **Marjuk, S.**, Byrose, M., Arivoli, S., Tennyson, S., & Fathima, S.",
    title: "Population flux of the house sparrow Passer domesticus Linnaeus 1758 in Chinnamanur town, Theni district, Tamil Nadu",
    journal: "Journal of Tropical Life Science, 11(2)",
    publisher: "Other",
    doi: "https://doi.org/10.11594/jtls.11.02.09",
    tags: ["Ornithology", "Urban Ecology"]
  }
];


/* ------------------------------------------------------------
   2. MODELS  —  your AI / ML showcase
   ------------------------------------------------------------
   This powers BOTH the teaser on the homepage AND the
   /models/ page.

   status : "live"        -> green badge, card is clickable
            "development" -> amber badge
            "planned"     -> grey badge
   url    : page for the model, e.g. "pbm-predictor.html"
            Leave as "" while the model is not ready.
   metrics: small key/value stats. Use [] for none.
------------------------------------------------------------ */
const MODELS = [
  {
    name: "Acartia steueri Reproduction Optimiser",
    slug: "acartia-optimiser",
    status: "live",
    icon: "dna",
    summary: "Dual neural network running live in your browser. A fitnet 3-10-2 regression predicts egg and naupliar production rate from temperature, salinity and pH, while a patternnet 3-10-3 classifier grades the production tier.",
    stack: ["MATLAB fitnet", "patternnet", "Response Surface", "Aquaculture"],
    metrics: [
      { label: "R² (regression)", value: "0.9179" },
      { label: "Species", value: "A. steueri" }
    ],
    url: "acartia-optimiser.html"
  },
  {
    name: "Bay of Bengal Plankton Biomass Estimator",
    slug: "bob-biomass",
    status: "live",
    icon: "chart",
    summary: "Phytoplankton and zooplankton biomass from satellite sea surface temperature and chlorophyll-a. Four fitted response surfaces — linear, paraboloid, Gaussian and Lorentzian — computed live with a rendered biomass field.",
    stack: ["MODIS-Aqua", "Oceansat-3 OCM-3", "SeaDAS Band Math", "Surface Fitting"],
    metrics: [
      { label: "Outputs", value: "PBM + ZBM" },
      { label: "Region", value: "SW Bay of Bengal" }
    ],
    url: "bob-biomass.html"
  },
  {
    name: "Underwater Zooplankton Vision System",
    slug: "zooplankton-vision",
    status: "development",
    icon: "eye",
    summary: "Deep-learning computer vision pipeline for automated in-situ detection, classification and enumeration of zooplankton from an underwater imaging device.",
    stack: ["Deep Learning", "Computer Vision", "Python", "Image Analytics"],
    metrics: [
      { label: "Task", value: "Detect + Classify" },
      { label: "Deployment", value: "In-situ device" }
    ],
    url: ""
  },
  {
    name: "Tertiary Production & Food Chain Model",
    slug: "tertiary-production",
    status: "live",
    icon: "waves",
    summary: "A four-tier satellite-driven trophic transfer chain running live in your browser: VGPM primary production, published plankton biomass, secondary production and potential fishery yield. Calibrated on 1,022 fishery-independent survey sets from the southwestern Bay of Bengal.",
    stack: ["VGPM", "Bayesian TE", "Extra Trees", "Nested Spatial CV", "OCM-3"],
    metrics: [
      { label: "Bayesian TE", value: "4.91%" },
      { label: "Survey sets", value: "1,022" }
    ],
    url: "tertiary-production.html"
  }
];


/* ------------------------------------------------------------
   2b. FIELD GALLERY
   ------------------------------------------------------------
   Photos live in assets/img/. To add one: drop the file in that
   folder, then copy a { } block below and change src + alt.

   alt = describe what the photo SHOWS. Screen reader users and
   Google both depend on it, so never leave it vague.
   span: "wide" makes a photo take two columns.
------------------------------------------------------------ */
/* ============================================================
   ADDING YOUR OWN PHOTOS
   ============================================================
   Only photos of YOU (or of your equipment with nobody else in
   frame) belong here. Photos of colleagues have been left out
   deliberately — publishing someone else's face needs their
   permission.

   To add a photo of yourself:
     1. Save the image into  assets/img/
        Suggested names:  me-deck.jpg, me-sampling.jpg, me-lab.jpg
     2. Copy one { } block below and change src, alt and caption.
     3. Add span: "wide" to make it span two columns.

   Keep each file under about 400 KB — see assets/img/README.txt.
   If this list is left empty, the whole gallery section hides
   itself automatically, so the page never shows an empty gap.
   ============================================================ */
const GALLERY = [
  /* ---- Oceanographic instruments ---- */
  {
    src: "assets/img/instrument-ctd.jpg",
    alt: "M. Syed Marjuk on the vessel deck inspecting a Sea-Bird CTD rosette suspended from the crane before a cast",
    caption: "Rigging the Sea-Bird CTD before a cast",
    shape: "tall"
  },
  {
    src: "assets/img/instrument-niskin.jpg",
    alt: "A General Oceanics Niskin water sampling bottle held open on its wire above the sea, ready to be lowered",
    caption: "Niskin bottle cocked and ready to lower",
    shape: "tall"
  },
  {
    src: "assets/img/instrument-grab.jpg",
    alt: "A stainless steel sediment grab sampler opened on deck showing the sediment retrieved from the seabed",
    caption: "Sediment grab, opened on deck",
    span: "wide"
  },
  {
    src: "assets/img/instrument-frame.jpg",
    alt: "M. Syed Marjuk with two colleagues on deck holding a black instrument frame fitted with optical sensors",
    caption: "Preparing the optical sensor frame",
    shape: "tall"
  },

  /* ---- Vessels and deck ---- */
  {
    src: "assets/img/vessel-sagar-manjusha.jpg",
    alt: "M. Syed Marjuk standing on the quay in front of the bow of the research vessel Sagar Manjusha",
    caption: "Alongside ORV Sagar Manjusha",
    span: "wide"
  },
  {
    src: "assets/img/deck-flag.jpg",
    alt: "M. Syed Marjuk on the vessel deck beside the gantry with the Indian flag flying and the coastline in the distance",
    caption: "Transit to the next station",
    shape: "tall"
  },
  {
    src: "assets/img/deck-sunset.jpg",
    alt: "M. Syed Marjuk on the foredeck at dusk with coast guard vessels moored behind in harbour",
    caption: "In harbour at dusk",
    shape: "tall"
  },

  /* ---- Shipboard and shore laboratory ---- */
  {
    src: "assets/img/lab-ship-microscope.jpg",
    alt: "M. Syed Marjuk at the shipboard laboratory bench working at a Leica stereo zoom microscope with plankton imagery on the monitor",
    caption: "Plankton identification at sea",
    span: "wide"
  },
  {
    src: "assets/img/lab-microscope.jpg",
    alt: "M. Syed Marjuk working at an inverted microscope with a laptop running the imaging software beside it",
    caption: "Inverted microscopy and image capture",
    span: "wide"
  },

  /* ---- EIA and coastal fieldwork ---- */
  {
    src: "assets/img/field-eia-site.jpg",
    alt: "M. Syed Marjuk in a hard hat and high-visibility vest on an industrial coastal site during an impact assessment survey",
    caption: "Baseline survey at an industrial coastal site",
    shape: "tall"
  },
  {
    src: "assets/img/field-water-sampling.jpg",
    alt: "M. Syed Marjuk crouched at the edge of a coastal water channel collecting a water sample",
    caption: "Water sampling, coastal channel",
    shape: "tall"
  },
  {
    src: "assets/img/field-boat-carboys.jpg",
    alt: "M. Syed Marjuk working on a small boat over shallow turquoise water with sample carboys beside him",
    caption: "Nearshore station from a small boat",
    span: "wide"
  },
  {
    src: "assets/img/field-beach-survey.jpg",
    alt: "M. Syed Marjuk directing a survey on a beach with a surveying tripod set up on the sand",
    caption: "Shoreline survey transect",
    span: "wide"
  },
  {
    src: "assets/img/field-fish.jpg",
    alt: "M. Syed Marjuk at the ship rail holding a small mackerel caught on a hand line",
    caption: "Between stations",
    shape: "tall"
  },

  /* ---- Teaching and outreach ---- */
  {
    src: "assets/img/teaching-plankton-net.jpg",
    alt: "M. Syed Marjuk demonstrating a plankton net to a group of students in a laboratory session",
    caption: "Demonstrating plankton net sampling",
    span: "wide"
  },
  {
    src: "assets/img/teaching-microscopes.jpg",
    alt: "M. Syed Marjuk leading a practical microscopy session with students at benches of microscopes",
    caption: "Practical microscopy session",
    span: "wide"
  },

  /* ---- Conferences and awards ---- */
  {
    src: "assets/img/conf-maricon.jpg",
    alt: "M. Syed Marjuk presenting at MARICON 2024, the title slide reading From Planktonic Methods to Fishery Harvests behind him",
    caption: "MARICON 2024, CUSAT — invited talk",
    span: "wide"
  },
  {
    src: "assets/img/award-alagappa.jpg",
    alt: "M. Syed Marjuk receiving an award certificate and plaque on stage from the dignitaries at Alagappa University",
    caption: "Best Presentation award, Alagappa University",
    span: "wide"
  },

  /* ---- The two group photos ---- */
  {
    src: "assets/img/team-muster-station.jpg",
    alt: "The full scientific party and ship's crew assembled at the muster station on deck in port",
    caption: "Scientific party and crew, ISRO OceanSAT-3 cruise",
    span: "wide"
  },
  {
    src: "assets/img/team-with-captain.jpg",
    alt: "M. Syed Marjuk with the science team and the ship's master on deck alongside the quay",
    caption: "Science team with the ship's master"
  }
];


/* ------------------------------------------------------------
   3. EXPERIENCE TIMELINE
------------------------------------------------------------ */
const EXPERIENCE = [
  {
    role: "Senior Research Fellow — Centre for Oceanic AI",
    org: "Chinmaya Vishwa Vidyapeeth (CVV)",
    period: "Jul 2026 — Present",
    place: "Onakkoor, Kerala",
    current: true,
    funder: "",
    points: [
      "Interdisciplinary research integrating marine science, AI/ML, image analytics and environmental data science for ocean observation.",
      "Development, validation and field deployment of AI-based marine imaging systems, including automated zooplankton detection.",
      "Marine field sampling, image/data analysis and validation of AI-assisted oceanographic technologies.",
      "Publish in Scopus-indexed journals, guide student research and contribute to proposals and collaborations."
    ]
  },
  {
    role: "Project Associate — Marine Science & Remote Sensing",
    org: "Marine Planktonology & Aquaculture Laboratory, Bharathidasan University",
    period: "Mar 2023 — Mar 2026",
    place: "Tiruchirappalli",
    current: false,
    funder: "ISRO — Space Applications Centre (SAC) · OceanSAT-3",
    points: [
      "Built ML and ANN models (MATLAB Regression Learner — SVM, GPR, Ensemble Trees, ANN) predicting phytoplankton and zooplankton biomass from satellite SST and chlorophyll-a.",
      "Translated trained ANN architectures into mathematical band-math expressions for pixel-wise deployment in SeaDAS, enabling scalable satellite biomass mapping.",
      "Collaborated directly with ISRO-SAC scientists on OCM-3 ocean colour product development and algorithm validation.",
      "Integrated in-situ water quality, nutrient, pigment and plankton datasets with MODIS-Aqua and OCM-3 imagery in SeaDAS and QGIS."
    ]
  },
  {
    role: "Environmental Biologist — Marine EIA Biodiversity Baseline",
    org: "Chola MS Risk Services Pvt. Ltd.",
    period: "2025 & 2026",
    place: "Karaikal Port · Tuticorin · Tirunelveli",
    current: false,
    funder: "",
    points: [
      "Comprehensive biodiversity baseline surveys at Karaikal Port — systematic identification of birds, reptiles, mammals, marine invertebrates and insects for Marine EIA documentation.",
      "Flora and fauna baseline surveys for TNEB transmission line projects at Tuticorin and Tirunelveli for regulatory EIA submission.",
      "Developed conservation management plans and structured baseline reports for coastal infrastructure compliance."
    ]
  },
  {
    role: "EIA Biologist — Ennore Oil Spill Response",
    org: "Chennai Petroleum Corporation Limited (CPCL) & TERI, Delhi",
    period: "Jun 2022 — Feb 2023",
    place: "Ennore & Karaikal",
    current: false,
    funder: "",
    points: [
      "Post-spill Environmental Impact Assessment of Ennore and Karaikal oil spill zones — assessed shifts in plankton community structure, diversity indices and biomass after hydrocarbon contamination.",
      "Collected, preserved and taxonomically identified plankton and affected bird specimens; produced species-level biodiversity reports for CPCL and regulatory bodies.",
      "Contributed plankton ecology data to formal EIA documentation under MoEF&CC standards and recommended marine restoration strategies."
    ]
  },
  {
    role: "Project Associate — Marine Copepod Aquaculture",
    org: "Marine Planktonology & Aquaculture Laboratory, Bharathidasan University",
    period: "Apr 2021 — May 2022",
    place: "Tiruchirappalli",
    current: false,
    funder: "Department of Biotechnology (DBT), India",
    points: [
      "Designed and optimised high-density continuous culture systems for Pseudodiaptomus annandalei, Dioithona rigida and Nitokra affinis, simulating natural marine conditions ex situ.",
      "Contributed to resting egg (cyst) harvesting protocols; resulting technology published in Biomass Conversion & Biorefinery (Springer, 2023)."
    ]
  },
  {
    role: "Ornithologist — Avian Ecology & Wildlife Hazard Management",
    org: "Salim Ali Centre for Ornithology and Natural History (SACON)",
    period: "Feb 2021 — Apr 2021",
    place: "Coimbatore",
    current: false,
    funder: "Ministry of Environment, Forest and Climate Change (MoEF&CC)",
    points: [
      "Avian population monitoring and field assessment for bird hazard management, conservation planning and habitat suitability analysis.",
      "Specialist training in bird banding, mist netting, radio-tagging, camera traps and behavioural ecology field protocols."
    ]
  },
  {
    role: "Environmental Educator & Field Coordinator",
    org: "Pitchandikulam Forest Unit, Auroville Foundation",
    period: "Aug 2020 — Feb 2021",
    place: "Pondicherry",
    current: false,
    funder: "",
    points: [
      "Coordinated wildlife surveys and biodiversity assessments; trained field teams in ecological monitoring, GIS mapping and data collection protocols."
    ]
  },
  {
    role: "M.Sc. Research Fellow — Urban Wildlife Ecology",
    org: "Hajee Karutha Rowther Howdia College, Madurai Kamaraj University",
    period: "Aug 2019 — Feb 2021",
    place: "Theni",
    current: false,
    funder: "Tamil Nadu State Council for Science and Technology (TNSCST)",
    points: [
      "Investigated urban adaptation and population dynamics of House Sparrow (Passer domesticus); published in Journal of Tropical Life Science (2021)."
    ]
  }
];


/* ------------------------------------------------------------
   4. AWARDS & RECOGNITION
------------------------------------------------------------ */
const AWARDS = [
  { year: "2026", title: "M. Krishnan Memorial Award for Nature Writing", org: "Madras Naturalists' Society, Chennai", featured: true },
  { year: "2023", title: "Dr. A.P.J. Abdul Kalam Young Research Award", org: "Terre Policy Centre — for innovation and research excellence", featured: true },
  { year: "2024", title: "First Place, Oral Presentation", org: "National Conference on FutureBio 2025, Alagappa University", featured: false },
  { year: "2019", title: "Best Paper Presentation Award", org: "National Conference on Latest Trends in Life Sciences, HKR Howdia College", featured: false },
  { year: "2018", title: "First Prize — ZooFest Zoology Quiz", org: "Madurai American College", featured: false },
  { year: "2025", title: "Climate Reality Leadership Certificate", org: "YouthForCop Programme", featured: false },
  { year: "—", title: "Wildlife Census Coordinator", org: "Tamil Nadu Forest Department — led standardised population monitoring teams", featured: false },
  { year: "23–25", title: "International Coastal Cleanup Volunteer", org: "Swachh Sagar Surakshit Sagar, Nagapattinam — Bharathidasan University & NCCR, MoES", featured: false }
];


/* ------------------------------------------------------------
   5. RESEARCH CRUISES
------------------------------------------------------------ */
const CRUISES = {
  total: 7,
  asChiefScientist: 2,
  programme: "ISRO OceanSAT-3 / SAC Satellite Validation — OCM-3 Ocean Colour Products",
  regions: ["Bay of Bengal", "Arabian Sea"],
  vessels: ["ORV Sagar Manjusha", "RV Sindhu Sankalp", "CRV Sagar Tara", "CRV Sagar Anveshika"],
  activities: [
    "Chief Scientist on 2 independent cruises — scientific operations, station planning, data integrity and team coordination.",
    "Systematic plankton net sampling (WP-2 vertical hauls, oblique tows) across oceanic stations; preserved and enumerated phyto- and zooplankton for biomass and taxonomy.",
    "In-situ oceanographic parameters at every station: SST, salinity, dissolved oxygen, nutrients (nitrate, phosphate, silicate) and chlorophyll-a.",
    "Deployed CTD profilers, Niskin bottles and grab samplers with full chain-of-custody documentation alongside ISRO-SAC scientists.",
    "Operated GPS/GNSS instruments for real-time georeferenced station positioning and GIS layer generation."
  ]
};


/* ------------------------------------------------------------
   6. EXPERTISE  (bento grid)
------------------------------------------------------------ */
const EXPERTISE = [
  {
    icon: "brain",
    title: "AI & Machine Learning",
    span: "wide",
    items: [
      "MATLAB Regression Learner — ANN, SVM, GPR, Ensemble Trees for PBM/ZBM prediction from satellite data",
      "Model performance evaluation: R², RMSE, MAE",
      "ANN → SeaDAS band-math translation for pixel-wise biomass mapping",
      "Python (NumPy, pandas, matplotlib) for preprocessing and ML pipelines",
      "Deep learning computer vision for underwater zooplankton imaging"
    ]
  },
  {
    icon: "satellite",
    title: "Remote Sensing & GIS",
    span: "normal",
    items: [
      "SeaDAS — OceanSAT-3/OCM-3, MODIS-Aqua: SST, Chl-a, TSM ocean colour products",
      "Band math and pixel-wise algorithm validation",
      "QGIS & ArcGIS — spatial mapping, habitat distribution modelling, GPS-linked field logging"
    ]
  },
  {
    icon: "microscope",
    title: "Plankton Taxonomy",
    span: "normal",
    items: [
      "Phytoplankton: diatoms, dinoflagellates, cyanobacteria, silicoflagellates",
      "Zooplankton: copepods, chaetognaths, medusae, euphausiids, larval ichthyoplankton",
      "Inverted, stereo zoom and SEM microscopy; Sedgwick-Rafter and Bogorov tray counting",
      "Culture-verified ID of Pseudodiaptomus annandalei, Acartia steueri, Acartia sp."
    ]
  },
  {
    icon: "bird",
    title: "Avian Ecology",
    span: "normal",
    items: [
      "Qualified ornithologist (SACON, MoEF&CC-funded)",
      "Mist netting, bird banding, radio-tagging, camera trap surveys",
      "Avian hazard management and population monitoring",
      "Diversity surveys across coastal wetland, urban and forest ecosystems"
    ]
  },
  {
    icon: "leaf",
    title: "Broad Taxonomy & EIA",
    span: "normal",
    items: [
      "Full taxonomic coverage from Protozoa to Mammalia",
      "Port-site baseline surveys: birds, reptiles, mammals, marine invertebrates, macro-algae, insects",
      "ESIA regulatory documentation under MoEF&CC norms"
    ]
  },
  {
    icon: "flask",
    title: "Laboratory & Analytical",
    span: "normal",
    items: [
      "Inverted / stereo zoom / SEM microscopy",
      "GC-FID; UV-Vis spectrophotometry",
      "PCR and gel electrophoresis; DNA/RNA sample preparation",
      "SPSS, MINITAB, GraphPad Prism 9, SigmaPlot, Origin — ANOVA, multivariate regression"
    ]
  },
  {
    icon: "anchor",
    title: "Field & Oceanographic",
    span: "normal",
    items: [
      "PADI Open Water Diver — certified for submerged sampling",
      "Plankton nets (WP-2, Bongo) — vertical hauls, oblique tows",
      "CTD profilers, Niskin bottles, Secchi disc, GPS/GNSS",
      "Mist nets, banding tools, radio-tags, camera traps, light traps"
    ]
  }
];


/* ------------------------------------------------------------
   7. RESEARCH FOCUS  (four pillars on the homepage)
------------------------------------------------------------ */
const FOCUS = [
  {
    icon: "satellite",
    title: "Ocean Remote Sensing",
    text: "Validating OceanSAT-3 OCM-3 and MODIS-Aqua ocean colour products against in-situ cruise data, and turning them into basin-scale plankton biomass maps."
  },
  {
    icon: "brain",
    title: "AI for Ocean Observation",
    text: "Neural networks and regression ensembles that predict plankton biomass from satellite variables, plus deep-learning vision for automated zooplankton identification."
  },
  {
    icon: "shield",
    title: "Environmental Impact Assessment",
    text: "Regulatory EIA under Indian MoEF&CC norms — oil spill impact assessment, port and transmission-line biodiversity baselines, conservation management plans."
  },
  {
    icon: "microscope",
    title: "Plankton Ecology & Aquaculture",
    text: "Taxonomy and functional traits of marine plankton, and high-density continuous copepod production for sustainable live-feed aquaculture."
  }
];


/* ------------------------------------------------------------
   8. EDUCATION
------------------------------------------------------------ */
const EDUCATION = [
  {
    degree: "Ph.D. Zoology (Interdisciplinary Marine Science)",
    school: "Bharathidasan University, Tiruchirappalli",
    year: "2023 — 2026",
    result: "Thesis Submitted",
    note: "ISRO-SAC Funded",
    thesis: "Application of Advanced Remote Sensing for Plankton Biomass Monitoring in the Southwestern Bay of Bengal and AI-Enhanced Predictive Modelling for Sustainable Copepod Production"
  },
  {
    degree: "M.Sc. Zoology",
    school: "Hajee Karutha Rowther Howdia College · Madurai Kamaraj University",
    year: "2021",
    result: "First Class with Distinction",
    note: "",
    thesis: ""
  },
  {
    degree: "B.Sc. Zoology",
    school: "Hajee Karutha Rowther Howdia College · Madurai Kamaraj University",
    year: "2018",
    result: "First Class",
    note: "",
    thesis: ""
  },
  {
    degree: "Honours Diploma in Computer Application (HDCA)",
    school: "Computer Software College",
    year: "2019",
    result: "First Class with Outstanding",
    note: "",
    thesis: ""
  }
];


/* ------------------------------------------------------------
   9. CONFERENCES  (selected)
------------------------------------------------------------ */
const CONFERENCES = [
  { year: "2025", name: "Blue Economy International Conference", host: "Alagappa University, Thondi", talk: "" },
  { year: "2024", name: "FutureBio 2025", host: "Alagappa University", talk: "Systematic Optimization and Neural Network Modelling of Acartia steueri Copepod Reproduction for Enhanced Live Feed Solutions in Sustainable Aquaculture" },
  { year: "2024", name: "NEAOsr'24", host: "Bharathidasan University", talk: "Mass Production of Copepod Acartia sp. for Sustainable Aquaculture" },
  { year: "2024", name: "MARICON 2024 — International Conference on Frontiers in Marine Sciences", host: "Cochin University of Science and Technology (CUSAT)", talk: "" },
  { year: "2023", name: "E-Content Development for Distance Education (E-CDDE)", host: "Bharathidasan University", talk: "" },
  { year: "2020", name: "NCESHPA-2020 — Environmental Sustainability, Health and Pollution Abatement", host: "Madurai", talk: "" }
];


/* ------------------------------------------------------------
   10. SITE-WIDE SETTINGS
   ------------------------------------------------------------
   Change your contact details and headline numbers here.
------------------------------------------------------------ */
const SITE = {
  name: "M. Syed Marjuk",
  shortName: "Syed Marjuk",
  tagline: "EIA Specialist · Marine &amp; Terrestrial Biologist · Remote Sensing &amp; AI-ML Modelling",
  currentRole: "Senior Research Fellow, Centre for Oceanic AI — CVV",
  formerRole: "Project Fellow, Indian Space Research Organisation (ISRO)",

  email: "1syedmarjuk@gmail.com",
  linkedin: "https://www.linkedin.com/in/syed-marjuk",
  orcid: "0000-0002-0834-3177",
  orcidUrl: "https://orcid.org/0000-0002-0834-3177",
  // Google Scholar profile. Keep it in this canonical form — do not paste a URL
  // containing "authuser=", that refers to a signed-in account on YOUR browser
  // and can fail for other visitors.
  scholar: "https://scholar.google.com/citations?user=DEwoDzcAAAAJ&hl=en",

  // Research metrics — update after each new Google Scholar citation report
  // Last checked: August 2026  (All: 121 citations, h-index 4, i10-index 2)
  metrics: {
    publications: 8,
    citations: 121,
    hIndex: 4,
    i10Index: 2,
    cruises: 7,
    yearsExperience: 6
  },

  // Path to your CV file. Put the PDF in assets/ and it will download.
  cvPath: "assets/M_Syed_Marjuk_CV.pdf"
};
