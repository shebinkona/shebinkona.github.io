# Shebin Koonathethil — Portfolio

A static, responsive personal portfolio for Shebin Koonathethil, built with HTML5, CSS3, Bootstrap 5, JavaScript and jQuery. It has no build step or backend and can be hosted free on GitHub Pages.

## Preview locally

Open `index.html` directly in a browser. An internet connection is required for the CDN-hosted fonts, Bootstrap, icons, jQuery and QR generator.

For the most accurate PDF and sharing behaviour, serve the folder with any simple static web server, then open its local URL.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder, preserving the directory structure below.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. When GitHub provides the live URL, confirm the portfolio loads and update any repository description or social links as desired.

All site paths are relative, so the portfolio works from either a user site (`username.github.io`) or a project site (`username.github.io/repository-name`). The canonical and Open Graph URL are set from the current page address at runtime.

## Recommended directory structure

```text
/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── img/
    │   ├── profile-placeholder.svg
    │   └── profile.jpg              # optional; add when available
    └── docs/
        └── Shebin_Koonathethil_CV.pdf
```

## Optional updates

- **Profile photo:** add a professional image at `assets/img/profile.jpg`. Until then, the designed `SK` monogram is shown automatically.
- **LinkedIn posts:** add LinkedIn share/post IDs to the `linkedInPostIds` array near the top of `assets/js/script.js`. The section stays hidden while the array is empty.
- **Additional verified documents:** copy the existing document-card pattern in `index.html` only after adding the real file under `assets/docs/`.

The older `CV-ShebinKK.pdf` and the root working copy of the newer CV are intentionally excluded by `.gitignore`; only the current public resume under `assets/docs/` should be published.
