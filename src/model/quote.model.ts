export type Quote = {
  id: number;
  content: string;
  author: string;
};

export type QuotesResponse = {
  data: Quote[];
};

export type QuoteResponse = {
  data: Quote;
};
