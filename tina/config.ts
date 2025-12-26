import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "editions",
        label: "Éditions",
        path: "src/content/editions",
        format: "json",
        ui: {
          filename: {
            // if true, the filename is read-only
            readonly: false,
            // the function used to generate the filename
            slugify: (values) => {
              return `${values?.year || 'new-edition'}`
            },
          },
        },
        fields: [
          {
            type: "number",
            name: "year",
            label: "Année",
            required: true,
          },
          {
            type: "datetime",
            name: "startDate",
            label: "Date de début",
            required: true,
            // https://tina.io/docs/reference/types/datetime
            ui: {
              dateFormat: "YYYY-MM-DD",
              timeFormat: false,
              // Persist as ISO 8601 (UTC)
              parse: (value) => {
                if (!value) return value;
                if (typeof value === "string") return value;
                const v: any = value;
                if (typeof v?.toDate === "function") return v.toDate().toISOString();
                if (v instanceof Date) return v.toISOString();
                return String(v);
              },
            },
          },
          {
            type: "datetime",
            name: "endDate",
            label: "Date de fin",
            // https://tina.io/docs/reference/types/datetime
            ui: {
              dateFormat: "YYYY-MM-DD",
              timeFormat: false,
              // Persist as ISO 8601 (UTC)
              parse: (value) => {
                if (!value) return value;
                if (typeof value === "string") return value;
                const v: any = value;
                if (typeof v?.toDate === "function") return v.toDate().toISOString();
                if (v instanceof Date) return v.toISOString();
                return String(v);
              },
            },
          },
          {
            type: "string",
            name: "description",
            label: "Description (optionnel)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "coverImage",
            label: "Image de couverture",
            description: "Image principale utilisée comme couverture (optionnel).",
          },
          {
            type: "image",
            name: "photos",
            label: "Photos",
            list: true,
            description: "Galerie photos de l'édition (liste d'images).",
          },
          {
            type: "image",
            name: "pdfVinsAveugle",
            label: "PDF – Vins à l’aveugle",
            description: "Upload/selection du PDF via le media manager (stocké dans /public/uploads).",
          },
          {
            type: "image",
            name: "pdfVinsTable",
            label: "PDF – Vins servis à table",
            description: "Upload/selection du PDF via le media manager (stocké dans /public/uploads).",
          },
          {
            type: "image",
            name: "pdfVinsOfferts",
            label: "PDF – Vins offerts",
            description: "Upload/selection du PDF via le media manager (stocké dans /public/uploads).",
          },
        ],
      },
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        templates: [
          {
            name: "home",
            label: "Accueil",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Titre de la page",
                required: true,
                isTitle: true,
              },
              {
                type: "image",
                name: "heroImage",
                label: "Image Hero",
              },
              {
                type: "string",
                name: "heroSubtitle",
                label: "Sous-titre Hero (Français) (ex: 11ème édition – du 14 au 15 mars 2025)",
              },
              {
                type: "string",
                name: "heroSubtitleEn",
                label: "Sous-titre Hero (English) (ex: 11th edition – March 14-15, 2025)",
              },
              {
                type: "string",
                name: "heroTextFr",
                label: "Texte description (Français)",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "heroTextEn",
                label: "Texte description (English)",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            name: "partenaires",
            label: "Partenaires",
            fields: [
              {
                type: "string",
                name: "titleFr",
                label: "Titre (FR)",
                required: true,
                isTitle: true,
                description: "Titre affiché sur la page /partenaires.",
              },
              {
                type: "string",
                name: "titleEn",
                label: "Title (EN)",
                required: true,
                description: "Title shown on the page /en/partenaires.",
              },
              {
                type: "string",
                name: "partnersDescriptionFr",
                label: "Description (FR)",
                ui: {
                  component: "textarea",
                },
                description: "Courte description sous le titre (FR).",
              },
              {
                type: "string",
                name: "partnersDescriptionEn",
                label: "Description (EN)",
                ui: {
                  component: "textarea",
                },
                description: "Short description under the title (EN).",
              },
              {
                type: "string",
                name: "partnersIntroFr",
                label: "Texte d’introduction (FR)",
                ui: {
                  component: "textarea",
                },
                description: "Texte affiché au-dessus de la grille de partenaires (FR).",
              },
              {
                type: "string",
                name: "partnersIntroEn",
                label: "Intro text (EN)",
                ui: {
                  component: "textarea",
                },
                description: "Text shown above the partners grid (EN).",
              },
              {
                type: "object",
                name: "partnersList",
                label: "Liste des partenaires",
                list: true,
                ui: {
                  itemProps: (item) => {
                    const name = item?.name || "Partenaire";
                    const slug = item?.slug ? ` (${item.slug})` : "";
                    return { label: `${name}${slug}` };
                  },
                },
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Nom",
                    required: true,
                    description: "Nom affiché dans la liste et sur la page partenaire.",
                  },
                  {
                    type: "string",
                    name: "slug",
                    label: "Slug",
                    required: true,
                    description:
                      "Identifiant d’URL, ex: 'ruinart' → /partenaires/ruinart (sans espaces, sans accents).",
                  },
                  {
                    type: "string",
                    name: "websiteUrl",
                    label: "Site web (optionnel)",
                    description: "Lien vers le site du partenaire (ouvre un nouvel onglet).",
                  },
                  {
                    type: "image",
                    name: "logo",
                    label: "Logo (optionnel)",
                    description: "Logo du partenaire (upload/selection via le media manager).",
                  },
                  {
                    type: "string",
                    name: "descriptionFr",
                    label: "Description (FR)",
                    ui: { component: "textarea" },
                    description: "Description affichée sur la page partenaire (FR).",
                  },
                  {
                    type: "string",
                    name: "descriptionEn",
                    label: "Description (EN)",
                    ui: { component: "textarea" },
                    description: "Description shown on the partner page (EN).",
                  },
                ],
              },
            ],
          },
          {
            name: "about",
            label: "Qui sommes-nous",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
          {
            name: "atcIndex",
            label: "ATC – Présentation",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
          {
            name: "atcDeroulement",
            label: "ATC – Déroulement",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
          {
            name: "atcParticipants",
            label: "ATC – Participants",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              {
                type: "string",
                name: "applicationFormUrl",
                label: "Lien formulaire (Google Form)",
              },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
          {
            name: "atcReglement",
            label: "ATC – Règlement",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
          {
            name: "contact",
            label: "Contact",
            fields: [
              { type: "string", name: "titleFr", label: "Titre (FR)", required: true },
              { type: "string", name: "titleEn", label: "Title (EN)", required: true },
              { type: "string", name: "descriptionFr", label: "Description (FR)" },
              { type: "string", name: "descriptionEn", label: "Description (EN)" },
              { type: "string", name: "email", label: "E-mail" },
              {
                type: "object",
                name: "phones",
                label: "Téléphones",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Contact" }) },
                fields: [
                  { type: "string", name: "name", label: "Nom" },
                  { type: "string", name: "number", label: "Téléphone" },
                ],
              },
              {
                type: "string",
                name: "bodyFr",
                label: "Contenu (Markdown) (FR)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bodyEn",
                label: "Content (Markdown) (EN)",
                ui: { component: "textarea" },
              },
              { type: "image", name: "coverImage", label: "Image de couverture" },
              { type: "image", name: "photos", label: "Photos (galerie)", list: true },
            ],
          },
        ],
      },
    ],
  },
});
