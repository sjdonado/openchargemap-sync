import { type Country } from './poi';

export type ScraperMessage = {
  id: string;
  country: Country;
  countriesCount: number;
};
