import { defineField, defineType } from "sanity";

/** Field-level localisation: every translatable value is `{ en, fa }`. English is required, Persian optional. */
const fa = { title: "فارسی", options: { direction: "rtl" } };

export const localeString = defineType({
  name: "localeString",
  title: "Localised string",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fa", title: fa.title, type: "string" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Localised text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "fa", title: fa.title, type: "text", rows: 3 }),
  ],
});

const blocks = { type: "array" as const, of: [{ type: "block" as const, styles: [{ title: "Normal", value: "normal" }], lists: [{ title: "Bullet", value: "bullet" }] }] };

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Localised rich text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", ...blocks }),
    defineField({ name: "fa", title: fa.title, ...blocks }),
  ],
});

export const localeTags = defineType({
  name: "localeTags",
  title: "Localised tags",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "fa", title: fa.title, type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
});

/** Image with hotspot and localised alt text. */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alt text", type: "localeString" })],
});
