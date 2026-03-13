import type { Portfolio } from "@/content/portfolio";

/**
 * ResumeData is the shape consumed by the PDF generator.
 * It is derived from the Portfolio JSON automatically.
 */
export type ResumeData = {
    locale: string;
    person: {
        fullName: string;
        role: string;
        location: string;
        email: string;
        phone?: string;
        website?: string;
        github?: string;
        linkedin?: string;
        shortBio: string;
        about: string[];
    };
    skills: {
        primary: string[];
        secondary: string[];
        tooling: string[];
    };
    experiences: {
        company: string;
        title: string;
        location?: string;
        startDate: string;
        endDate: string;
        summary?: string;
        bullets: string[];
        tech: string[];
    }[];
    education: {
        institution: string;
        degree: string;
        field?: string;
        startDate: string;
        endDate?: string;
        description?: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
    }[];
};

/**
 * Converts Portfolio JSON data to ResumeData for the PDF generator.
 */
export function portfolioToResumeData(
    portfolio: Portfolio,
    locale: string
): ResumeData {
    return {
        locale,
        person: {
            fullName: portfolio.person.fullName,
            role: portfolio.person.role,
            location: portfolio.person.location,
            email: portfolio.links.email,
            website: portfolio.links.website,
            github: portfolio.links.github,
            linkedin: portfolio.links.linkedin,
            shortBio: portfolio.person.shortBio,
            about: portfolio.person.about,
        },
        skills: {
            primary: portfolio.skills.primary,
            secondary: portfolio.skills.secondary ?? [],
            tooling: portfolio.skills.tooling ?? [],
        },
        experiences: portfolio.experience.map((e) => ({
            company: e.company,
            title: e.title,
            location: e.location,
            startDate: e.start,
            endDate: e.end,
            summary: e.summary,
            bullets: e.bullets,
            tech: e.tech ?? [],
        })),
        education: (portfolio.education ?? []).map((e) => ({
            institution: e.institution,
            degree: e.degree,
            field: e.field,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
        })),
        certifications: (portfolio.certifications ?? []).map((c) => ({
            name: c.name,
            issuer: c.issuer,
            date: c.date,
        })),
    };
}
