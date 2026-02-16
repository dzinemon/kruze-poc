import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function seed() {
  const tx = client.transaction();

  // --- Testimonials ---
  const testimonials = [
    {
      _id: "testimonial-demo-1",
      _type: "testimonial" as const,
      name: "Sarah Chen",
      company: "TechFlow AI",
      role: "CEO & Co-founder",
      quoteText:
        "Kruze helped us navigate our Series A tax obligations seamlessly. Their startup expertise saved us months of headaches.",
    },
    {
      _id: "testimonial-demo-2",
      _type: "testimonial" as const,
      name: "Marcus Rivera",
      company: "GreenStack",
      role: "Founder",
      quoteText:
        "Having a CPA firm that actually understands startups made all the difference during our fundraise. The team was responsive and thorough.",
    },
    {
      _id: "testimonial-demo-3",
      _type: "testimonial" as const,
      name: "Emily Watson",
      company: "DataBridge",
      role: "CFO",
      quoteText:
        "We switched to Kruze after struggling with a generalist accounting firm. Night and day difference — they knew exactly what a Series B company needs.",
    },
  ];

  for (const t of testimonials) {
    tx.createOrReplace(t);
    console.log(`  + testimonial: ${t.name} (${t.company})`);
  }

  // --- Block Page ---
  const blockPage = {
    _id: "block-page-demo-startup-services",
    _type: "blockPage" as const,
    title: "Startup Accounting Services",
    slug: { _type: "slug" as const, current: "startup-services" },
    description:
      "Full-service accounting, tax, and CFO services for funded startups.",
    sections: [
      // Hero Section
      {
        _type: "heroSection" as const,
        _key: "hero-1",
        headline: "Accounting Built for Startups",
        subheadline:
          "Tax, bookkeeping, and CFO services trusted by 800+ venture-funded companies. Focus on building — we handle the numbers.",
        ctaText: "Get Started",
        ctaUrl: "/contact",
      },

      // Text Section
      {
        _type: "textSection" as const,
        _key: "text-1",
        heading: "Why Startups Choose Kruze",
        body: [
          {
            _type: "block",
            _key: "b1",
            style: "normal",
            children: [
              {
                _type: "span",
                _key: "s1",
                text: "Managing finances at a startup is fundamentally different from a traditional small business. You need a team that understands ",
                marks: [],
              },
              {
                _type: "span",
                _key: "s2",
                text: "venture-backed accounting",
                marks: ["strong"],
              },
              {
                _type: "span",
                _key: "s3",
                text: " — from R&D tax credits to 409A valuations to ASC 606 revenue recognition.",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b2",
            style: "normal",
            children: [
              {
                _type: "span",
                _key: "s4",
                text: "Our team has helped startups save over $10 billion in tax credits and manage accounting for companies that have gone on to IPO or be acquired by the biggest names in tech.",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b3",
            style: "h3",
            children: [
              {
                _type: "span",
                _key: "s5",
                text: "What We Handle",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b4",
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: [
              {
                _type: "span",
                _key: "s6",
                text: "Monthly bookkeeping and financial reporting",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b5",
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: [
              {
                _type: "span",
                _key: "s7",
                text: "Federal and state tax preparation",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b6",
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: [
              {
                _type: "span",
                _key: "s8",
                text: "R&D tax credit studies and claims",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b7",
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: [
              {
                _type: "span",
                _key: "s9",
                text: "Financial modeling and CFO advisory",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: "block",
            _key: "b8",
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: [
              {
                _type: "span",
                _key: "s10",
                text: "409A valuations and equity compensation",
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
        background: "white",
      },

      // Chart Section
      {
        _type: "chartSection" as const,
        _key: "chart-1",
        heading: "Startup Funding Trends",
        description:
          "Quarterly venture capital investment in US startups (in billions).",
        chart: {
          chartType: "bar" as const,
          title: "US VC Investment by Quarter (2024)",
          labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
          datasets: [
            {
              label: "Total VC Investment ($B)",
              values: [37.5, 42.1, 55.6, 48.3],
            },
          ],
          showLegend: true,
          sourceText: "Source: PitchBook-NVCA Venture Monitor",
        },
        background: "light",
      },

      // Testimonials Section
      {
        _type: "testimonialsSection" as const,
        _key: "testimonials-1",
        heading: "What Our Clients Say",
        testimonials: testimonials.map((t) => ({
          _type: "reference" as const,
          _ref: t._id,
          _key: t._id,
        })),
      },

      // FAQ Section
      {
        _type: "faqSection" as const,
        _key: "faq-1",
        heading: "Frequently Asked Questions",
        faqs: [
          {
            _key: "faq-item-1",
            question: "How much does startup accounting cost?",
            answer: [
              {
                _type: "block",
                _key: "fa1",
                style: "normal",
                children: [
                  {
                    _type: "span",
                    _key: "fas1",
                    text: "Pricing depends on the complexity of your business — transaction volume, number of entities, and the services you need. Most seed-stage companies start around $500-1,500/month for bookkeeping and tax, scaling as the company grows.",
                    marks: [],
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            _key: "faq-item-2",
            question: "Do you handle R&D tax credits?",
            answer: [
              {
                _type: "block",
                _key: "fa2",
                style: "normal",
                children: [
                  {
                    _type: "span",
                    _key: "fas2",
                    text: "Yes — R&D tax credits are one of our specialties. We've helped startups claim over $5 billion in credits. We handle the full study, documentation, and filing.",
                    marks: [],
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            _key: "faq-item-3",
            question: "Can you help during a fundraise?",
            answer: [
              {
                _type: "block",
                _key: "fa3",
                style: "normal",
                children: [
                  {
                    _type: "span",
                    _key: "fas3",
                    text: "Absolutely. We prepare financial packages for due diligence, model out pro-forma financials, and work directly with your investors' accounting teams to ensure a smooth process.",
                    marks: [],
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            _key: "faq-item-4",
            question: "What stage startups do you work with?",
            answer: [
              {
                _type: "block",
                _key: "fa4",
                style: "normal",
                children: [
                  {
                    _type: "span",
                    _key: "fas4",
                    text: "We work with startups from pre-seed through IPO. Our sweet spot is Series A through Series C companies, but we have clients at every stage of growth.",
                    marks: [],
                  },
                ],
                markDefs: [],
              },
            ],
          },
        ],
      },
    ],
  };

  tx.createOrReplace(blockPage);
  console.log(`\n  + blockPage: ${blockPage.title} (/${blockPage.slug.current})`);

  console.log("\nCommitting...");
  const result = await tx.commit();
  console.log(`Done! Transaction ID: ${result.transactionId}`);
  console.log(`Documents created/updated: ${result.documentIds.length}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
