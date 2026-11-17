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
    defineField({
      name: "bookingUrl",
      title: "Booking page",
      description: "Your Google Calendar booking link. The “Book a call” button shows only when this is filled in.",
      type: "url",
      group: "contact",
    }),
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
            defineField({ name: "points", description: "Three short lines in plain words.", type: "localeList" }),
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
            defineField({ name: "bullets", type: "localeList" }),
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

/** Fields a role or venture stop can set on top of what its references already say. */
const stopOverrides = [
  defineField({
    name: "weight",
    description: "Major stops (2025 on) are drawn bigger and hold longer.",
    type: "string",
    options: { list: ["major", "minor"], layout: "radio", direction: "horizontal" },
    initialValue: "minor",
  }),
  defineField({ name: "sceneBreak", title: "Scene switches to night here", type: "boolean", initialValue: false }),
  defineField({
    name: "highlights",
    description: "Up to 3 short lines on what was built. Leave empty to use each role's “Built” line.",
    type: "localeList",
  }),
  defineField({ name: "media", type: "altImage" }),
  defineField({
    name: "href",
    title: "Custom link",
    description: "Leave empty: a job links to its company on /engineering, a venture to /founding.",
    type: "string",
  }),
];

/**
 * The home-page journey: work experience, oldest first. Stops only point at roles, ventures and
 * projects, so names, dates and covers are never typed twice. Drag to reorder.
 */
export const journey = defineType({
  name: "journey",
  title: "Journey",
  type: "document",
  fields: [
    defineField({
      name: "stops",
      description: "Oldest first. A job or venture is a big stop; put the project cards built there right after it.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "journeyRole",
          title: "Job (roles at one company)",
          fields: [
            defineField({
              name: "roles",
              description: "Every role held at this company.",
              type: "array",
              of: [defineArrayMember({ type: "reference", to: [{ type: "experience" }] })],
              validation: (r) => r.required().min(1),
            }),
            ...stopOverrides,
          ],
          preview: {
            select: { company: "roles.0.company.en", role: "roles.0.role.en", weight: "weight" },
            prepare: ({ company, role, weight }) => ({ title: company ?? "Job", subtitle: `Job · ${weight ?? "minor"} · ${role ?? ""}` }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "journeyVenture",
          title: "Co-founded venture",
          fields: [
            defineField({ name: "venture", type: "reference", to: [{ type: "venture" }], validation: (r) => r.required() }),
            ...stopOverrides,
          ],
          preview: {
            select: { name: "venture.name.en", weight: "weight" },
            prepare: ({ name, weight }) => ({ title: name ?? "Venture", subtitle: `Venture · ${weight ?? "minor"}` }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "journeyNote",
          title: "Note (free text, e.g. the closing “Now” card)",
          fields: [
            defineField({ name: "label", description: "Shown big where a job shows its year, e.g. Now.", type: "localeString" }),
            defineField({ name: "title", type: "localeString" }),
            defineField({ name: "lines", description: "Up to 3 short lines, in your own words.", type: "localeList" }),
            defineField({
              name: "weight",
              type: "string",
              options: { list: ["major", "minor"], layout: "radio", direction: "horizontal" },
              initialValue: "major",
            }),
            defineField({ name: "href", title: "Link", description: "Where the card goes, e.g. /contact.", type: "string" }),
          ],
          preview: {
            select: { title: "title.en", label: "label.en" },
            prepare: ({ title, label }) => ({ title: title ?? "Note", subtitle: `Note · ${label ?? ""}` }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "journeyProject",
          title: "Project card",
          fields: [
            defineField({
              name: "projects",
              description: "One project fills the card; two or three share it as rows.",
              type: "array",
              of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
              validation: (r) => r.required().min(1).max(3),
            }),
          ],
          preview: {
            select: { a: "projects.0.title.en", b: "projects.1.title.en", c: "projects.2.title.en" },
            prepare: ({ a, b, c }) => ({ title: [a, b, c].filter(Boolean).join(" + ") || "Project card", subtitle: "Project card" }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Journey" }) },
});

/** A product Mohammad co-founded: the Founding page, and the venture stops of the journey. */
export const venture = defineType({
  name: "venture",
  title: "Venture",
  type: "document",
  fields: [
    needsReview,
    order,
    defineField({ name: "name", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "name.en" }, validation: (r) => r.required() }),
    defineField({ name: "role", description: "e.g. Co-founder & software engineer", type: "localeString" }),
    defineField({ name: "since", description: "YYYY-MM", type: "string" }),
    defineField({ name: "partner", description: "e.g. With Mahdi Khodadadi, product designer", type: "localeString" }),
    defineField({ name: "traction", description: "e.g. 3,000+ users", type: "localeString" }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "facts", description: "Short facts shown as a list.", type: "localeList" }),
    defineField({ name: "note", title: "Story", description: "The founding story, one paragraph per item.", type: "localeList" }),
    defineField({
      name: "links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "ventureLink",
          fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "url" })],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "cover", type: "altImage" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "role.en", media: "cover" } },
});

/** One page's own words. Empty contact fields fall back to the default contact block. */
const pageCopy = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "statement", description: "The line under the page title (also the search description).", type: "localeText" }),
      defineField({ name: "contactTitleA", title: "Contact title, first line", type: "localeString" }),
      defineField({ name: "contactTitleB", title: "Contact title, second line (orange)", type: "localeString" }),
      defineField({ name: "contactLead", title: "Contact lead", type: "localeText" }),
    ],
  });

/** The words that change from page to page: each page's statement and closing contact block. */
export const pages = defineType({
  name: "pages",
  title: "Page texts",
  type: "document",
  fields: [
    defineField({
      name: "contactDefault",
      title: "Default contact block",
      description: "Shown on the home page and wherever a page leaves its own contact text empty.",
      type: "object",
      fields: [
        defineField({ name: "titleA", title: "Title, first line", type: "localeString" }),
        defineField({ name: "titleB", title: "Title, second line (orange)", type: "localeString" }),
        defineField({ name: "lead", type: "localeText" }),
      ],
    }),
    pageCopy("home", "Home"),
    pageCopy("engineering", "Engineering"),
    pageCopy("founding", "Founding"),
    pageCopy("work", "Work and case studies"),
    pageCopy("content", "Content"),
    pageCopy("about", "About"),
    pageCopy("recommendations", "Recommendations"),
    pageCopy("resume", "Resume"),
    pageCopy("contact", "Contact"),
  ],
  preview: { prepare: () => ({ title: "Page texts" }) },
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
      options: {
        list: [
          { title: "Full-time", value: "employee" },
          { title: "Freelance", value: "freelance" },
          { title: "Co-founder", value: "founder" },
          { title: "Community", value: "community" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({ name: "start", description: "YYYY-MM", type: "string" }),
    defineField({ name: "end", description: "YYYY-MM, empty while current", type: "string" }),
    defineField({ name: "workplace", description: "Remote, Hybrid…", type: "localeString" }),
    defineField({ name: "location", type: "localeString" }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "bullets", type: "localeList" }),
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
      description: "Full-time jobs are not projects: they live in Experience.",
      type: "string",
      options: {
        list: [
          { title: "Co-founded product", value: "cofounded" },
          { title: "Client project", value: "client" },
          { title: "Open source and personal", value: "personal" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      group: "overview",
    }),
    defineField({
      name: "builtAt",
      title: "Built at",
      description: "For client projects: the job or the freelance role it was built in. Shows as “Built at …”.",
      type: "reference",
      to: [{ type: "experience" }],
      group: "overview",
    }),
    defineField({
      name: "partner",
      description: "For co-founded products, e.g. Co-founded with Mahdi Khodadadi.",
      type: "localeString",
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
    defineField({ name: "portrait", description: "Square photo. Without one the site shows initials.", type: "image", options: { hotspot: true } }),
    defineField({ name: "headline", description: "Their headline or job title, as they wrote it.", type: "string" }),
    defineField({
      name: "source",
      type: "string",
      options: {
        list: [
          { title: "LinkedIn", value: "linkedin" },
          { title: "Earlier site (mghn.info)", value: "mghn.info" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "linkedin",
    }),
    defineField({ name: "relationship", description: "LinkedIn only, e.g. Worked with Mohammad on the same team.", type: "localeString" }),
    defineField({ name: "date", description: "LinkedIn only.", type: "date" }),
    defineField({ name: "href", title: "Link", description: "Their profile, or the recommendation on LinkedIn.", type: "url" }),
    defineField({ name: "highlight", description: "One sentence lifted word for word from the text.", type: "text", rows: 2 }),
    defineField({ name: "paragraphs", description: "The full recommendation, word for word.", type: "array", of: [{ type: "text" }] }),
    defineField({
      name: "highlightFa",
      title: "Highlight (Persian translation)",
      description: "Optional. When both Persian fields are filled, the Persian site shows the translation, marked as translated.",
      type: "text",
      rows: 2,
    }),
    defineField({ name: "paragraphsFa", title: "Full text (Persian translation)", type: "array", of: [{ type: "text" }] }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "headline", media: "portrait" } },
});
