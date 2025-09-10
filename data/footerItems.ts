// © 2025 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
export const footerItem = {
  logoSrc : "/iconw.svg",
  logoAlt : "SDGP",
  logoWidth : 48,
  logoHeight : 48,
  logoClassName : "size-8 light:invert",
  companyUrl : "/",
  sections : [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/project" },
        { label: "Competition Winners", href: "/competitions" },
        { label: "Videos", href: "/video" },
        { label: "Blogs", href: "/blog" },
        // { label: "Testimonials", href: "#" },
        // { label: "Competitions", href: "#" },
      ],
    },
    {
      title: "Submit",
      links: [
        { label: "Submit Project", href: "/submit/project" },
        { label: "Submit Competition", href: "/submit/competition" },
        { label: "Submit Award", href: "/submit/award" },
        { label: "Submit Blog", href: "/blog/create" },
      ],
    },
    {
     title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Sitemap", href: "/sitemap.xml" },
        { label: "Contribute", href: "/contribute" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy" },
        { label: "Cookie policy", href: "/cookies" },
      ],
    },

  ],
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/sdgp.iit", icon: "Instagram" },
    { name: "LinkedIn",  href: "https://www.linkedin.com/company/sdgp-iit/", icon: "Linkedin" },
    { name: "Youtube",  href: "https://www.youtube.com/@SDGPIIT", icon: "Youtube" },
  ],

}