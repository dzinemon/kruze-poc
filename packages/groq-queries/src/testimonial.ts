import groq from "groq";

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(name asc) {
    _id, name, company, role, quoteText,
    contactImage { asset-> { url } },
    companyImage { asset-> { url } }
  }
`;
