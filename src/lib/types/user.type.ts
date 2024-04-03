type Token = {
  value: string;
  date: number;
};

export type User = {
  auth?: {
    nonce?: Token;
    refresh?: Token;
    access?: Token;
  };
};
