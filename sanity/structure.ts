import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

/** The panel's menu, in the order the site is read: who, what each page says, the career, then what others say. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      singleton(S, "siteSettings", "Site settings"),
      singleton(S, "about", "About"),
      singleton(S, "pages", "Page texts"),
      S.divider(),
      singleton(S, "journey", "Journey"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("venture").title("Ventures"),
      S.divider(),
      S.documentTypeListItem("recommendation").title("Recommendations"),
    ]);
