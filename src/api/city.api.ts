import { Country, State } from "country-state-city";

export async function fetchAllCountry() {
  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(countries[0].isoCode);

  console.log(states);
  return countries;
}
