/**
 * Single source of truth for branding. Renaming the product should only
 * require editing this file — never application logic.
 */
export const brand = {
  name: "BackThen",
  tagline: "You'll forget more than you think.",
  subhead: "One good question every week.",
  description:
    "One good question every week. Answer with your voice, words, or photos. Over time, those small memories become the story of your life.",
  priceMonthly: "$1/month",
  priceAnnualNote: "$12 billed annually",
  priceAnnualAmountCents: 1200,
  cta: "Start my story",
  preservedWith: "Preserved with BackThen",
} as const;

export type Brand = typeof brand;
