export type HtmlSnippet = {
  id: string;
  html: string;
  createdAt: string;
  createdBy: string;
  title?: string;
  passphraseHash?: string;
  createdWithToken?: string; // Token used to create this snippet (for audit)
};

export type UserToken = {
  userId: string;
  token: string;
  createdAt: string;
  name?: string;
  deletedAt?: string; // ISO timestamp when token was deleted (inactive)
};
