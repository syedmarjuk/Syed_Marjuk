# M. Syed Marjuk — Portfolio Website

Personal research portfolio for **M. Syed Marjuk** — EIA Specialist, Marine &
Terrestrial Biologist, Remote Sensing & AI-ML researcher.

**Live site:** https://syedmarjuk.netlify.app

---

## What this is

A plain HTML / CSS / JavaScript website. There is **no build step** — no npm, no
compiling, nothing to install. You edit a file, push it to GitHub, and Netlify
publishes it within about a minute.

---

## The whole thing in one picture

```
   YOUR PC                    GITHUB                    NETLIFY
   ───────                    ──────                    ───────
   you edit                   stores the                builds nothing,
   data.js        ── push ──▶ files and      ── auto ──▶ just serves them
   or a photo                 their history             at your web address

                                                        syedmarjuk.netlify.app
```

**GitHub** = the filing cabinet that keeps your files and every past version.
**Netlify** = the shop window that shows those files to the world.

You connect them **once**. After that, every change you push to GitHub appears
on the website automatically in about a minute. You never touch Netlify again.

To preview before publishing: **double-click `index.html`**. No server needed.

---

## Folder map

```
syedmarjuk-portfolio/
│
├── index.html              ← the main page
├── netlify.toml            ← hosting settings (leave alone)
├── robots.txt              ← lets Google index the site
├── sitemap.xml             ← add new pages here for Google
│
├── assets/
│   ├── css/style.css       ← all the styling
│   ├── js/
│   │   ├── data.js         ← ★ YOUR CONTENT — edit this one
│   │   ├── models.js       ← your trained models (weights + equations)
│   │   └── main.js         ← the code that draws the page (leave alone)
│   └── img/                ← put photos and figures here
│
└── models/
    ├── index.html               ← the Models gallery page
    ├── acartia-optimiser.html   ← LIVE model 1 (dual neural network)
    ├── bob-biomass.html         ← LIVE model 2 (biomass surfaces)
    └── _TEMPLATE.html           ← copy this to make a new model page
```

**The only file you normally need to touch is `assets/js/data.js`.**

### The two live models

Both of your published models now run **in the visitor's browser** — no server,
no Python, no upload. The weights and equations were exported from your MATLAB
work into `assets/js/models.js`:

| Page | What it does |
|---|---|
| `acartia-optimiser.html` | fitnet 3-10-2 predicts EPR + NPR from temperature, salinity, pH (R² 0.9179). patternnet 3-10-3 grades the tier Low/Medium/High. Includes a live response-surface heat map and an optimiser that searches for the best conditions. |
| `bob-biomass.html` | PBM and ZBM from satellite SST + chlorophyll-a, across all four fitted surfaces (Linear, Paraboloid, Gaussian, Lorentzian), with the equations and a biomass field that redraw as you change the surface. |

Every prediction was checked against an independent Python implementation of the
same weights and matched to the last decimal place.

If you retrain a model, the only thing to change is the weight block in
`assets/js/models.js` — the pages read from it automatically.

---

## Part 1 — Put it online (one time only)

### Step 1. Create a GitHub repository

1. Go to https://github.com/new
2. **Repository name:** `syedmarjuk-portfolio`
3. Choose **Public**
4. Do **not** tick "Add a README" (you already have one)
5. Click **Create repository**

### Step 2. Upload the files

The easiest way with no commands at all:

1. On your new empty repository page, click **uploading an existing file**
2. Open `D:\Work\Claude code\syedmarjuk-portfolio` in File Explorer
3. Select **everything inside** that folder (not the folder itself) and drag it
   into the browser window
4. Scroll down, type `Initial commit`, click **Commit changes**

> If you would rather use commands, see *Using Git* at the bottom.

### Step 3. Connect Netlify

1. Go to https://app.netlify.com and sign in with GitHub
2. Click **Add new site → Import an existing project**
3. Choose **GitHub**, then pick `syedmarjuk-portfolio`
4. Leave the build settings empty:
   - **Build command:** *(blank)*
   - **Publish directory:** `.`
5. Click **Deploy**

### Step 4. Set your address

1. In Netlify go to **Site configuration → Site details → Change site name**
2. Enter `syedmarjuk`
3. Your site is now live at **https://syedmarjuk.netlify.app**

Done. From now on, every change you push to GitHub goes live automatically.

---

## Part 2 — Add your CV and photo

### Your CV (so the Download CV button works)

1. Copy your CV PDF into the `assets/` folder
2. Rename it to exactly: `M_Syed_Marjuk_CV.pdf`

If you want a different filename, open `assets/js/data.js`, scroll to the bottom
and change:

```js
cvPath: "assets/M_Syed_Marjuk_CV.pdf"
```

### A social preview image

Already done — `assets/img/og-image.jpg` was generated from one of your
plankton-tow photos. To replace it, save a **1200 × 630 pixel** image over
that same filename.

---

## Part 2b — The photo gallery

**Only photos of you belong in the gallery.** Photos of colleagues were
deliberately left out: publishing someone else's face needs their permission,
and you asked for your own images only.

What is in there now: four plankton-net shots with nobody in frame.

### The easy way — the `photos-to-add` folder

There is a folder next to the website folder called **`photos-to-add`**.

1. Copy any photos you want on the site into it. **Any filename, any size.**
2. Run this once, from inside `syedmarjuk-portfolio`:

```bash
python add-photos.py
```

It shrinks every photo, rotates it the right way up, compresses it, copies it
into `assets/img/`, works out whether it is portrait or landscape, and prints a
ready-made `GALLERY` block for you to paste into `data.js`. Your originals are
never touched.

Then just replace the `DESCRIBE WHAT THE PHOTO SHOWS` and `SHORT CAPTION`
placeholders with real text.

> **Why this folder?** Photos pasted into a chat window cannot be saved to your
> hard disk. Only real files on your computer can be used. Copying them into
> this folder is the one step that has to be done by hand.

### The manual way

1. Save the image into `assets/img/`. Suggested names:
   `me-deck.jpg`, `me-sampling.jpg`, `me-lab.jpg`
2. Open `assets/js/data.js` and find the `GALLERY` list
3. Copy an existing block and change it:

```js
{
  src: "assets/img/me-deck.jpg",
  alt: "M. Syed Marjuk on the deck of a research vessel underway",
  caption: "On station, Bay of Bengal",
  span: "wide"
},
```

- `alt` should describe what the photo **shows** — screen-reader users and
  Google both rely on it.
- `span: "wide"` makes a photo take two columns. Good for one standout image.
- Put the strongest photo first.

### Removing a photo

Delete its `{ ... }` block from `GALLERY`, and delete the file from
`assets/img/`. If you empty the list completely, the gallery section and its
nav link hide themselves automatically — the page will not show a blank gap.

### Keeping files small

Aim for under ~400 KB each. Use [squoosh.app](https://squoosh.app) (free, runs
in your browser) to shrink them. See `assets/img/README.txt` for details.

---

## Part 3 — Adding a new publication

1. Open `assets/js/data.js`
2. Find the `PUBLICATIONS` list near the top
3. Copy an existing block and paste it **above** the others (newest first)
4. Change the values

```js
{
  year: 2027,
  authors: "**Marjuk, M. S.**, Someone, A., & Another, B.",
  title: "Your new paper title",
  journal: "Journal Name, volume, pages",
  publisher: "Elsevier",
  doi: "https://doi.org/10.xxxx/xxxxx",
  tags: ["Remote Sensing", "First Author"]
},
```

Notes:
- Wrap your own name in `**double asterisks**` to make it bold.
- `tags` become the filter buttons. Reuse existing tag names so the filters stay tidy.
- Remember the comma after the closing `}`.

Then update your citation numbers at the bottom of the same file:

```js
metrics: {
  publications: 9,     // ← bump these
  citations: 110,
  hIndex: 4,
  ...
}
```

---

## Part 4 — Adding a new AI model

### 4a. Add the card

Open `assets/js/data.js`, find the `MODELS` list, and add a block:

```js
{
  name: "My New Model",
  slug: "my-new-model",
  status: "development",        // live | development | planned
  icon: "chart",                // chart | waves | eye | dna | brain | cube
  summary: "One or two sentences on what it predicts.",
  stack: ["Python", "TensorFlow"],
  metrics: [
    { label: "Accuracy", value: "94%" },
    { label: "Region", value: "Bay of Bengal" }
  ],
  url: ""                       // leave empty until the page exists
},
```

This card appears immediately on both the homepage and `/models/`.

### 4b. Give it a full page

1. Go into the `models/` folder
2. Copy `_TEMPLATE.html` and rename the copy to match your slug —
   e.g. `my-new-model.html`
3. Open it and follow the instructions in the comment at the top
4. Back in `data.js`, point the card at it and mark it live:

```js
url: "my-new-model.html",
status: "live",
```

5. Add it to `sitemap.xml` so Google finds it:

```xml
<url>
  <loc>https://syedmarjuk.netlify.app/models/my-new-model.html</loc>
  <lastmod>2027-01-15</lastmod>
</url>
```

### 4c. Running a real model in the browser

Netlify serves static files, so the model has to run on the visitor's machine
or on an external service. Three practical options:

| Option | Good for | How |
|---|---|---|
| **Write the equation directly** | Band-math expressions, regression formulas | Plain JavaScript in the page. Simplest and fastest. |
| **TensorFlow.js / ONNX Runtime Web** | Small trained networks | Export the model, put it in `assets/models/`, load it with a relative path. |
| **Link out** | Large models, MATLAB models | Link to a Google Colab notebook or a hosted API. |

Your ANN → SeaDAS band-math expressions are ideal for option 1 — they are just
arithmetic, so they run instantly in the browser with no model file at all.

---

## Part 5 — Editing text on the page

Most text comes from `data.js`. A few things live directly in `index.html`:

| What | Where to look in `index.html` |
|---|---|
| The big headline | search for `Reading the ocean` |
| The About paragraphs | search for `<!-- ============ ABOUT` |
| Section titles | search for the section name, e.g. `Research Focus` |
| Contact wording | search for `Open to collaboration` |

Change only the words between the tags. For example:

```html
<h2>Open to collaboration</h2>
        ↑ change this text only
```

---

## Part 6 — Previewing before you publish

### You do not need a server

**Just double-click `index.html`.** It opens in your browser and everything
works — the models, the sliders, the gallery, the theme toggle. There is no
build step and nothing to start.

This is the simplest way and it is what you should normally do.

### If you want a local server anyway

A server matches the live site slightly more exactly (clean `/models/` URLs
instead of `/models/index.html`). From inside this folder:

```bash
python -m http.server 8000
```

Then open **http://localhost:8000** — note `http://`, not `https://`.
Press `Ctrl+C` in the terminal to stop it.

### If localhost shows nothing

Almost always one of these four:

| Symptom | Cause | Fix |
|---|---|---|
| "This site can't be reached" | The server was never started, or you closed the terminal | Start it again, and leave that terminal window open |
| Blank page or directory listing | You started the server in the wrong folder | `cd` into `syedmarjuk-portfolio` first — `index.html` must be in the folder you serve |
| "Address already in use" | An old server is still running on that port | Pick a different port number, or close it (below) |
| Page loads but looks unstyled | You opened a stale cached copy | Hard refresh with `Ctrl + Shift + R` |

**To find and stop an old server** (PowerShell):

```bash
Get-NetTCPConnection -LocalPort 8000 -State Listen | Select-Object OwningProcess
```

Then stop it by the PID it prints:

```bash
Stop-Process -Id <PID>
```

Honestly though — double-clicking `index.html` avoids all of this.

---

## Using Git (optional, once you are comfortable)

First time only:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/syedmarjuk-portfolio.git
git push -u origin main
```

Every time after that:

```bash
git add .
git commit -m "Added new publication"
git push
```

Netlify redeploys automatically on every push.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Page is blank / unstyled | You probably moved a file. `index.html` must sit in the root, `style.css` inside `assets/css/`. |
| A section is empty | A comma or quote is missing in `data.js`. Press `F12` in the browser, open **Console**, and read the red error — it names the line. |
| Old version still showing | Hard refresh: `Ctrl + Shift + R`. |
| Download CV does nothing | The PDF is missing from `assets/`, or the filename does not match `cvPath` in `data.js`. |
| Google Scholar link is wrong | Open `data.js` and replace `YOUR_ID_HERE` in the `scholar:` line with your real Scholar ID. |
| Netlify build failed | Check that **Publish directory** is `.` and **Build command** is empty. |

---

## Design notes

- **Type:** Exo (headings) · Inter (body) · Roboto Mono (data, species names, labels)
- **Theme:** deep-ocean dark by default, with a light mode toggle. The choice is
  remembered in the browser.
- **Motion:** the drifting particle field in the hero is a plankton/neural-network
  motif drawn on a `<canvas>`. It pauses automatically when scrolled out of view
  or when the tab is hidden, and is switched off entirely for visitors who have
  "reduce motion" enabled in their operating system.
- **Accessibility:** skip link, visible focus rings, keyboard-operable menu
  (Escape closes it), all interactive targets meet the WCAG 2.2 AA 24×24px
  minimum, and every colour pair was checked for contrast in both themes.
- **No external JavaScript.** Nothing to break, nothing tracking your visitors.
  The only outside request is Google Fonts.

---

## A note on privacy

Your CV contains personal details that are normal on a CV but risky on a public
web page. These were deliberately **left off** the site:

- Passport number and validity
- Date of birth
- Parents' names
- Religion, marital status, blood group
- Mobile phone number

Anyone can read a website, including automated scrapers. Email, LinkedIn, ORCID
and Google Scholar are on the site — those are the normal professional channels.

If you do want your phone number shown, add it to the `contactLinks` section of
`assets/js/main.js`. I would recommend against it.

---

© M. Syed Marjuk
