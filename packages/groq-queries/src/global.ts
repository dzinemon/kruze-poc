import { imageMinimal } from "./fragments";

export const siteNavigationQuery = `
  *[_id == "siteNavigation"][0] {
    _id,
    infoBar,
    phoneNumber,
    ctaButton,
    navItems[] {
      _key,
      title,
      url,
      dropdownColumns[] {
        _key,
        heading,
        featured,
        featuredImage ${imageMinimal},
        featuredImageUrl,
        featuredImageLinkText,
        navLinks[] {
          _key,
          title,
          url,
          helpText,
          icon ${imageMinimal}
        }
      },
      dropdownInfoBar
    }
  }
`;

export const siteFooterQuery = `
  *[_id == "siteFooter"][0] {
    _id,
    companyDescription,
    licenseNumber,
    licenseUrl,
    incAwardText,
    columns[] {
      _key,
      heading,
      links[] {
        _key,
        title,
        url,
        external
      }
    },
    socialLinks[] {
      _key,
      platform,
      url
    },
    copyrightText,
    legalLinks[] {
      _key,
      title,
      url,
      external
    }
  }
`;
