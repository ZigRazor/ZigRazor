# ZigRazor - Personal Portfolio (Angular)

This is a minimal Angular + TypeScript portfolio scaffold generated for the GitHub user **ZigRazor**.
Fill in content (about, projects, contact) and then build & deploy to GitHub Pages.

## Quick start

1. Install dependencies:
   ```
   npm install
   ```

2. Run locally:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Deploy to GitHub Pages:
   - Create a repository named `ZigRazor.github.io` (for user site) or any repo for project site.
   - Build and publish the contents of `dist/zigrazor-portfolio`.
   - Alternatively use `angular-cli-ghpages` or `gh-pages` to automate deployment.

## Notes

- This scaffold intentionally omits node_modules.
- Edit components in `src/app/` to customize.
- The portfolio contains sections: Home, About, Projects, Contact.



## Multi-page & Features

This updated scaffold includes:
- Angular routing (Home, About, Projects, Contact)
- Animations for the project detail modal (Angular animations)
- Theme toggle (dark/light) stored in localStorage
- Project detail modal with animated backdrop & panel

To run:
```
npm install
npm start
```


## Route Page Transitions

This version adds animated transitions between pages using Angular animations.
When navigating, the outgoing page fades and slides up while the new one fades and slides in.
You can tweak animation duration and easing inside `app.component.ts`.
