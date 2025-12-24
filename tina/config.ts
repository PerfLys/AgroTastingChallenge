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
            isTitle: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "coverImage",
            label: "Image de couverture",
          },
          {
            type: "image",
            name: "photos",
            label: "Galerie photos",
            list: true,
          },
          {
            type: "image",
            name: "pdfVinsAveugle",
            label: "PDF — Vins à l'aveugle",
          },
          {
            type: "image",
            name: "pdfVinsTable",
            label: "PDF — Vins servis à table",
          },
          {
            type: "image",
            name: "pdfVinsOfferts",
            label: "PDF — Vins offerts",
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
                type: "string",
                name: "heroTitle",
                label: "Titre Hero",
              },
              {
                type: "string",
                name: "heroSubtitle",
                label: "Sous-titre Hero",
              },
              {
                type: "string",
                name: "heroButtonEds",
                label: "Bouton Éditions",
              },
              {
                type: "string",
                name: "heroButtonAtc",
                label: "Bouton ATC",
              },
              {
                type: "string",
                name: "featuredTitle",
                label: "Titre Mis à la une",
              },
              {
                type: "string",
                name: "featuredText",
                label: "Texte Mis à la une",
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
