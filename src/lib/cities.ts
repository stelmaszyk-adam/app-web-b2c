export interface City {
  slug: string;
  name: string;
  namePl: string;
  region: string;
  eventCount: number;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  {
    slug: "poznan",
    name: "Poznan",
    namePl: "Poznań",
    region: "Wielkopolska",
    eventCount: 247,
    lat: 52.4064,
    lng: 16.9252,
  },
  {
    slug: "krakow",
    name: "Krakow",
    namePl: "Kraków",
    region: "Małopolska",
    eventCount: 412,
    lat: 50.0647,
    lng: 19.945,
  },
  {
    slug: "warszawa",
    name: "Warszawa",
    namePl: "Warszawa",
    region: "Mazowsze",
    eventCount: 638,
    lat: 52.2297,
    lng: 21.0122,
  },
  {
    slug: "wroclaw",
    name: "Wroclaw",
    namePl: "Wrocław",
    region: "Dolny Śląsk",
    eventCount: 298,
    lat: 51.1079,
    lng: 17.0385,
  },
  {
    slug: "gdansk",
    name: "Gdansk",
    namePl: "Gdańsk",
    region: "Pomorze",
    eventCount: 184,
    lat: 54.352,
    lng: 18.6466,
  },
  {
    slug: "lodz",
    name: "Lodz",
    namePl: "Łódź",
    region: "Łódzkie",
    eventCount: 156,
    lat: 51.7592,
    lng: 19.456,
  },
  {
    slug: "katowice",
    name: "Katowice",
    namePl: "Katowice",
    region: "Śląsk",
    eventCount: 128,
    lat: 50.2649,
    lng: 19.0238,
  },
  {
    slug: "lublin",
    name: "Lublin",
    namePl: "Lublin",
    region: "Lubelskie",
    eventCount: 92,
    lat: 51.2465,
    lng: 22.5684,
  },
  {
    slug: "szczecin",
    name: "Szczecin",
    namePl: "Szczecin",
    region: "Pomorze Zach.",
    eventCount: 78,
    lat: 53.4285,
    lng: 14.5528,
  },
];

export const CITY_MAP = Object.fromEntries(
  CITIES.map((c) => [c.slug, c]),
) as Record<string, City>;

export function getCityBySlug(slug: string): City | undefined {
  return CITY_MAP[slug];
}
