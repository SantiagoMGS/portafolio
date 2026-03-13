import { NextRequest, NextResponse } from "next/server";
import { generateResumePdf, generateFilename, portfolioToResumeData } from "@/lib/resume";
import type { Portfolio } from "@/content/portfolio";
import en from "@/content/locale/en.json";
import es from "@/content/locale/es.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const localeData: Record<string, { portfolioData: Portfolio }> = {
    en: en as unknown as { portfolioData: Portfolio },
    es: es as unknown as { portfolioData: Portfolio },
};

/**
 * GET /api/resume?locale=en|es&download=true|false
 *
 * Generates an ATS-friendly Harvard-format PDF resume from the JSON data.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "en";
        const download = searchParams.get("download") !== "false";

        if (!["en", "es"].includes(locale)) {
            return NextResponse.json(
                { error: "Invalid locale. Use 'en' or 'es'" },
                { status: 400 }
            );
        }

        const portfolio = localeData[locale].portfolioData;
        const resumeData = portfolioToResumeData(portfolio, locale);

        const pdfBuffer = await generateResumePdf(resumeData);
        const filename = generateFilename(resumeData.person.fullName, locale);

        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set("Content-Length", pdfBuffer.length.toString());
        headers.set(
            "Content-Disposition",
            download
                ? `attachment; filename="${filename}"`
                : `inline; filename="${filename}"`
        );
        headers.set(
            "Cache-Control",
            "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
        );

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate resume PDF" },
            { status: 500 }
        );
    }
}
