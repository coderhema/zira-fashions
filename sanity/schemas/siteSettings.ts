import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      description: "Full-width background image displayed on the homepage hero section.",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "heroImageAlt",
      title: "Hero Image Alt Text",
      type: "string",
      description: "Describe the hero image for accessibility and SEO.",
      initialValue: "Model wearing a Zira Fashions outfit",
      validation: (R) => R.required().max(150),
    }),
  ],
  preview: {
    select: { title: "heroImage" },
    prepare: () => ({ title: "Site Settings" }),
  },
});

export default siteSettingsSchema;
