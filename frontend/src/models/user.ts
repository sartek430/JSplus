import { IWidget } from "./widget";

/**
 * Structure d'un utilisateur.
 *
 * @typedef {Object} User
 * @property {string} id - L'identifiant de l'utilisateur.
 * @property {string} name - Le nom de l'utilisateur.
 * @property {string} email - L'adresse e-mail de l'utilisateur.
 * @property {IWidget[]} widgets - Les widgets de l'utilisateur.
 * @property {string} contactId - L'identifiant du contact.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  widgets: IWidget[];
  contactId?: string;
}
