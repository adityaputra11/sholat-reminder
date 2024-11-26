export type Quote = {
  id: number;
  content: string;
  author: string;
};

export type QuoteResponse = {
  data: Quote[];
};
