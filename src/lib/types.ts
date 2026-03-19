export type HtmlSnippet = {
  id: string;
  html: string;
  createdAt: string;
  createdBy: string;
  title?: string;
  passphraseHash?: string;
};

export type UserToken = {
  userId: string;
  token: string;
  createdAt: string;
  name?: string;
};
