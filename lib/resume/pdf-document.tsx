import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { ResumeData } from "./types";
import path from "path";

// ================= FONTS (ATS-friendly) =================
Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-600-normal.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-700-normal.ttf",
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// ================= DESIGN TOKENS =================
const ACCENT = "#1B4F72"; // Professional dark navy
const ACCENT_LIGHT = "#2980B9"; // Lighter blue for links
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#444444";
const TEXT_MUTED = "#666666";
const BG_HEADER = ACCENT;
const DIVIDER_COLOR = ACCENT;

// ================= MODERN ATS STYLES =================
// Single-column layout with subtle color accents.
// ATS-safe: no multi-column, no tables, no icon-only labels.
const s = StyleSheet.create({
  page: {
    fontFamily: "OpenSans",
    fontSize: 10,
    color: TEXT_PRIMARY,
    backgroundColor: "#ffffff",
    paddingTop: 0,
    paddingBottom: 18,
    paddingHorizontal: 0,
  },

  // Header — colored banner
  headerBanner: {
    backgroundColor: BG_HEADER,
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    objectFit: "cover" as const,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  headerRole: {
    fontSize: 11,
    fontWeight: 600,
    color: "#d6eaf8",
    marginBottom: 3,
  },
  headerContact: {
    fontSize: 9,
    color: "#d6eaf8",
    marginBottom: 1,
  },
  headerLinkRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 3,
  },
  headerLink: {
    fontSize: 9,
    color: "#d6eaf8",
    textDecoration: "none",
  },

  // Content area (padded)
  content: {
    paddingHorizontal: 36,
    paddingTop: 8,
  },

  // Section title with colored accent line
  sectionTitleWrapper: {
    marginBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: DIVIDER_COLOR,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 4,
  },

  // Thin divider between sections
  thinDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d5d8dc",
    marginTop: 4,
    marginBottom: 8,
  },

  // Summary
  summary: {
    fontSize: 9.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.4,
  },

  // Experience / Education blocks
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: TEXT_PRIMARY,
  },
  entryCompany: {
    fontSize: 10,
    fontWeight: 600,
    color: ACCENT,
  },
  entrySubtitle: {
    fontSize: 10,
    fontWeight: 400,
    color: TEXT_MUTED,
  },
  entryDate: {
    fontSize: 9,
    color: TEXT_MUTED,
    textAlign: "right",
  },
  entryLocation: {
    fontSize: 9,
    color: TEXT_MUTED,
    textAlign: "right",
  },

  // Bullet points
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1.5,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 8,
    fontSize: 9,
    color: ACCENT_LIGHT,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: TEXT_SECONDARY,
    lineHeight: 1.3,
  },

  // Skills
  skillLine: {
    fontSize: 9.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  skillCategory: {
    fontWeight: 700,
    color: ACCENT,
  },

  // Certification / Language entry
  certEntry: {
    marginBottom: 2,
  },
  certName: {
    fontSize: 10,
    fontWeight: 600,
    color: TEXT_PRIMARY,
  },
  certMeta: {
    fontSize: 9,
    color: TEXT_MUTED,
  },
});

// ================= HELPERS =================
const isEs = (locale: string) => locale.startsWith("es");

const label = (locale: string, en: string, es: string) =>
  isEs(locale) ? es : en;

// ================= COMPONENT =================
type Props = { data: ResumeData };

export function ResumeDocumentTemplate({ data }: Props) {
  const {
    person,
    skills,
    experiences,
    education,
    certifications,
    languages,
    locale,
  } = data;

  return (
    <Document
      title={`${person.fullName} - ${isEs(locale) ? "CV" : "Resume"}`}
      author={person.fullName}
      subject={person.role}
    >
      <Page size="A4" style={s.page}>
        {/* ========== HEADER BANNER ========== */}
        <View style={s.headerBanner}>
          <Image
            src={path.join(process.cwd(), "public", "photo.png")}
            style={s.headerPhoto}
          />
          <View style={s.headerTextBlock}>
            <Text style={s.headerName}>{person.fullName}</Text>
            <Text style={s.headerRole}>{person.role}</Text>
            <Text style={s.headerContact}>
              {person.location} · {person.email}
              {person.phone ? ` · ${person.phone}` : ""}
            </Text>
            {(person.linkedin || person.github) && (
              <View style={s.headerLinkRow}>
                {person.linkedin && (
                  <Link src={person.linkedin} style={s.headerLink}>
                    LinkedIn: {person.linkedin.replace("https://www.", "")}
                  </Link>
                )}
                {person.github && (
                  <Link src={person.github} style={s.headerLink}>
                    GitHub: {person.github.replace("https://", "")}
                  </Link>
                )}
              </View>
            )}
          </View>
        </View>

        {/* ========== CONTENT AREA ========== */}
        <View style={s.content}>
          {/* ========== PROFESSIONAL SUMMARY ========== */}
          <View style={s.section}>
            <View style={s.sectionTitleWrapper}>
              <Text style={s.sectionTitle}>
                {label(locale, "PROFESSIONAL SUMMARY", "PERFIL PROFESIONAL")}
              </Text>
            </View>
            <Text style={s.summary}>{person.shortBio}</Text>
          </View>

          {/* ========== EXPERIENCE ========== */}
          <View style={s.section}>
            <View style={s.sectionTitleWrapper}>
              <Text style={s.sectionTitle}>
                {label(
                  locale,
                  "PROFESSIONAL EXPERIENCE",
                  "EXPERIENCIA PROFESIONAL",
                )}
              </Text>
            </View>
            {experiences.map((exp, i) => (
              <View
                key={i}
                style={{ marginBottom: i < experiences.length - 1 ? 6 : 0 }}
              >
                <View style={s.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>
                      {exp.title} —{" "}
                      <Text style={s.entryCompany}>{exp.company}</Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={s.entryDate}>
                      {exp.startDate} – {exp.endDate}
                    </Text>
                    {exp.location && (
                      <Text style={s.entryLocation}>{exp.location}</Text>
                    )}
                  </View>
                </View>
                {exp.bullets.map((bullet, j) => (
                  <View key={j} style={s.bulletRow}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* ========== EDUCATION ========== */}
          {education.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionTitleWrapper}>
                <Text style={s.sectionTitle}>
                  {label(locale, "EDUCATION", "FORMACIÓN ACADÉMICA")}
                </Text>
              </View>
              {education.map((edu, i) => (
                <View
                  key={i}
                  style={{ marginBottom: i < education.length - 1 ? 6 : 0 }}
                >
                  <View style={s.entryHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.entryTitle}>{edu.degree}</Text>
                      <Text style={s.entrySubtitle}>{edu.institution}</Text>
                    </View>
                    <Text style={s.entryDate}>
                      {edu.startDate}
                      {edu.endDate ? ` – ${edu.endDate}` : ""}
                    </Text>
                  </View>
                  {edu.description && (
                    <Text style={s.summary}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ========== SKILLS (comma-separated for ATS) ========== */}
          <View style={s.section}>
            <View style={s.sectionTitleWrapper}>
              <Text style={s.sectionTitle}>
                {label(locale, "TECHNICAL SKILLS", "HABILIDADES TÉCNICAS")}
              </Text>
            </View>
            {skills.primary.length > 0 && (
              <Text style={s.skillLine}>
                <Text style={s.skillCategory}>
                  {label(locale, "Core: ", "Principales: ")}
                </Text>
                {skills.primary.join(", ")}
              </Text>
            )}
            {skills.secondary.length > 0 && (
              <Text style={s.skillLine}>
                <Text style={s.skillCategory}>
                  {label(locale, "Additional: ", "Adicionales: ")}
                </Text>
                {skills.secondary.join(", ")}
              </Text>
            )}
            {skills.tooling.length > 0 && (
              <Text style={s.skillLine}>
                <Text style={s.skillCategory}>
                  {label(locale, "Tools: ", "Herramientas: ")}
                </Text>
                {skills.tooling.join(", ")}
              </Text>
            )}
          </View>

          {/* ========== CERTIFICATIONS ========== */}
          {certifications.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionTitleWrapper}>
                <Text style={s.sectionTitle}>
                  {label(locale, "CERTIFICATIONS", "CERTIFICACIONES")}
                </Text>
              </View>
              {certifications.map((cert, i) => (
                <View key={i} style={s.certEntry}>
                  <Text style={s.certName}>{cert.name}</Text>
                  <Text style={s.certMeta}>
                    {cert.issuer} · {cert.date}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* ========== LANGUAGES ========== */}
          {languages.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionTitleWrapper}>
                <Text style={s.sectionTitle}>
                  {label(locale, "LANGUAGES", "IDIOMAS")}
                </Text>
              </View>
              {languages.map((lang, i) => (
                <View key={i} style={s.certEntry}>
                  <Text style={s.certName}>{lang.name}</Text>
                  <Text style={s.certMeta}>{lang.level}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
