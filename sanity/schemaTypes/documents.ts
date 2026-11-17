import { defineArrayMember, defineField, defineType } from "sanity";

const needsReview = defineField({
  name: "needsReview",
  title: "Needs review",
  description: "Persian (or other) copy was drafted automatically — untick once checked.",
  type: "boolean",
  initialValue: false,
});

const order = defineField({ name: "order", title: "Order", type: "number", validation: (r) => r.required().integer() });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    needsReview,
    defineField({ name: "name", type: "localeString", group: "identity" }),
    defineField({ name: "shortName", title: "Logo text", type: "string", group: "identity" }),
    defineField({ name: "tagline", description: "Engineering · Founding · Product building", type: "localeString", group: "identity" }),
    defineField({ name: "headline", title: "Hero line", type: "localeString", group: "identity" }),
    defineField({ name: "positioning", title: "Positioning line", type: "localeText", group: "identity" }),
    defineField({
      name: "roles",
      title: "Current roles",
      type: "array",
      group: "identity",
      of: [
        defineArrayMember({
          type: "object",
          name: "role",
          fields: [
            defineField({ name: "title", type: "localeString" }),
            defineField({ name: "org", title: "Organisation", type: "localeString" }),
            defineField({ name: "href", type: "url" }),
          ],
          preview: { select: { title: "title.en", subtitle: "org.en" } },
        }),
      ],
    }),
    defineField({ name: "location", description: "Shown instead of a city, e.g. Remote, worldwide.", type: "localeString", group: "contact" }),
    defineField({ name: "email", type: "string", validation: (r) => r.required().email(), group: "contact" }),
    defineField({
      name: "socials",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "url" }),
            defineField({ name: "handle", type: "string" }),
            defineField({
              name: "group",
              type: "string",
              options: { list: ["content", "professional"], layout: "radio", direction: "horizontal" },
              initialValue: "professional",
            }),
            defineField({ name: "blurb", type: "localeString" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "openTo", title: "Open to", type: "localeTags", group: "contact" }),
    defineField({ name: "resumeUrl", title: "Résumé URL", type: "url", group: "contact" }),
    defineField({ name: "seoTitle", type: "localeString", group: "seo" }),
    defineField({ name: "seoDescription", type: "localeText", group: "seo" }),
    defineField({ name: "ogImage", title: "Social share image", type: "altImage", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    needsReview,
    defineField({ name: "statement", type: "localeText" }),
    defineField({ name: "bio", type: "array", of: [defineArrayMember({ type: "localeText" })] }),
    defineField({ name: "portrait", type: "altImage" }),
    defineField({ name: "outside", title: "Outside my main job", type: "array", of: [defineArrayMember({ type: "localeText" })] }),
    defineField({ name: "closing", type: "localeText" }),
    defineField({
      name: "numbers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [defineField({ name: "value", type: "localeString" }), defineField({ name: "label", type: "localeString" })],
          preview: { select: { title: "value.en", subtitle: "label.en" } },
        }),
      ],
    }),
    defineField({
      name: "pillars",
      description: "Engineering, Founding, Product building, in that order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pillar",
          fields: [
            defineField({ name: "key", type: "string", options: { list: ["engineering", "founding", "product"] } }),
            defineField({ name: "title", type: "localeString" }),
            defineField({ name: "proof", type: "localeText" }),
            defineField({ name: "points", type: "localeTags" }),
            defineField({ name: "href", type: "string" }),
          ],
          preview: { select: { title: "title.en" } },
        }),
      ],
    }),
    defineField({
      name: "beliefs",
      description: "Mohammad's own words, no outside source.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "belief",
          fields: [defineField({ name: "text", type: "localeText" })],
          preview: { select: { title: "text.en" } },
        }),
      ],
    }),
    defineField({
      name: "quotes",
      description: "Quotes from others, always with the real source.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quote",
          fields: [
            defineField({ name: "kind", type: "string", options: { list: ["founder", "engineering"], layout: "radio" } }),
            defineField({ name: "text", type: "localeText" }),
            defineField({ name: "author", type: "localeString" }),
            defineField({ name: "source", type: "localeString" }),
          ],
          preview: { select: { title: "text.en", subtitle: "author.en" } },
        }),
      ],
    }),
    defineField({ name: "tools", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "education",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "educationItem",
          fields: [
            defineField({ name: "school", type: "localeString" }),
            defineField({ name: "degree", type: "localeString" }),
            defineField({ name: "start", description: "YYYY-MM", type: "string" }),
            defineField({ name: "end", description: "YYYY-MM", type: "string" }),
            defineField({ name: "note", type: "localeText" }),
          ],
          preview: { select: { title: "school.en", subtitle: "degree.en" } },
        }),
      ],
    }),
    defineField({
      name: "volunteering",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "volunteeringItem",
          fields: [
            defineField({ name: "role", type: "localeString" }),
            defineField({ name: "org", type: "localeString" }),
            defineField({ name: "date", description: "YYYY-MM", type: "string" }),
            defineField({ name: "summary", type: "localeText" }),
            defineField({ name: "bullets", type: "localeTags" }),
          ],
          preview: { select: { title: "role.en", subtitle: "org.en" } },
        }),
      ],
    }),
    defineField({
      name: "languages",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "languageItem",
          fields: [defineField({ name: "name", type: "localeString" }), defineField({ name: "level", type: "localeString" })],
          preview: { select: { title: "name.en", subtitle: "level.en" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

export const milestone = defineType({
  name: "milestone",
  title: "Journey stop",
  type: "document",
  fields: [
    order,
    defineField({ name: "year", description: "Shown huge, e.g. 2021 or Now.", type: "localeString" }),
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["roots", "career", "venture", "now"], layout: "radio" },
      initialValue: "career",
    }),
    defineField({
      name: "weight",
      description: "Major stops (the last two years) are drawn bigger.",
      type: "string",
      options: { list: ["major", "minor"], layout: "radio", direction: "horizontal" },
      initialValue: "minor",
    }),
    defineField({ name: "title", type: "localeString" }),
    defineField({ name: "outcome", title: "Outcome line", type: "localeText" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "media", type: "altImage" }),
    defineField({
      name: "sceneBreak",
      title: "Scene switches to night here",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "placement",
      type: "string",
      options: { list: ["auto", "start", "end"], layout: "radio", direction: "horizontal" },
      initialValue: "auto",
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "year.en", media: "media" } },
});

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    needsReview,
    order,
    defineField({ name: "company", type: "localeString" }),
    defineField({ name: "companyNote", type: "localeString" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "role", type: "localeString" }),
    defineField({
      name: "type",
      type: "string",
      options: { list: ["founder", "employee", "freelance", "community"], layout: "radio", direction: "horizontal" },
    }),
    defineField({ name: "start", description: "YYYY-MM", type: "string" }),
    defineField({ name: "end", description: "YYYY-MM, empty while current", type: "string" }),
    defineField({ name: "workplace", description: "Remote, Hybrid…", type: "localeString" }),
    defineField({ name: "location", type: "localeString" }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "bullets", type: "localeTags" }),
    defineField({
      name: "spec",
      type: "object",
      fields: [defineField({ name: "built", type: "localeString" }), defineField({ name: "outcome", type: "localeString" })],
    }),
    defineField({ name: "tech", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "company.en", subtitle: "role.en" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "story", title: "Case study" },
    { name: "media", title: "Media" },
  ],
  fields: [
    needsReview,
    defineField({ ...order, group: "overview" }),
    defineField({ name: "title", type: "localeString", group: "overview" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
      group: "overview",
    }),
    defineField({ name: "featured", title: "Featured on home", type: "boolean", group: "overview" }),
    defineField({
      name: "group",
      type: "string",
      options: { list: ["own", "nobar", "client", "side"], layout: "radio", direction: "horizontal" },
      group: "overview",
    }),
    defineField({ name: "caseStudy", title: "Full case study page", type: "boolean", group: "overview" }),
    defineField({ name: "year", type: "string", group: "overview" }),
    defineField({ name: "sector", type: "localeString", group: "overview" }),
    defineField({ name: "kind", title: "Type", type: "localeString", group: "overview" }),
    defineField({ name: "scope", type: "localeTags", group: "overview" }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["live", "nda", "offline", "archived"], layout: "radio", direction: "horizontal" },
      group: "overview",
    }),
    defineField({
      name: "color",
      title: "Brand colour (hex)",
      type: "string",
      validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/),
      group: "overview",
    }),
    defineField({ name: "client", type: "localeString", group: "overview" }),
    defineField({ name: "location", type: "localeString", group: "overview" }),
    defineField({ name: "role", type: "localeString", group: "overview" }),
    defineField({ name: "summary", type: "localeText", group: "overview" }),
    defineField({ name: "problem", type: "localeBlock", group: "story" }),
    defineField({ name: "decision", type: "localeBlock", group: "story" }),
    defineField({ name: "result", type: "localeBlock", group: "story" }),
    defineField({ name: "stack", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "story" }),
    defineField({
      name: "links",
      type: "object",
      group: "story",
      fields: [
        defineField({ name: "live", type: "url" }),
        defineField({ name: "repo", type: "url" }),
        defineField({ name: "figma", type: "url" }),
      ],
    }),
    defineField({ name: "cover", type: "altImage", group: "media" }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "altImage" })], group: "media" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "year", media: "cover" } },
});

export const recommendation = defineType({
  name: "recommendation",
  title: "Recommendation",
  type: "document",
  fields: [
    order,
    defineField({ name: "name", type: "localeString" }),
    defineField({ name: "headline", description: "Their LinkedIn headline, verbatim.", type: "string" }),
    defineField({ name: "relationship", type: "localeString" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "highlight", description: "One sentence lifted verbatim from the text.", type: "text", rows: 2 }),
    defineField({ name: "paragraphs", description: "The full recommendation, verbatim (English).", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "href", title: "Link", type: "url" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "headline" } },
});
