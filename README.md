# Best Known Pest & Wildlife homepage

This is a static HTML, CSS, and JavaScript project. It needs no packages or build step.

## Preview with VS Code Live Server

1. Open this folder in VS Code with **File → Open Folder**.
2. From **Extensions**, install **Live Server** if you do not have it.
3. Right-click `index.html` and select **Open with Live Server**. The page opens in your browser and reloads when you save changes.
4. To check the layouts, open the browser’s developer tools, toggle the device toolbar, and try 1440, 1024, 768, and 390 pixels. Live Server lets you check field validation and shows a preview message when you try to submit a valid form.

## Deploy to Netlify and share the URL

1. Sign in to your Netlify team account and open [Netlify Drop](https://app.netlify.com/drop).
2. Drag in this project folder with `index.html` at its top level. For a Git-connected project, leave the build command blank and set the publish directory to `.`.
3. In the new project's Netlify dashboard, open **Forms** and enable form detection. Redeploy so Netlify can detect the forms. [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/).
4. Confirm that `service-request` and `newsletter` appear. Submit sample data from the deployed page and check that the entries appear under their respective forms. Configure submission notifications with the client's approved recipient.
5. Share the `.netlify.app` URL shown in the dashboard. Use the same project's deploy page when uploading updates.

The newsletter form collects signup requests. Connect your email marketing provider or process the requests in your mailing list workflow before announcing the newsletter.

## Make updates

- Edit page copy, photo references, hours, and links in `index.html`.
- Adjust the palette, typography, and spacing in `css/variables.css`. Section styles live in `css/style.css` and responsive rules in `css/responsive.css`.
- `js/main.js` handles the menu, review selection, service form shortcuts, and preview form feedback. The FAQ uses native HTML disclosure controls. Scroll reveals are marked with `data-reveal` in `index.html`. Timings and keyframes live in `css/motion.css`.
- Images and icons in `assets/` came from the Figma export. The map uses the supplied SVG, including its red highlight and white pin. The service-area copy follows the [client’s published coverage list](https://bestknownpest.com/service-area/). The original ZIP remains the source for the full export.

The hero thumbnail links to the services section. Blog destinations and publication dates follow the [client’s published blog](https://bestknownpest.com/blog/). Source URLs for review excerpts are recorded in the `cite` attributes in `index.html`. The FAQ uses published service information and routes case-specific questions to Brendan.
