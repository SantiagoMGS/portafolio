"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";

import { ContactForm } from "@/components/portfolio/contact-form";
import { SmoothLink } from "@/components/portfolio/smooth-link";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HyperText } from "@/components/ui/hyper-text";
import { Separator } from "@/components/ui/separator";
import type { Portfolio } from "@/content/portfolio";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import {
  ArrowRightIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
} from "lucide-react";

const NUMERIC_CHARACTER_SET = "0123456789+.-".split("");

function isMostlyNumeric(value: string) {
  return /^[0-9+\-\s.]+$/.test(value.trim());
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <HyperText
            as="span"
            startOnView
            animateOnHover={false}
            duration={1100}
          >
            {title}
          </HyperText>
        </h2>
        {subtitle ? (
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      <Separator className="my-6" />
      {children}
    </section>
  );
}

type RevealVariant =
  | "fade"
  | "pop"
  | "drop"
  | "rise"
  | "slide-left"
  | "slide-right";

function revealClass(
  isVisible: boolean,
  variant: RevealVariant,
  options?: { delayMs?: number },
) {
  const delay = options?.delayMs
    ? ` motion-safe:delay-[${options.delayMs}ms]`
    : "";

  if (!isVisible) {
    return "opacity-0 pointer-events-none";
  }

  // Uses tw-animate-css (shadcn) utilities already present in the repo.
  // Adding the classes later triggers the CSS animation, giving us a more
  // expressive, per-block reveal without re-mounting nodes.
  const base =
    "opacity-100 motion-safe:animate-in motion-safe:duration-700 motion-safe:ease-out will-change-transform";

  switch (variant) {
    case "pop":
      return `${base} motion-safe:fade-in-0 motion-safe:zoom-in-95${delay}`;
    case "drop":
      return `${base} motion-safe:fade-in-0 motion-safe:slide-in-from-top-6${delay}`;
    case "rise":
      return `${base} motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-6${delay}`;
    case "slide-left":
      return `${base} motion-safe:fade-in-0 motion-safe:slide-in-from-left-6${delay}`;
    case "slide-right":
      return `${base} motion-safe:fade-in-0 motion-safe:slide-in-from-right-6${delay}`;
    case "fade":
    default:
      return `${base} motion-safe:fade-in-0${delay}`;
  }
}

function SocialLinks({ links }: { links: Portfolio["links"] }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="secondary" className="gap-2">
        <a href={`mailto:${links.email}`}>
          <MailIcon className="size-4" />
          {t("social.email")}
        </a>
      </Button>
      {links.github ? (
        <Button asChild variant="secondary" className="gap-2">
          <a href={links.github} target="_blank" rel="noreferrer">
            <GithubIcon className="size-4" />
            {t("social.github")}
          </a>
        </Button>
      ) : null}
      {links.linkedin ? (
        <Button asChild variant="secondary" className="gap-2">
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon className="size-4" />
            {t("social.linkedin")}
          </a>
        </Button>
      ) : null}
      {links.website ? (
        <Button asChild variant="secondary" className="gap-2">
          <a href={links.website} target="_blank" rel="noreferrer">
            <GlobeIcon className="size-4" />
            {t("social.website")}
          </a>
        </Button>
      ) : null}
    </div>
  );
}

export function PortfolioPage() {
  const { t, i18n } = useTranslation();
  const { portfolio } = usePortfolioData();

  const [showInitialLoader] = React.useState(false);

  const [revealStep, setRevealStep] = React.useState(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    try {
      setReduceMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    } catch {
      setReduceMotion(false);
    }
  }, []);

  React.useEffect(() => {
    if (showInitialLoader) {
      setRevealStep(0);
      return;
    }

    if (reduceMotion) {
      setRevealStep(99);
      return;
    }

    setRevealStep(1);
    const timeouts: number[] = [];
    const maxSteps = 9;
    for (let step = 2; step <= maxSteps; step += 1) {
      timeouts.push(
        window.setTimeout(() => setRevealStep(step), (step - 1) * 110),
      );
    }
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [showInitialLoader, reduceMotion]);

  return (
    <div className="bg-background min-h-screen">
      <SmoothLink
        href="#content"
        className="bg-background text-foreground focus-visible:ring-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus-visible:ring-2"
      >
        {t("a11y.skipToContent")}
      </SmoothLink>

      <header
        className={
          "bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur " +
          revealClass(revealStep >= 1, "drop")
        }
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between gap-3 sm:block">
              <div className="min-w-0">
                <div className="truncate font-semibold tracking-tight">
                  <HyperText
                    as="span"
                    startOnView
                    animateOnHover={false}
                    duration={900}
                  >
                    {portfolio.person.fullName}
                  </HyperText>
                </div>
                <div className="text-muted-foreground truncate text-xs sm:text-sm">
                  {portfolio.person.role} · {portfolio.person.location}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            <nav className="flex items-center gap-2 pb-1 sm:pb-0">
              <div className="hidden items-center gap-2 sm:flex">
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                  <SmoothLink href="#about">{t("nav.about")}</SmoothLink>
                </Button>
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                  <SmoothLink href="#work">{t("nav.work")}</SmoothLink>
                </Button>
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                  <SmoothLink href="#projects">{t("nav.projects")}</SmoothLink>
                </Button>
              </div>
              <Button asChild size="sm" className="shrink-0 gap-2">
                <SmoothLink href="#contact">
                  {t("nav.contact")}
                  <ArrowRightIcon className="size-4" />
                </SmoothLink>
              </Button>

              <div className="hidden items-center gap-2 sm:flex">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main
        id="content"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <section className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div
            className={
              "lg:col-span-7 " +
              revealClass(revealStep >= 2, "rise", { delayMs: 40 })
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              {portfolio.person.availabilityLabel ? (
                <Badge variant="secondary">
                  {portfolio.person.availabilityLabel}
                </Badge>
              ) : null}
              <Badge>{t("hero.badge")}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              <AnimatedShinyText className="text-primary" shimmerWidth={140}>
                {portfolio.person.role}
              </AnimatedShinyText>
              <span className="text-muted-foreground"> {t("hero.suffix")}</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-base sm:text-lg">
              {portfolio.person.shortBio}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button asChild className="gap-2">
                <a href="#projects">
                  {t("hero.ctaProjects")}
                  <ArrowRightIcon className="size-4" />
                </a>
              </Button>
              {portfolio.links.resumePdf ? (
                <Button asChild variant="secondary">
                  <a
                    href={portfolio.links.resumePdf}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("hero.downloadResume")}
                  </a>
                </Button>
              ) : null}
              <SocialLinks links={portfolio.links} />
            </div>
          </div>

          <div
            className={
              "lg:col-span-5 " +
              revealClass(revealStep >= 3, "pop", { delayMs: 60 })
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  <HyperText
                    as="span"
                    startOnView
                    animateOnHover={false}
                    duration={900}
                  >
                    {t("highlights.title")}
                  </HyperText>
                </CardTitle>
                <CardDescription>{t("highlights.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {portfolio.highlights.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="bg-muted/40 rounded-md border p-3"
                    >
                      <div className="text-muted-foreground text-xs">
                        {item.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold tracking-tight">
                        <HyperText
                          as="span"
                          startOnView
                          animateOnHover={false}
                          duration={900}
                          characterSet={
                            isMostlyNumeric(item.value)
                              ? NUMERIC_CHARACTER_SET
                              : undefined
                          }
                        >
                          {item.value}
                        </HyperText>
                      </div>
                      {item.hint ? (
                        <div className="text-muted-foreground mt-1 text-xs">
                          {item.hint}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-muted-foreground text-sm">
                {t("highlights.footer")}
              </CardFooter>
            </Card>
          </div>
        </section>

        <div className="my-12" />

        <div className="grid gap-12">
          <div
            className={revealClass(revealStep >= 4, "rise", { delayMs: 40 })}
          >
            <Section
              id="about"
              title={t("about.title")}
              subtitle={t("about.subtitle")}
            >
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="grid gap-4">
                    {portfolio.person.about.map((p) => (
                      <p
                        key={p}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <HyperText
                          as="span"
                          startOnView
                          animateOnHover={false}
                          duration={900}
                        >
                          {t("about.coreSkills")}
                        </HyperText>
                      </CardTitle>
                      <CardDescription>
                        {t("about.coreSkillsSubtitle")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {portfolio.skills.primary.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {portfolio.skills.secondary?.length ||
              portfolio.skills.tooling?.length ? (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  {portfolio.skills.secondary?.length ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <HyperText
                            as="span"
                            startOnView
                            animateOnHover={false}
                            duration={900}
                          >
                            {t("about.alsoStrong")}
                          </HyperText>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {portfolio.skills.secondary.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  ) : null}

                  {portfolio.skills.tooling?.length ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <HyperText
                            as="span"
                            startOnView
                            animateOnHover={false}
                            duration={900}
                          >
                            {t("about.tooling")}
                          </HyperText>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {portfolio.skills.tooling.map((tool) => (
                          <Badge key={tool} variant="secondary">
                            {tool}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              ) : null}
            </Section>
          </div>

          <div
            className={revealClass(revealStep >= 5, "slide-left", {
              delayMs: 30,
            })}
          >
            <Section
              id="work"
              title={t("work.title")}
              subtitle={t("work.subtitle")}
            >
              <div className="grid gap-4">
                {portfolio.experience.map((job) => (
                  <Card key={`${job.company}-${job.title}-${job.start}`}>
                    <CardHeader>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <CardTitle className="text-lg">
                          <HyperText
                            as="span"
                            startOnView
                            animateOnHover={false}
                            duration={900}
                          >
                            {job.title}
                          </HyperText>
                          <span> · {job.company}</span>
                        </CardTitle>
                        <div className="text-muted-foreground text-sm">
                          {job.start} — {job.end}
                          {job.location ? ` · ${job.location}` : ""}
                        </div>
                      </div>
                      {job.summary ? (
                        <CardDescription>{job.summary}</CardDescription>
                      ) : null}
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <ul className="text-muted-foreground grid list-disc gap-2 pl-5">
                        {job.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      {job.tech?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {job.tech.map((tch) => (
                            <Badge key={tch} variant="secondary">
                              {tch}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </div>

          <div
            className={revealClass(revealStep >= 6, "slide-right", {
              delayMs: 30,
            })}
          >
            <Section
              id="projects"
              title={t("projects.title")}
              subtitle={t("projects.subtitle")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {portfolio.projects.map((project) => (
                  <Card key={project.slug} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <HyperText
                          as="span"
                          startOnView
                          animateOnHover={false}
                          duration={900}
                        >
                          {project.name}
                        </HyperText>
                      </CardTitle>
                      <CardDescription>{project.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {project.role ? (
                        <div className="text-muted-foreground text-sm">
                          <span className="font-medium">
                            {t("projects.roleLabel")}
                          </span>{" "}
                          {project.role}
                        </div>
                      ) : null}
                      {project.highlights?.length ? (
                        <ul className="text-muted-foreground grid list-disc gap-2 pl-5 text-sm">
                          {project.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tch) => (
                          <Badge key={tch} variant="secondary">
                            {tch}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    {project.links?.live || project.links?.repo ? (
                      <CardFooter className="mt-auto flex flex-wrap gap-2">
                        {project.links?.live ? (
                          <Button asChild className="gap-2">
                            <a
                              href={project.links.live}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("projects.live")}
                              <GlobeIcon className="size-4" />
                            </a>
                          </Button>
                        ) : null}
                        {project.links?.repo ? (
                          <Button asChild variant="secondary" className="gap-2">
                            <a
                              href={project.links.repo}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("projects.code")}
                              <GithubIcon className="size-4" />
                            </a>
                          </Button>
                        ) : null}
                      </CardFooter>
                    ) : null}
                  </Card>
                ))}
              </div>
            </Section>
          </div>

          {portfolio.testimonials?.length ? (
            <div
              className={revealClass(revealStep >= 7, "fade", { delayMs: 40 })}
            >
              <Section
                id="testimonials"
                title={t("testimonials.title")}
                subtitle={t("testimonials.subtitle")}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {portfolio.testimonials.map((tm) => (
                    <Card key={`${tm.name}-${tm.quote.slice(0, 16)}`}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          <HyperText
                            as="span"
                            startOnView
                            animateOnHover={false}
                            duration={900}
                          >
                            {tm.name}
                          </HyperText>
                        </CardTitle>
                        {tm.title || tm.company ? (
                          <CardDescription>
                            {[tm.title, tm.company].filter(Boolean).join(" · ")}
                          </CardDescription>
                        ) : null}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          “{tm.quote}”
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            </div>
          ) : null}

          {portfolio.education?.length ? (
            <div
              className={revealClass(revealStep >= 7, "rise", { delayMs: 30 })}
            >
              <Section
                id="education"
                title={t("education.title")}
                subtitle={t("education.subtitle")}
              >
                <div className="grid gap-4">
                  {portfolio.education.map((edu) => (
                    <Card key={`${edu.institution}-${edu.degree}`}>
                      <CardHeader>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <CardTitle className="text-lg">
                            <HyperText
                              as="span"
                              startOnView
                              animateOnHover={false}
                              duration={900}
                            >
                              {edu.degree}
                            </HyperText>
                          </CardTitle>
                          <div className="text-muted-foreground text-sm">
                            {edu.startDate} — {edu.endDate ?? ""}
                          </div>
                        </div>
                        <CardDescription>{edu.institution}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </Section>
            </div>
          ) : null}

          {portfolio.certifications?.length ? (
            <div
              className={revealClass(revealStep >= 7, "fade", { delayMs: 40 })}
            >
              <Section
                id="certifications"
                title={t("certifications.title")}
                subtitle={t("certifications.subtitle")}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {portfolio.certifications.map((cert) => (
                    <Card key={cert.name}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          <HyperText
                            as="span"
                            startOnView
                            animateOnHover={false}
                            duration={900}
                          >
                            {cert.name}
                          </HyperText>
                        </CardTitle>
                        <CardDescription>
                          {cert.issuer} · {cert.date}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </Section>
            </div>
          ) : null}

          <div className={revealClass(revealStep >= 8, "pop", { delayMs: 40 })}>
            <Section
              id="contact"
              title={t("contact.title")}
              subtitle={t("contact.subtitle")}
            >
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <HyperText
                          as="span"
                          startOnView
                          animateOnHover={false}
                          duration={900}
                        >
                          {t("contact.linksTitle")}
                        </HyperText>
                      </CardTitle>
                      <CardDescription>
                        {t("contact.linksSubtitle")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {portfolio.links.scheduleCall ? (
                        <Button asChild className="w-full justify-between">
                          <a
                            href={portfolio.links.scheduleCall}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="font-medium">
                              {t("contact.schedule")}
                            </span>
                            <ArrowRightIcon className="size-4" />
                          </a>
                        </Button>
                      ) : null}

                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                          asChild
                          variant="secondary"
                          className="h-auto justify-start gap-2 py-3"
                        >
                          <a href={`mailto:${portfolio.links.email}`}>
                            <MailIcon className="size-4" />
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">
                                {t("social.email")}
                              </span>
                              <span className="text-muted-foreground block truncate text-xs">
                                {portfolio.links.email}
                              </span>
                            </span>
                          </a>
                        </Button>

                        {portfolio.links.linkedin ? (
                          <Button
                            asChild
                            variant="secondary"
                            className="h-auto justify-start gap-2 py-3"
                          >
                            <a
                              href={portfolio.links.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <LinkedinIcon className="size-4" />
                              <span className="block text-sm font-medium">
                                {t("social.linkedin")}
                              </span>
                            </a>
                          </Button>
                        ) : null}

                        {portfolio.links.github ? (
                          <Button
                            asChild
                            variant="secondary"
                            className="h-auto justify-start gap-2 py-3"
                          >
                            <a
                              href={portfolio.links.github}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <GithubIcon className="size-4" />
                              <span className="block text-sm font-medium">
                                {t("social.github")}
                              </span>
                            </a>
                          </Button>
                        ) : null}

                        {portfolio.links.website ? (
                          <Button
                            asChild
                            variant="secondary"
                            className="h-auto justify-start gap-2 py-3"
                          >
                            <a
                              href={portfolio.links.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <GlobeIcon className="size-4" />
                              <span className="block text-sm font-medium">
                                {t("social.website")}
                              </span>
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <HyperText
                          as="span"
                          startOnView
                          animateOnHover={false}
                          duration={900}
                        >
                          {t("contact.messageTitle")}
                        </HyperText>
                      </CardTitle>
                      <CardDescription>
                        {t("contact.messageSubtitle")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ContactForm />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Section>
          </div>
        </div>

        <footer
          className={
            "text-muted-foreground mt-16 border-t pt-8 text-sm " +
            revealClass(revealStep >= 9, "fade", { delayMs: 40 })
          }
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              © {new Date().getFullYear()} {portfolio.person.fullName}
            </div>
            <div className="flex items-center gap-2">
              <span>
                {t("footer.builtWith")} {t("footer.next")}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t("footer.shadcn")}</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
