import { defineField, defineType } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  preview: { select: { title: "name", subtitle: "price", media: "image" } },
  fields: [
    defineField({ name: "name", title: "Product Name", type: "string", validation: (R) => R.required().min(2).max(120) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: "sku", title: "SKU / Reference", type: "string" }),
    defineField({ name: "price", title: "Price", type: "string", description: "e.g. \u20a612,000", validation: (R) => R.required() }),
    defineField({ name: "originalPrice", title: "Original Price (sale items only)", type: "string" }),
    defineField({ name: "size", title: "Size", type: "string", description: "e.g. UK 6/8", validation: (R) => R.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: [{ title: "Denim", value: "denim" }, { title: "Dresses", value: "dresses" }, { title: "Tops", value: "tops" }, { title: "Sets", value: "sets" }, { title: "Sale", value: "sale" }, { title: "Kids", value: "kids" }], layout: "radio" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "image", title: "Product Image", type: "image", options: { hotspot: true }, validation: (R) => R.required() }),
    defineField({ name: "tryOnGarmentUrl", title: "Try-On Garment URL (bg removed)", type: "url", description: "Background-removed garment image for the AI try-on feature." }),
    defineField({ name: "isSoldOut", title: "Sold Out?", type: "boolean", initialValue: false }),
    defineField({ name: "isNew", title: "New Arrival?", type: "boolean", initialValue: true }),
    defineField({ name: "isKids", title: "Kids Item?", type: "boolean", initialValue: false }),
    defineField({ name: "listedDate", title: "Listed Date", type: "date" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
});

export default productSchema;
