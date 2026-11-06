# Matt Prior Watson | Colourist portfolio

A static [Astro](https://astro.build) site hosted on Cloudflare Workers, deployed automatically from GitHub on every push.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # build to ./dist (this is what Cloudflare runs)
npm run preview    # preview the built site locally
npm run deploy     # build + deploy straight from your machine (optional)
```

## Where everything lives

```
public/
  favicon.svg                  Browser tab icon (placeholder monogram, replace freely)
  media/
    og.jpg                     Social share image (see "Needed before launch")
  _headers                     Cloudflare security + caching headers

src/
  assets/                      ALL photos used by pages go here (processed at build time)
    profile.webp               About page photo
    projects/
      <project-name>/
        thumb.webp             Thumbnail for Credits list
        01.webp, 02.webp ...   Gallery stills for that project
  content/
    site.json                  Name, role, contact, socials, bio, showreel
    projects/
      <project-name>.json      One file per project
```

The folder name under `src/assets/projects/` is just a convention to keep files tidy. What matters is that the path written inside the project's JSON file is correct.

---

## Required for the build to pass

Images in `src/assets/` are checked at build time. **If any referenced image is missing, the build fails and nothing deploys.**

| # | File | Referenced from | Notes |
|---|------|-----------------|-------|
| 1 | `src/assets/profile.webp` | `src/pages/about.astro` (import at the top) | Must exist. If you use a different format, change the import line in `about.astro` to match, e.g. `profile.jpg`. |
| 2 | `src/assets/projects/<project-name>/thumb.webp` | `thumbnail` in each project JSON | **Every** project needs one. |
| 3 | Each gallery image, e.g. `src/assets/projects/<project-name>/01.webp` | `gallery[].src` in each project JSON | Only needed if listed. Remove an entry from `gallery` if you don't have the image. `gallery` can be left as `[]`. |

### Rules that cause most failed builds

1. **Paths in a project JSON are relative to that JSON file.** From `src/content/projects/my-film.json`, the thumbnail path is:
   ```
   "thumbnail": "../../assets/projects/my-film/thumb.webp"
   ```
2. **Filenames are case-sensitive on Cloudflare.** macOS and Windows ignore case, so `Thumb.webp` may work locally and fail on the Linux build server. Keep everything lowercase and match the JSON exactly.
3. **Commit the images.** An image that exists only on your computer will fail the Cloudflare build. Check with `git status` before pushing.
4. **Avoid spaces in filenames.** Use `my-film/thumb.webp`, not `My Film/Thumb.webp`.
5. **Accepted formats:** WebP, JPG, PNG or AVIF. Whatever you use, the extension in the JSON must match the real file.

### The placeholder project

`src/content/projects/example.json` currently expects these three files:

```
src/assets/projects/example/thumb.webp
src/assets/projects/example/01.webp
src/assets/projects/example/02.webp
```

Until you have real work, either drop in any temporary images with those names, or delete `example.json` and add a real project. Once real projects are in, delete `example.json` and the `example` folder. It also contains placeholder text and a test video ID.

---

## Needed before launch (won't break the build)

These won't fail a deploy, but the site looks unfinished without them.

| What | Where | Details |
|------|-------|---------|
| Social share image | `public/media/og.jpg` | 1200 x 630 px JPG, ideally under 300 KB. Without it, links shared on social media, Slack or WhatsApp have no preview image. To skip it, set `"ogImage": ""` in `site.json`. |
| Favicon | `public/favicon.svg` | A placeholder "M" is included. |
| Contact details | `src/content/site.json` | `email`, `phone` (use `+44 7...` with no `0` after `+44`), `location`, `socials`. |
| Bio | `src/content/site.json` | `about.bio` is a list of paragraphs. |
| Showreel | `src/content/site.json` | Set `reel.id` to the real Vimeo or YouTube ID. Currently `000000000`. |
| Project videos | each project JSON | Set `video.id`. For **unlisted** Vimeo videos, also add `"hash"`, the `h=` value from the unlisted share link. |
| Site URL | `astro.config.mjs` | Replace `https://yourdomain.com` with the real domain. This fixes canonical links, the sitemap and `robots.txt`. |
| Custom domain | Cloudflare dashboard (or `routes` in `wrangler.jsonc`) | Attach once the domain is ready. |
| Project wording | project JSON | Replace "Short Film · DP" and "Director of Photography" with colourist roles. |

Videos are **not** stored in this repo. They are embedded from YouTube or Vimeo by ID. Don't put video files in `public/`.

---

## Image guidelines

Astro resizes and converts images to optimised versions at build time, so upload good-quality originals. It will not make a small image larger.

| Image | Minimum width | Suggested shape | Notes |
|-------|---------------|-----------------|-------|
| `profile.webp` | 800 px | Portrait or square | Displayed at up to 800 px wide. |
| `thumb.webp` | 800 px | 16:9 (e.g. 1600 x 900) | Using the same ratio for every project keeps the Credits list tidy. |
| Gallery stills | 800 px (1200 px for sharper results) | Any, 16:9 or 2.39:1 works well | Shown in a grid, scaled to fit. |
| `og.jpg` | 1200 px | 1200 x 630 | Plain public file, not processed. |

Keep each source file under about 2 MB. It keeps the repo small and builds quick.

---

## Adding a new project

1. Create the image folder and add the images:
   ```
   src/assets/projects/my-film/thumb.webp
   src/assets/projects/my-film/01.webp
   ```
2. Copy `src/content/projects/example.json` to `src/content/projects/my-film.json`. The filename becomes the URL: `/projects/my-film`.
3. Edit the new JSON: title, subtitle, `order` (lower numbers appear first), video, credits, awards. Update every image path to point at `my-film`.
4. Run `npm run build` locally to confirm it passes.
5. Commit and push.

Project fields:

| Field | Required | Notes |
|-------|----------|-------|
| `title`, `subtitle`, `order`, `thumbnail`, `video` | Yes | `video.provider` is `"youtube"` or `"vimeo"`. |
| `year`, `role`, `bio` | No | Shown under the title. `bio` also becomes the page's meta description. |
| `gallery`, `credits`, `awards` | No | Sections are hidden when empty. |

---

## Deploying

Pushing to the connected GitHub branch triggers a Cloudflare build. For it to succeed:

- `package.json` **and** `package-lock.json` are committed. Cloudflare installs from them.
- Every image referenced in `src/content/projects/*.json` and `about.astro` is committed.
- Image filenames match the JSON exactly, including case.
- `npm run build` passes on your machine.

`node_modules/` and `dist/` are git-ignored. Cloudflare installs and builds them itself.

### Pre-push checklist

- [ ] `npm run build` completes with no errors
- [ ] `git status` shows no untracked images or missing files
- [ ] Filenames are lowercase and match the JSON
- [ ] `package-lock.json` is committed

---

## Troubleshooting

| Problem | Likely cause |
|---------|--------------|
| Build fails mentioning an image that can't be found | Wrong relative path in the JSON, wrong filename or case, or the image isn't committed. |
| Builds locally but fails on Cloudflare | Filename case mismatch, or a file or `package-lock.json` change that wasn't committed. |
| "Cannot find module" on Cloudflare | A dependency is missing from `package.json`. Run `npm install <package>` and commit both `package.json` and `package-lock.json`. |
| Shared links show no preview image | `public/media/og.jpg` is missing. |
| Video shows "unavailable" | Wrong ID, or an unlisted Vimeo video without its `hash`. |
