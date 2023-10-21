
/**
 * Structure d'une invitation.
 *
 * @typedef {Object} Invits
 * @property {number} id - L'identifiant de l' invitation.
 * @property {string} senderId - L'identifiant de l'expéditeur de l'invitation.
 * @property {string} receiverId - L'identifiant du destinataire de l'invitation.
 * @property {string} status - Le statut de l'invitation.
 */
export interface Invit {
    id: number;
    senderId: string;
    receiverId: string;
    status: string;
  }