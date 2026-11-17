import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      singleton(S, "siteSettings", "Site settings"),
      singleton(S, "about", "About"),
      S.divider(),
      S.documentTypeListItem("milestone").title("Journey"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("project").title("Projects"),
      S.divider(),
      S.documentTypeListItem("recommendation").title("Recommendations"),
    ]);
