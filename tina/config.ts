import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

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
                name: "title",
                label: "Titre de la page",
                required: true,
                isTitle: true,
              },
              {
                type: "string",
                name: "partnersDescription",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "partnersIntro",
                label: "Intro texte",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "partnersList",
                label: "Liste des partenaires",
                list: true,
                ui: {
                  itemProps: (item) => {
                    return { label: item?.name || 'Partenaire' }
                  },
                },
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Nom",
                  },
                  {
                    type: "image",
                    name: "logo",
                    label: "Logo",
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "Lien",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
