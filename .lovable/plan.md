# Project images and admin experience plan

## Goal
Fix every project image on the public portfolio, make image management visual and safe, and polish the admin panel without changing the public site's design.

## Confirmed findings
- The ten saved projects currently contain development-only image paths such as `/src/assets/love-paws-960.webp`. Those paths are saved in website content and can fail after deployment. Two projects also have no screenshot at all, so they correctly fall back to placeholders.
- The public project gallery trusts a saved image path before its bundled preview. A stale or broken saved path therefore prevents the valid built-in preview from being used.
- Media currently supports upload, copy-link, pick, and delete only. Thumbnails crop everything to 16:9, with no full-image viewer or editor.
- The admin says uploads are limited to 10 MB; the storage bucket enforces that limit, but the browser does not reject oversized files before trying to process them.
- “Give each project its own page” is enabled in saved settings, and the sitemap publishes project-page links, but no project detail page exists. Those links would lead to missing pages.
- “Email for new-message alerts” is shown as a setting but is not connected to an alert flow.

## Implementation

### 1. Repair and safeguard project images
- Normalize the ten saved project records so bundled screenshots are represented by stable project identities rather than development-only asset paths.
- Keep uploaded/custom screenshots as explicit media URLs, but treat stale `/src/assets/...`, missing, or failed images as invalid and fall back to the bundled optimized preview.
- Add an image-error fallback in both the public gallery and project editor so a broken URL never leaves a broken image tile.
- Clearly mark projects that genuinely have no screenshot and add a direct “Add screenshot” action in the project editor.
- Keep the existing responsive WebP variants for fast loading.

### 2. Add a real media viewer and image editor
- Clicking a media item opens a detail viewer showing the uncropped image, dimensions, file type, size, upload date, link, and where it is used.
- Add crop, zoom, rotate, and flip controls with useful presets: Free, Project 16:10, Share 1200×630, Square, and Portrait.
- Save edits as a new optimized WebP by default so existing pages are not silently changed; offer “use edited image” when opened from an image field.
- Add search and sorting by newest, oldest, name, and size. Keep bundled website images read-only but allow viewing and creating an edited copy.
- Replace the browser delete prompt with a proper confirmation. Show every current usage and block accidental deletion of an in-use upload until it is replaced or explicitly confirmed.
- Validate file type and the 10 MB limit before processing; show per-file success/failure for multi-upload.

### 3. Improve image fields across admin
- Use the same viewer/editor from Projects, Team, Profile, Opening, SEO share image, and Settings logo fields.
- Show the full image without misleading thumbnail crops, plus clear actions for Upload, Library, Edit crop, Replace, and Remove.
- Add recommended aspect/dimensions beside each image field so editors know which crop preset fits.

### 4. Admin-wide usability fixes
- Add consistent loading, empty, and error states to Overview, Messages, Analytics, Media, Chatbot, Settings, and Profile.
- Hide or disable actions an Editor cannot use instead of letting them fail after clicking.
- Improve phone layouts for tab groups, long account rows, image actions, and modal footers.
- Add unsaved-change protection to content and project editors when navigating away or closing an edited project.
- Make important project-page information visible when project pages are enabled instead of hiding the page address under “More options.”

### 5. Correct misleading settings
- Implement the `/work/:slug` project detail page before leaving “project pages” available, and ensure the sitemap only lists routes that exist.
- Mark message-email alerts as unavailable until delivery is configured, rather than presenting a setting that does nothing.
- Keep team-account controls, backups, SEO, analytics, and the API-free chatbot; only clarify states and errors around them.

## Verification
- Test all ten public project cards on the local preview and deployed-style production build; every card must show either its real screenshot or an intentional “screenshot needed” state.
- Test upload, full-image view, crop presets, rotate/flip, save-as-new, reuse, usage detection, and protected deletion.
- Test Admin and Editor permissions, unsaved changes, empty/error states, and all admin pages at phone and desktop widths.
- Add focused tests for image-path normalization/fallback, 10 MB rejection, crop output sizing, project-page sitemap behavior, and role-gated actions.
