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
            type: "string",
            name: "description",
            label: "Date de l'édition",
            ui: {
              component: "textarea",
            },
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
