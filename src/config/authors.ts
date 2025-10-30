/**
 * Authorized blog authors and their LinkedIn profiles
 * Only these LinkedIn accounts can access the blog editor
 */

export interface Author {
  id: string;
  name: string;
  linkedinUsername: string; // from linkedin.com/in/{username}
  linkedinUrl: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export const ALLOWED_AUTHORS: Author[] = [
  {
    id: 'ann-cederhall',
    name: 'Ann Cederhall',
    linkedinUsername: 'anncederhall',
    linkedinUrl: 'https://www.linkedin.com/in/anncederhall',
    email: 'ann@retailaer.com',
  },
  {
    id: 'anders-lofgren',
    name: 'Anders Löfgren',
    linkedinUsername: 'lofgrena',
    linkedinUrl: 'https://www.linkedin.com/in/lofgrena',
    email: 'lofgrea@gmail.com',
  },
  {
    id: 'ashley-raiteri',
    name: 'Ashley Raiteri',
    linkedinUsername: 'ashleyraiteri',
    linkedinUrl: 'https://www.linkedin.com/in/ashleyraiteri',
    email: 'ashley@raiteri.net',
  },
];

/**
 * Corporate LinkedIn account for company posts
 */
export const CORPORATE_ACCOUNT = {
  name: 'Retailaer',
  linkedinCompanyId: 'retailaer',
  linkedinUrl: 'https://www.linkedin.com/company/retailaer',
};

/**
 * Check if a LinkedIn profile is authorized
 */
export function isAuthorized(linkedinUsername: string): boolean {
  return ALLOWED_AUTHORS.some(
    author => author.linkedinUsername.toLowerCase() === linkedinUsername.toLowerCase()
  );
}

/**
 * Get author by LinkedIn username
 */
export function getAuthorByLinkedIn(linkedinUsername: string): Author | undefined {
  return ALLOWED_AUTHORS.find(
    author => author.linkedinUsername.toLowerCase() === linkedinUsername.toLowerCase()
  );
}

/**
 * Get author by ID
 */
export function getAuthorById(id: string): Author | undefined {
  return ALLOWED_AUTHORS.find(author => author.id === id);
}
