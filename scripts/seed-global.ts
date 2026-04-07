/**
 * Seed script: populate siteNavigation and siteFooter singleton documents
 * from the data in navigation.yml and footer.yml.
 *
 * Run:
 *   SANITY_PROJECT_ID=xxx SANITY_DATASET=production SANITY_WRITE_TOKEN=xxx \
 *   npx tsx scripts/seed-global.ts
 *
 * Re-running is safe — it uses createOrReplace with fixed _id values.
 *
 * Note: the Resources dropdown featuredImage requires a Sanity image asset.
 *   Upload the image in Studio after running this script and set it on the
 *   Resources → "Early-Stage Tax Tips" column.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function genKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Navigation data (from navigation.yml + js-nav.html)
// ---------------------------------------------------------------------------

const siteNavigation = {
  _id: "siteNavigation",
  _type: "siteNavigation" as const,
  infoBar: {
    enabled: true,
    text: "Big Tax Changes for Startups! The new tax bill could impact your startup. What should you do next?",
    linkText: "Read the Blog →",
    linkUrl: "/blog/big-beautiful-bill/",
  },
  phoneNumber: "(415) 322-4000",
  ctaButton: {
    _type: "ctaItem" as const,
    text: "Contact Us",
    url: "/free-consultation/",
    style: "primary" as const,
  },
  navItems: [
    {
      _key: genKey(),
      _type: "navItem" as const,
      title: "Services",
      dropdownColumns: [
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Accounting & Bookkeeping",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "Startup Accounting", url: "/startup-accounting/", helpText: "Maximize Your Startup's Potential" },
            { _key: genKey(), _type: "navLink" as const, title: "Startup Bookkeeping", url: "/startup-bookkeeping/", helpText: "Services for High-Growth Startups" },
            { _key: genKey(), _type: "navLink" as const, title: "Strategic Financial Accounting", url: "/strategic-financial-accounting/", helpText: "Strategic Accounting Boosts Your VC-Funded Startup's Financial Future" },
          ],
        },
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Tax Services",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "Startup Tax Services", url: "/startup-tax-services/", helpText: "Tax Services for VC-Backed Startups" },
            { _key: genKey(), _type: "navLink" as const, title: "Startup Tax Returns", url: "/startup-tax-returns/", helpText: "Filing Tax Returns for VC-Backed Startups" },
            { _key: genKey(), _type: "navLink" as const, title: "Delaware Franchise Tax", url: "/delaware-franchise-tax/", helpText: "Calculate Your Delaware Franchise Tax" },
          ],
        },
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "R&D Tax Credits",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "R&D Tax Credits", url: "/rd-tax-credits/", helpText: "Unlock Your Startup's R&D Tax Credit Potential" },
            { _key: genKey(), _type: "navLink" as const, title: "R&D Tax Calculator", url: "/rd-tax-calculator/", helpText: "How much can your startup save in payroll taxes?" },
          ],
        },
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Advisory Services",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "Fractional CFO & Advisory", url: "/fractional-cfo-services/" },
            { _key: genKey(), _type: "navLink" as const, title: "VC Due Diligence", url: "/vc-due-diligence/" },
            { _key: genKey(), _type: "navLink" as const, title: "Startup M&A Accounting", url: "/startup-m-a-accounting/" },
            { _key: genKey(), _type: "navLink" as const, title: "Financial Modeling Services", url: "/financial-modeling-services/" },
            { _key: genKey(), _type: "navLink" as const, title: "409A Valuations Services", url: "/409a-valuation/" },
            { _key: genKey(), _type: "navLink" as const, title: "Part-Time CFOs Services", url: "/part-time-cfo-services/" },
          ],
        },
      ],
    },
    {
      _key: genKey(),
      _type: "navItem" as const,
      title: "Pricing",
      url: "/pricing/",
      dropdownColumns: [],
    },
    {
      _key: genKey(),
      _type: "navItem" as const,
      title: "Company",
      dropdownColumns: [
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "About Us", url: "/about/", helpText: "Learn more about Kruze Consulting" },
            { _key: genKey(), _type: "navLink" as const, title: "Partners", url: "/partners/", helpText: "Our partners are the best in the business" },
            { _key: genKey(), _type: "navLink" as const, title: "Reviews", url: "/reviews/", helpText: "See what our clients say about us" },
            { _key: genKey(), _type: "navLink" as const, title: "Careers", url: "/remote-accounting-jobs/", helpText: "Join our team of startup accounting experts" },
            { _key: genKey(), _type: "navLink" as const, title: "Announcements", url: "/kruze-news/", helpText: "All press mentions, releases, and news" },
          ],
        },
      ],
    },
    {
      _key: genKey(),
      _type: "navItem" as const,
      title: "Resources",
      dropdownColumns: [
        {
          // Featured image column — image asset must be uploaded manually in Studio
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Early-Stage Tax Tips",
          featured: true,
          featuredImageUrl: "/blog/seed-stage-tax-returns/",
          featuredImageLinkText: "Guide to Seed Stage Tax Returns",
          navLinks: [],
        },
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Knowledge Base",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "Startup Q&A", url: "/questions-answers/", helpText: "Answers to hundreds of startup accounting, finance, HR and tax Q's" },
            { _key: genKey(), _type: "navLink" as const, title: "Blog", url: "/blog/", helpText: "Expert startup accounting advice (and more)" },
            { _key: genKey(), _type: "navLink" as const, title: "Case Studies", url: "/case-studies/", helpText: "See how we helped our clients save money and grow their businesses" },
          ],
        },
        {
          _key: genKey(),
          _type: "navColumn" as const,
          heading: "Top Financial Tips and Resources",
          featured: false,
          navLinks: [
            { _key: genKey(), _type: "navLink" as const, title: "Startup Financial Health Tools", url: "/blog/startup-tools/", helpText: "Tips for setting up scaleable financial systems" },
            { _key: genKey(), _type: "navLink" as const, title: "Free Financial Models", url: "/blog/startup-financial-models-guide/#free-financial-models", helpText: "Free to download financial models" },
            { _key: genKey(), _type: "navLink" as const, title: "C-Corp Tax Deadlines", url: "/startup-c-corp-tax-deadlines/", helpText: "iCals with federal, state and local compliance deadlines" },
            { _key: genKey(), _type: "navLink" as const, title: "Best VC Pitch Decks", url: "/blog/top-5-venture-capital-pitch-decks/", helpText: "See more of the best pitch decks ever used" },
            { _key: genKey(), _type: "navLink" as const, title: "CEO Salary Report", url: "/blog/startup-ceo-salary-report/", helpText: "Data on what CEOs are paid" },
            { _key: genKey(), _type: "navLink" as const, title: "Best Startup Credit Cards", url: "/blog/best-startup-credit-cards/", helpText: "After working with hundreds of startups, we picked the best credit cards" },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Footer data (from footer.yml + footer.html)
// ---------------------------------------------------------------------------

const siteFooter = {
  _id: "siteFooter",
  _type: "siteFooter" as const,
  companyDescription:
    "Kruze Consulting is a licensed CPA firm; California Board of Accountancy license number 7637",
  licenseNumber: "7637",
  licenseUrl: "https://search.dca.ca.gov/details/300/COR/7637/c84a8a608c1d7861adadf206bead1d47",
  incAwardText: "7 Years Straight — Inc. 5000 Fastest Growing Companies.",
  columns: [
    {
      _key: genKey(),
      _type: "footerColumn" as const,
      heading: "Resources",
      links: [
        { _key: genKey(), _type: "footerLink" as const, title: "Startup Resources", url: "/startup-resources/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Startup Q&A", url: "/questions-answers/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Case Studies", url: "/case-studies/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Kruze Blog", url: "/blog/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "C-Corp Tax Deadlines", url: "/startup-c-corp-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Startup Accounting Dictionary", url: "/accounting-dictionary/", external: false },
      ],
    },
    {
      _key: genKey(),
      _type: "footerColumn" as const,
      heading: "Free Tax Calculators",
      links: [
        { _key: genKey(), _type: "footerLink" as const, title: "Startup R&D Tax Credit Calculator", url: "/rd-tax-calculator/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "How Much Does a Startup Tax Return Cost?", url: "/startup-tax-returns/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Delaware Franchise Tax Calculator", url: "/delaware-franchise-tax/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Burn Rate and Cash Runway Calculator", url: "/blog/cash-burn-rate/", external: false },
      ],
    },
    {
      _key: genKey(),
      _type: "footerColumn" as const,
      heading: "Locations",
      links: [
        { _key: genKey(), _type: "footerLink" as const, title: "San Francisco", url: "/san-francisco-accountant/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "New York", url: "/new-york-accountant/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Los Angeles", url: "/los-angeles-accountant/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Austin", url: "/austin-accountant/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Seattle", url: "/seattle-accountant/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Boston", url: "/boston-accountant/", external: false },
      ],
    },
    {
      _key: genKey(),
      _type: "footerColumn" as const,
      heading: "Industry Expertise",
      links: [
        { _key: genKey(), _type: "footerLink" as const, title: "SaaS Accounting", url: "/blog/saas-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Biotech Accounting", url: "/blog/biotech-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "AI Startup Accounting", url: "/blog/chart-accounts-ai-startup/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "eCommerce Accounting", url: "/blog/ecommerce-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Hardware Accountants", url: "/blog/hardware-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Crypto Accounting", url: "/blog/crypto-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Healthcare Accounting", url: "/blog/healthcare-accounting/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Startup Accounting", url: "/startup-accounting/", external: false },
      ],
    },
    {
      _key: genKey(),
      _type: "footerColumn" as const,
      heading: "Important Tax Dates",
      links: [
        { _key: genKey(), _type: "footerLink" as const, title: "C-Corp Tax Deadlines", url: "/startup-c-corp-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "California Tax Deadlines", url: "/california-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "New York Tax Deadlines", url: "/new-york-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Texas Tax Deadlines", url: "/texas-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Florida Tax Deadlines", url: "/florida-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Illinois Tax Deadlines", url: "/illinois-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Washington Tax Deadlines", url: "/washington-tax-deadlines/", external: false },
        { _key: genKey(), _type: "footerLink" as const, title: "Massachusetts Tax Deadlines", url: "/massachusetts-tax-deadlines/", external: false },
      ],
    },
  ],
  socialLinks: [
    { _key: genKey(), _type: "socialLink" as const, platform: "Kruze Consulting on YouTube", url: "https://www.youtube.com/c/KruzeConsulting" },
    { _key: genKey(), _type: "socialLink" as const, platform: "Kruze Consulting on LinkedIn", url: "https://www.linkedin.com/company/kruze-consulting" },
    { _key: genKey(), _type: "socialLink" as const, platform: "Kruze Consulting on Twitter", url: "https://x.com/KruzeConsulting" },
    { _key: genKey(), _type: "socialLink" as const, platform: "Kruze Consulting on Yelp", url: "https://www.yelp.com/biz/kruze-consulting-san-francisco" },
  ],
  copyrightText: "Copyright © Kruze Consulting",
  legalLinks: [
    { _key: genKey(), _type: "footerLink" as const, title: "Team", url: "/startup-cfo-cpa/", external: false },
    { _key: genKey(), _type: "footerLink" as const, title: "Pricing", url: "/pricing/", external: false },
    { _key: genKey(), _type: "footerLink" as const, title: "Careers", url: "/remote-accounting-jobs/", external: false },
    { _key: genKey(), _type: "footerLink" as const, title: "Privacy Policy", url: "/privacy-policy/", external: false },
    { _key: genKey(), _type: "footerLink" as const, title: "Terms of Service", url: "/terms-of-service/", external: false },
    { _key: genKey(), _type: "footerLink" as const, title: "Security", url: "/security/", external: false },
  ],
};

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function main() {
  console.log("Project:", process.env.SANITY_PROJECT_ID);
  console.log("Dataset:", process.env.SANITY_DATASET);
  console.log("Token present:", !!process.env.SANITY_WRITE_TOKEN);
  console.log("");

  console.log("Building transaction...");
  const tx = client.transaction();
  tx.createOrReplace(siteNavigation);
  tx.createOrReplace(siteFooter);

  console.log("Committing...");
  const result = await tx.commit({ returnDocuments: true });
  console.log("Raw Sanity response:", JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  console.error(err);
  process.exit(1);
});
