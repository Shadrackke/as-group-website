# A & S Group Property & Services Website

This is a CMS-ready Netlify website inspired by modern property listing platforms, but fully customised for A & S Group.

## Features
- Property search by rent/sale, property type, county, town/city/estate, bedroom type and price.
- Featured properties on the homepage with rotating display.
- Property detail pop-up with photos, description, size, location and price.
- Services page with expandable service details.
- Reports & publications section for PDF uploads.
- People / Offices page for office and team contacts.
- Decap CMS admin dashboard at `/admin/`.

## How to deploy with CMS
1. Create a GitHub repository and upload these files.
2. Connect the repository to Netlify.
3. In Netlify, enable Identity.
4. Enable Git Gateway.
5. Invite yourself as a user under Identity.
6. Visit `https://your-site.netlify.app/admin/` to manage properties, services, reports and offices.

## Editing Content Manually
You can also edit these JSON files directly:
- `content/properties.json`
- `content/services.json`
- `content/reports.json`
- `content/offices.json`
- `content/settings.json`

## Important
For admin uploads to work, deploy through GitHub + Netlify. Drag-and-drop deployment will show the website, but CMS login and upload will not work.


## Ultra Clean Hero Update
This version removes text from the background hero image and reduces the hero headline size for a cleaner, more premium top section. Replace `index.html`, `style.css`, and the `assets` folder in GitHub, then commit changes.
