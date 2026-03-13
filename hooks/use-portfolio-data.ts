"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { Portfolio } from "@/content/portfolio";
import en from "@/content/locale/en.json";

type UsePortfolioDataResult = {
    portfolio: Portfolio;
    isLoading: boolean;
};

/**
 * Hook to get portfolio data from the locale JSON files.
 * Returns typed portfolio data based on the current language.
 */
export function usePortfolioData(): UsePortfolioDataResult {
    const { t, i18n } = useTranslation();

    const portfolio = React.useMemo(() => {
        const value = t("portfolioData", { returnObjects: true }) as unknown;
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            return (en as unknown as { portfolioData: Portfolio }).portfolioData;
        }
        // Force re-computation when language changes
        void i18n.language;
        return value as Portfolio;
    }, [t, i18n.language]);

    return { portfolio, isLoading: false };
}
