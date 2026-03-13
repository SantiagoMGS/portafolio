import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocumentTemplate } from "./pdf-document";
import type { ResumeData } from "./types";

/**
 * Generates an ATS-friendly PDF resume in Harvard format.
 */
export async function generateResumePdf(data: ResumeData): Promise<Buffer> {
    const pdfBuffer = await renderToBuffer(
        <ResumeDocumentTemplate data={data} />
    );
    return Buffer.from(pdfBuffer);
}

/**
 * Generate a clean filename for the resume PDF.
 */
export function generateFilename(
    fullName: string,
    locale: string = "en"
): string {
    const sanitizedName = fullName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
    const suffix = locale === "es" ? "CV" : "Resume";
    return `${sanitizedName}-${suffix}.pdf`;
}
