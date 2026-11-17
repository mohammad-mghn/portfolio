import "server-only";
import { Document, Font, Link, Page, renderToBuffer, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { formatMonth } from "@/lib/format";
import type { ResumeData } from "@/lib/resume";

// No automatic hyphenation: labels and names ("Pishgaman") should never break mid-word.
Font.registerHyphenationCallback((word) => [word]);

const ink = "#151412";
const soft = "#4a4843";
const muted = "#7a776f";
const hair = "#d6d1c6";
const accent = "#ff5a1f";

const s = StyleSheet.create({
  page: { paddingVertical: 34, paddingHorizontal: 44, fontFamily: "Helvetica", fontSize: 8.6, lineHeight: 1.32, color: ink },
  name: { fontFamily: "Helvetica-Bold", fontSize: 24, lineHeight: 1.15, letterSpacing: -0.4 },
  headline: { fontSize: 11.5, lineHeight: 1.3, marginTop: 4, color: soft },
  contact: { flexDirection: "row", flexWrap: "wrap", marginTop: 9, fontSize: 8.4, color: muted },
  contactItem: { marginRight: 14 },
  link: { color: muted, textDecoration: "none" },
  section: { flexDirection: "row", marginTop: 10, paddingTop: 6, borderTopWidth: 0.6, borderTopColor: hair },
  label: { width: 104, paddingRight: 10, fontFamily: "Helvetica-Bold", fontSize: 7.2, letterSpacing: 1.1, color: accent },
  body: { flex: 1 },
  item: { marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  strong: { fontFamily: "Helvetica-Bold", fontSize: 9.4 },
  meta: { fontSize: 8, color: muted },
  text: { color: soft },
  bullet: { flexDirection: "row", marginTop: 1.2 },
  dot: { width: 9, color: accent },
  bulletText: { flex: 1, color: soft },
});

/** Helvetica only covers WinAnsi; swap the few characters outside it so nothing renders as a box. */
const safe = (value: string) =>
  value
    .replace(/[→↗]/g, "->")
    .replace(/≈/g, "~")
    .replace(/[  ]/g, " ")
    .replace(/[^\u0000-ÿ–—‘’“”•…€™]/g, "");

/** A labelled resume section. Short ones pass `keep` so a heading never ends a page without its content. */
function Section({ label, keep, children }: { label: string; keep?: boolean; children: ReactNode }) {
  return (
    <View style={s.section} wrap={!keep} minPresenceAhead={40}>
      <Text style={s.label}>{label.toUpperCase()}</Text>
      <View style={s.body}>{children}</View>
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((b) => (
        <View key={b} style={s.bullet}>
          <Text style={s.dot}>•</Text>
          <Text style={s.bulletText}>{safe(b)}</Text>
        </View>
      ))}
    </>
  );
}

function ResumeDocument({ site, about, experience, projects, links }: ResumeData) {
  const month = (m?: string) => (m ? formatMonth(m, "en") : "Present");
  return (
    <Document title={`${site.name} - Resume`} author={site.name} subject={site.headline} language="en">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{site.name}</Text>
        <Text style={s.headline}>{safe(site.headline)}</Text>
        <View style={s.contact}>
          <Link src={`mailto:${site.email}`} style={[s.link, s.contactItem]}>
            {site.email}
          </Link>
          {links.map((l) => (
            <Link key={l.href} src={l.href} style={[s.link, s.contactItem]}>
              {l.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </Link>
          ))}
          <Text style={s.contactItem}>{safe(site.location)}</Text>
        </View>

        <Section label="Summary">
          <Text style={s.text}>{safe(site.positioning)}</Text>
          {about.bio[0] ? <Text style={[s.text, { marginTop: 4 }]}>{safe(about.bio[0])}</Text> : null}
        </Section>

        <Section label="Experience">
          {experience.map((e) => (
            <View key={e.id} style={s.item} wrap={false}>
              <View style={s.row}>
                <Text style={s.strong}>
                  {safe(e.role)}, {safe(e.company)}
                </Text>
                <Text style={s.meta}>
                  {month(e.start)} – {month(e.end)}
                </Text>
              </View>
              {e.workplace || e.location ? (
                <Text style={s.meta}>{safe([e.workplace, e.location].filter(Boolean).join(" · "))}</Text>
              ) : null}
              <Bullets items={e.bullets} />
            </View>
          ))}
        </Section>

        <Section label="Selected projects">
          {projects.map((p) => (
            <View key={p.slug} style={s.item} wrap={false}>
              <View style={s.row}>
                <Text style={s.strong}>{safe(p.title)}</Text>
                <Text style={s.meta}>
                  {safe(p.kind)} · {p.year}
                </Text>
              </View>
              <Text style={[s.text, { marginTop: 2 }]}>{safe(p.summary)}</Text>
            </View>
          ))}
        </Section>

        <Section label="Education" keep>
          {about.education.map((e) => (
            <View key={e.school} style={s.item}>
              <View style={s.row}>
                <Text style={s.strong}>{safe(e.school)}</Text>
                <Text style={s.meta}>
                  {e.start.slice(0, 4)} – {e.end.slice(0, 4)}
                </Text>
              </View>
              <Text style={s.text}>{safe(e.degree)}</Text>
              {e.note ? <Text style={s.meta}>{safe(e.note)}</Text> : null}
            </View>
          ))}
        </Section>

        {about.volunteering.length ? (
          <Section label="Volunteering" keep>
            {about.volunteering.map((v) => (
              <View key={v.role} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.strong}>
                    {safe(v.role)}, {safe(v.org)}
                  </Text>
                  <Text style={s.meta}>{month(v.date)}</Text>
                </View>
                <Bullets items={v.bullets} />
              </View>
            ))}
          </Section>
        ) : null}

        <Section label="Skills and tools" keep>
          <Text style={s.text}>{safe(about.tools.join(" · "))}</Text>
        </Section>

        <Section label="Languages" keep>
          <Text style={s.text}>{safe(about.languages.map((l) => `${l.name} (${l.level})`).join(" · "))}</Text>
        </Section>
      </Page>
    </Document>
  );
}

/** Render the English resume to a PDF buffer. */
export const renderResumePdf = (data: ResumeData) => renderToBuffer(<ResumeDocument {...data} />);
