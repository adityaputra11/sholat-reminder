import { City, Country, State } from "country-state-city";

export async function fetchAllCountry() {
  const countries = Country.getAllCountries();
  return countries;
}

export async function fetchStateByCountryCode(countryCode: string) {
  const states = State.getStatesOfCountry(countryCode);
  return states;
}

export async function fetchCityByStateAndCountryCode(
  countryCode: string,
  stateCode: string
) {
  const cities = City.getCitiesOfState(countryCode, stateCode);
  return cities;
}
