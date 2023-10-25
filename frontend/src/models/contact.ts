/**
 * Structure d'un contact.
 *
 * @typedef {Object} Contact
 * @property {string} id - L'identifiant du contact.
 * @property {string} userIdA - L'identifiant de l'utilisateur A.
 * @property {string} userIdB - L'identifiant de l'utilisateur B.
 */
export interface Contact {
  id: string;
  userIdA: string;
  userIdB: string;
}
