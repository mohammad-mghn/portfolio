import { defineField, defineType } from "sanity";
import { RtlInput } from "../components/RtlInput";

/**
 * Field-level localisation: every translatable value is `{ en, fa }`, edited side by side
 * (English on one side, Persian on the other, typed right to left). English is required,
 * Persian optional: the site falls back to English until the Persian is filled in.
 */
const fa = { title: "فارسی", components: { input: RtlInput } };
const sideBySide = { options: { columns: 2 } };

export const localeString = defineType({
  name: "localeString",
  title: "Localised string",
  type: "object",
  ...sideBySide,
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fa", type: "string", ...fa }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Localised text",
  type: "object",
  ...sideBySide,
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "fa", type: "text", rows: 3, ...fa }),
  ],
});

const blocks = { type: "array" as const, of: [{ type: "block" as const, styles: [{ title: "Normal", value: "normal" }], lists: [{ title: "Bullet", value: "bullet" }] }] };

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Localised rich text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", ...blocks }),
    defineField({ name: "fa", ...blocks, ...fa }),
  ],
});

/** Short labels entered as tags: scope, "open to", skills. */
export const localeTags = defineType({
  name: "localeTags",
  title: "Localised tags",
  type: "object",
  ...sideBySide,
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "fa", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, ...fa }),
  ],
});

/** An ordered list of sentences or paragraphs: bullets, facts, story paragraphs, highlights. */
export const localeList = defineType({
  name: "localeList",
  title: "Localised list",
  type: "object",
  ...sideBySide,
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "text", rows: 2 }] }),
    defineField({ name: "fa", type: "array", of: [{ type: "text", rows: 2 }], ...fa }),
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
