/**
 * developer.js — who built this site.
 *
 * ✏️  THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *
 * The Developer page hides anything left blank, so a half-filled file still
 * looks finished — nothing will appear broken or say "undefined".
 */

export const DEVELOPER = {
  /** Your name, exactly as you want it read. */
  name: "Farrukh Gul",

  /**
   * What you do. Shown under your name.
   * ⚠️ Guessed from your degree — change it if it is wrong.
   */
  role: "Computer Science graduate",

  /** Where you are. Leave empty to hide it. */
  location: "Lahore, Pakistan",

  /**
   * The one-line version, shown in the terminal card as the answer to
   * `whoami`. Keep it short — it is meant to fit on one line.
   *
   * ⚠️ THIS IS A DRAFT I WROTE FOR YOU. Replace it with your own words —
   * it is the only sentence on the page that sounds like a person.
   */
  tagline: "I build things for the web, and I got tired of tracing code on paper.",

  /**
   * A short paragraph about you. Two or three sentences is plenty.
   * Leave empty and the section is skipped.
   */
  bio: "",

  /**
   * Why you built DryRun.
   *
   * Worth writing properly — it is the most interesting thing on the page, and
   * the reason someone will trust the tool: they can see it was built by
   * a person who had the problem themselves. Leave empty to hide the panel.
   */
  why: "",

  /**
   * A photo of you, served from the `public/` folder.
   * Leave empty and the page shows your initials in a rounded square instead.
   */
  avatarUrl: "/farrukh.jpeg",

  /**
   * Education, most recent first.
   *
   * `note` is optional — use it for anything that needs explaining, like
   * transferring partway through a degree.
   */
  education: [
    {
      qualification: "BS Computer Science",
      institution: "Minhaj University Lahore",
      note: "5th to 8th semester",
      grade: "3.5 CGPA",
    },
    {
      qualification: "Associate Degree in Computer Science",
      institution: "University of Central Punjab",
      note: "",
      grade: "3.37 CGPA",
    },
  ],

  /**
   * Where to find you. Any left empty simply will not appear.
   *
   * ⚠️  `email` is published as plain text on a public page, which scrapers
   * do find. It is here because you asked for it — swap it for a contact form
   * later if the spam becomes a nuisance.
   */
  links: {
    github: "https://github.com/FarrukhGul",
    linkedin: "https://linkedin.com/in/farrukh-gul",
    instagram: "https://instagram.com/cybercodeforge",
    email: "farrukhgul.dev@gmail.com",
    website: "",
    x: "",
  },
};

/** The order links appear in, and what to call them. */
const LINK_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  website: "Website",
  x: "X",
  email: "Email",
};

/**
 * The links that were actually filled in, ready to render.
 *
 * Keeping this here means the page has no idea which links exist — it just
 * draws whatever comes back.
 */
export function developerLinks() {
  return Object.keys(LINK_LABELS)
    .filter((key) => (DEVELOPER.links[key] ?? "").trim() !== "")
    .map((key) => ({
      key,
      label: LINK_LABELS[key],
      // An email needs a mailto: prefix; everything else is already a URL.
      href: key === "email" ? `mailto:${DEVELOPER.links[key]}` : DEVELOPER.links[key],
      // Only real links open in a new tab; mailto: should not.
      external: key !== "email",
    }));
}

/** "Farrukh Gul" → "FG". Used when there is no photo. */
export function developerInitials() {
  return DEVELOPER.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
