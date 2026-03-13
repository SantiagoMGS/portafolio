import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Link,
} from "@react-pdf/renderer";
import type { ResumeData } from "./types";

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

// ================= HARVARD ATS STYLES =================
// Clean, single-column layout optimized for ATS parsers.
// No tables, no columns, no graphics — pure text hierarchy.
const s = StyleSheet.create({
    page: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: "#1a1a1a",
        backgroundColor: "#ffffff",
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: 48,
    },

    // Header — centered, clean
    headerName: {
        fontSize: 22,
        fontWeight: 700,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    headerRole: {
        fontSize: 12,
        fontWeight: 600,
        textAlign: "center",
        color: "#333333",
        marginBottom: 6,
    },
    headerContact: {
        fontSize: 9,
        textAlign: "center",
        color: "#555555",
        marginBottom: 2,
    },
    headerLink: {
        fontSize: 9,
        color: "#555555",
        textDecoration: "none",
    },

    // Dividers
    divider: {
        borderBottomWidth: 1.5,
        borderBottomColor: "#1a1a1a",
        marginTop: 10,
        marginBottom: 8,
    },
    thinDivider: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#cccccc",
        marginTop: 6,
        marginBottom: 6,
    },

    // Section
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
    },
    section: {
        marginBottom: 10,
    },

    // Summary
    summary: {
        fontSize: 10,
        color: "#333333",
        lineHeight: 1.5,
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
    },
    entrySubtitle: {
        fontSize: 10,
        fontWeight: 400,
        color: "#555555",
    },
    entryDate: {
        fontSize: 9,
        color: "#555555",
        textAlign: "right",
    },
    entryLocation: {
        fontSize: 9,
        color: "#555555",
        textAlign: "right",
    },

    // Bullet points
    bulletRow: {
        flexDirection: "row",
        marginBottom: 3,
        paddingLeft: 8,
    },
    bulletDot: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: "#333333",
        lineHeight: 1.45,
    },

    // Skills — comma-separated (ATS-friendly)
    skillLine: {
        fontSize: 10,
        color: "#333333",
        lineHeight: 1.5,
        marginBottom: 3,
    },
    skillCategory: {
        fontWeight: 700,
    },

    // Certification entry
    certEntry: {
        marginBottom: 4,
    },
    certName: {
        fontSize: 10,
        fontWeight: 600,
    },
    certMeta: {
        fontSize: 9,
        color: "#555555",
    },
});

// ================= HELPERS =================
const isEs = (locale: string) => locale.startsWith("es");

const label = (locale: string, en: string, es: string) =>
    isEs(locale) ? es : en;

// ================= COMPONENT =================
type Props = { data: ResumeData };

export function ResumeDocumentTemplate({ data }: Props) {
    const { person, skills, experiences, education, certifications, locale } = data;

    return (
        <Document
            title={`${person.fullName} - ${isEs(locale) ? "CV" : "Resume"}`}
            author={person.fullName}
            subject={person.role}
        >
            <Page size="A4" style={s.page}>
                {/* ========== HEADER ========== */}
                <Text style={s.headerName}>{person.fullName}</Text>
                <Text style={s.headerRole}>{person.role}</Text>
                <Text style={s.headerContact}>
                    {person.location} · {person.email}
                    {person.phone ? ` · ${person.phone}` : ""}
                </Text>
                {(person.linkedin || person.github) && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 12,
                            marginTop: 2,
                        }}
                    >
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

                <View style={s.divider} />

                {/* ========== PROFESSIONAL SUMMARY ========== */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        {label(locale, "PROFESSIONAL SUMMARY", "PERFIL PROFESIONAL")}
                    </Text>
                    <Text style={s.summary}>{person.shortBio}</Text>
                </View>

                <View style={s.thinDivider} />

                {/* ========== EXPERIENCE ========== */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        {label(locale, "PROFESSIONAL EXPERIENCE", "EXPERIENCIA PROFESIONAL")}
                    </Text>
                    {experiences.map((exp, i) => (
                        <View key={i} style={{ marginBottom: i < experiences.length - 1 ? 10 : 0 }}>
                            <View style={s.entryHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.entryTitle}>
                                        {exp.title} — {exp.company}
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

                <View style={s.thinDivider} />

                {/* ========== EDUCATION ========== */}
                {education.length > 0 && (
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>
                            {label(locale, "EDUCATION", "FORMACIÓN ACADÉMICA")}
                        </Text>
                        {education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: i < education.length - 1 ? 6 : 0 }}>
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

                <View style={s.thinDivider} />

                {/* ========== SKILLS (comma-separated for ATS) ========== */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        {label(locale, "TECHNICAL SKILLS", "HABILIDADES TÉCNICAS")}
                    </Text>
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
                    <>
                        <View style={s.thinDivider} />
                        <View style={s.section}>
                            <Text style={s.sectionTitle}>
                                {label(locale, "CERTIFICATIONS", "CERTIFICACIONES")}
                            </Text>
                            {certifications.map((cert, i) => (
                                <View key={i} style={s.certEntry}>
                                    <Text style={s.certName}>{cert.name}</Text>
                                    <Text style={s.certMeta}>
                                        {cert.issuer} · {cert.date}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
}
