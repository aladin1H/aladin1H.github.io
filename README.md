# Aladin Ahmed — Engineering Portfolio

Personal portfolio website · **https://aladin1h.github.io**

Plain HTML, CSS and JavaScript — no frameworks, no build step, no server. Hosted free on GitHub Pages.

---

## 1. File structure

Only **one folder** — everything else sits at the top level, so it can be uploaded without dragging folders.

```
index.html            ← ALL content (text, projects, experience…). This is the file you edit.
style.css             ← Look & feel (colours, layout). Rarely needs editing.
script.js             ← Interactivity (filters, pop-ups, dark mode…). No need to edit.
favicon.svg / .png    ← Browser-tab icon
404.html, robots.txt, sitemap.xml, project-template.html
assets/               ← EVERY image, video, 3D model, font and PDF (résumé, CV, papers)
```

File names inside `assets/` start with the project they belong to, e.g. `gripper-thumb.jpg`, `ev-forecasts.jpg`.

---

## 2. Uploading to GitHub (file picker only — no folder dragging needed)

### Step 1 — Upload the main files
1. Unzip **`portfolio-site.zip`** and open the `portfolio-site` folder.
2. On GitHub, open your repository → **Add file → Upload files** → **choose your files**.
3. Select all the files at the top level (`index.html`, `style.css`, `script.js`, `404.html`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, `project-template.html`, `README.md`) → **Commit changes**.

### Step 2 — Create the `assets` folder (once)
1. **Add file → Create new file**.
2. In the name box type exactly: `assets/README.txt`
   (typing the `/` turns `assets` into a folder).
3. Type anything in the file body, e.g. `media files` → **Commit changes**.

### Step 3 — Upload everything into `assets`
1. Click the **`assets`** folder in your repository so you are *inside* it.
2. **Add file → Upload files** → **choose your files**.
3. Open the `assets` folder on your computer, press **Ctrl + A** to select all files → **Open** → **Commit changes**.
   GitHub accepts about 100 files per upload; if it complains, select half the files, commit, then upload the rest.

### Step 4 — Check GitHub Pages
1. **Settings → Pages** → Source: *Deploy from a branch* · Branch `main` · folder `/ (root)` → **Save**.
2. Wait 1–2 minutes, open **https://aladin1h.github.io** and press **Ctrl + F5**.

Watch progress under the **Actions** tab (green tick = live). Uploading a file with the same name replaces the old one.

> Old folders from earlier versions (`images`, `videos`, `models`, `fonts`, `files`, `projects`) are no longer used. You can leave them or delete them.

---

## 3. Editing content (no software needed)

Every change follows the same pattern:

1. On GitHub, click **`index.html`** → click the **✏️ pencil** icon (Edit).
2. Press **Ctrl + F** and search for what you want to change.
   Search **`TODO: UPDATE HERE`** to find every spot that still needs your information.
3. Edit the text → click **Commit changes** → live in ~1 minute.

**Yellow dashed boxes** on the live site are placeholders (`<span class="todo">…</span>`).
Replace them with real content or delete them before sending the link to recruiters.

> Tip: to check your edits before going live, download the repo and double-click `index.html` — it opens in your browser.

### Common edits

| What | Where in `index.html` |
|---|---|
| Name, headline, intro paragraph | `01 SUMMARY` |
| Quick-facts box (position, location, "Open to") | `title-block` in `01 SUMMARY` |
| Skills | `02 SKILLS` — edit the `<li class="chip">` items |
| Projects | `03 PROJECTS` (see §5) |
| Papers / research | `04 RESEARCH` |
| Jobs | `05 EXPERIENCE` — copy a `<li class="timeline-item">` block |
| Degrees | `06 EDUCATION` |
| Certifications / awards | `07 ACHIEVEMENTS` — copy an `<article class="card achv">` block |
| Email, LinkedIn, phone | `08 CONTACT` and `hero-links` in `01 SUMMARY` |

---

## 4. Photos, résumé and CV

**Profile photo**
1. Crop a professional photo roughly square (e.g. 800 × 800 px), save as **`profile.jpg`**.
2. On GitHub open the `assets` folder → **Add file → Upload files** → upload `profile.jpg` → Commit.
3. In `index.html` change `assets/profile-placeholder.svg` to `assets/profile.jpg`.

**Résumé** — upload a new PDF named exactly **`Aladin_Ahmed_Resume.pdf`** into `assets/`. It replaces the old one; no code change needed.

**CV** — upload **`Aladin_Ahmed_CV.pdf`** into `assets/`. The "CV" buttons are hidden until this file exists, then appear automatically.

**Keep images small** so the site stays fast: compress JPG/PNG at **https://squoosh.app** (aim for under ~250 KB each).

---

## 5. Adding or editing a project

Each project in `index.html` is one block:

```html
<article class="project-card reveal" id="p-my-project" data-category="robotics embedded">
  <div class="project-thumb">
    <img src="assets/my-project.jpg" alt="Describe the image" loading="lazy" width="800" height="500">
    <span class="badge badge--completed">Completed</span>
  </div>
  <div class="project-body">
    <span class="project-cat">Robotics · Embedded</span>
    <h3>Project title</h3>
    <p class="project-summary">One or two sentences shown on the card.</p>
    <ul class="chip-list"><li class="chip">Arduino</li><li class="chip">C++</li></ul>
  </div>
  <div class="project-foot">
    <button class="project-open" type="button">View details <svg aria-hidden="true"><use href="#i-arrow"></use></svg></button>
  </div>
  <div class="project-details">
    … problem / methodology / results / tools / gallery / video / links (shown in the pop-up) …
  </div>
</article>
```

**To add a project:** copy an existing `<article class="project-card">…</article>` block, paste it where you want it in the grid, then change:

- **`id`** — unique, starts with `p-`. Share a direct link to it: `https://aladin1h.github.io/#p-my-project`
- **`data-category`** — one or more of: `mechanical` `robotics` `ai` `simulation` `control` `embedded` `vision` `software`
  (filter buttons and counts update automatically; a filter with zero projects hides itself)
- **Badge** — `badge--ongoing` (In progress) · `badge--completed` (Completed) · `badge--course` (Course project)
- Text, chips, image, and the `project-details` content.

**To add a new filter category:** add a button in the `filter-bar`, e.g.
`<button class="filter-btn" type="button" data-filter="manufacturing" aria-pressed="false">Manufacturing <span class="count"></span></button>`
and use `manufacturing` in your projects' `data-category`.

**Gallery images (click to view full-screen):**
```html
<figure><a href="assets/fea.png" data-lightbox><img src="assets/fea.png" alt="Von Mises stress contour" loading="lazy"></a><figcaption>Von Mises stress</figcaption></figure>
```

**GIFs** work anywhere an image does (just use the `.gif` file). Keep them short — they can be large.

**Videos**
- *YouTube (recommended — keeps your repo small):*
  `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Demo" loading="lazy" allowfullscreen></iframe></div>`
  (`VIDEO_ID` is the part after `watch?v=` in the YouTube link.)
- *Your own MP4* (put it in `assets/`, under ~20 MB; GitHub rejects files over 100 MB):
  `<div class="video-frame"><video controls preload="none" poster="assets/thumb.jpg"><source src="assets/demo.mp4" type="video/mp4"></video></div>`

**Links (repo, paper, report):**
```html
<a class="btn btn-sm" href="https://github.com/aladin1H/REPO" target="_blank" rel="noopener">GitHub repository</a>
<a class="btn btn-sm" href="assets/report.pdf" target="_blank" rel="noopener">Technical report (PDF)</a>
```

**Full project page (optional):** copy `project-template.html` to e.g. `gripper.html`, edit it, and link to it from the project's `detail-links`.

---

## 6. Interactive 3D CAD models

Visitors can rotate and zoom your models. The viewer loads **only when someone clicks "View 3D model"**, so it never slows the page.

1. Export your model as **`.glb`**:
   - If your SolidWorks version offers **File → Save As → glTF/GLB**, use that.
   - Otherwise save as **STL** (or STEP), open the free **Blender** → *File → Import → STL* → *File → Export → glTF 2.0* → format **glTF Binary (.glb)**.
   - Aim for under ~5 MB (simplify the mesh / lower STL resolution if needed).
2. Upload it into `assets/` (e.g. `assets/gripper.glb`).
3. In the project's details, use:
   `<div class="model-slot" data-model="assets/gripper.glb" data-poster="assets/gripper.jpg"><button class="btn" type="button">View 3D model</button></div>`
   (`data-poster` is an optional still image shown before loading.)

If the file isn't uploaded yet, visitors just see "3D model coming soon."

---

## 7. Optional: visitor statistics (GoatCounter)

Free, privacy-friendly, no cookie pop-up — visitors see nothing.

1. Sign up at **https://www.goatcounter.com**, choose a code (e.g. `aladin`).
2. In `index.html`, find `OPTIONAL VISITOR ANALYTICS`.
3. Replace `YOURCODE` with your code and delete the comment markers around the `<script>` line.
4. Commit. View your stats at `https://YOURCODE.goatcounter.com`.

---

## 8. Changing colours or fonts

Open `style.css` → section **1. DESIGN TOKENS**. Change `--accent` (main blue) and `--teal` for light mode, and the same names under `[data-theme="dark"]` for dark mode.

---

## 9. Features included

Responsive layout & mobile menu · light/dark mode (remembers choice) · active-section highlighting · smooth scrolling ·
project filtering with counts · project pop-ups with shareable links · full-screen image viewer (keyboard arrows / Esc) ·
lazy-loaded images, videos and 3D models · subtle scroll animations (disabled for visitors who prefer reduced motion) ·
keyboard navigation & skip link · SEO meta tags, structured data, sitemap · social-media preview image · custom favicon ·
auto-hidden links to files not yet uploaded.

Fonts: IBM Plex Sans & IBM Plex Mono (SIL Open Font License, see `assets/OFL-LICENSE.txt`).
