import type { CategorySlug } from "./categories";

export interface OpeningHoursEntry {
  day: string;
  dayPl: string;
  hours: string;
  isClosed?: boolean;
  isTemporaryClosure?: boolean;
  isHoliday?: boolean;
  isOpenUntilLate?: boolean;
}

export interface MockVenue {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  categoryLabel: string;
  address: string;
  city: string;
  description: string;
  followers: number;
  photoUrl: string | null;
  venuePhotos: string[];
  lat: number;
  lng: number;
  openingHours: OpeningHoursEntry[];
  upcomingEventIds: string[];
}

export const MOCK_VENUES: MockVenue[] = [
  {
    id: "v3",
    name: "SQ Klub",
    slug: "sq-klub",
    category: "nightlife",
    categoryLabel: "Klub muzyczny",
    address: "Wenecjanska 9, 61-108 Poznan",
    city: "poznan",
    description:
      "SQ Klub to jedno z najbardziej rozpoznawalnych miejsc na poznanskiej mapie elektroniki. Od 2014 roku gospodarz cotygodniowych nocy techno i house, a takze rezydencji takich jak Concrete Soul i Modular. Trzy sale, dwa systemy soundu, dach dostepny w sezonie.",
    followers: 4280,
    photoUrl: "/mock/event-3.jpg",
    venuePhotos: ["/mock/event-3.jpg", "/mock/event-2.jpg"],
    lat: 52.4025,
    lng: 16.9198,
    openingHours: [
      { day: "Monday", dayPl: "Poniedzialek", hours: "zamkniete", isClosed: true },
      { day: "Tuesday", dayPl: "Wtorek", hours: "23:00 - 06:00" },
      { day: "Wednesday", dayPl: "Sroda", hours: "zamkniete", isClosed: true },
      { day: "Thursday", dayPl: "Czwartek", hours: "23:00 - 06:00" },
      { day: "Friday", dayPl: "Piatek", hours: "23:00 - 07:00", isOpenUntilLate: true },
      { day: "Saturday", dayPl: "Sobota", hours: "23:00 - 07:00", isOpenUntilLate: true },
      { day: "Sunday", dayPl: "Niedziela", hours: "zamkniete", isClosed: true },
    ],
    upcomingEventIds: ["e3"],
  },
  {
    id: "v1",
    name: "Aula UAM",
    slug: "aula-uam",
    category: "music",
    categoryLabel: "Sala koncertowa",
    address: "Wieniawskiego 1, 61-712 Poznan",
    city: "poznan",
    description:
      "Aula Uniwersytetu im. Adama Mickiewicza — jedna z najlepszych sal koncertowych w Poznaniu, znana z doskonalej akustyki. Regularne koncerty muzyki klasycznej, jazzowej i wspolczesnej.",
    followers: 2140,
    photoUrl: "/mock/event-1.jpg",
    venuePhotos: ["/mock/event-1.jpg"],
    lat: 52.4083,
    lng: 16.9172,
    openingHours: [
      { day: "Monday", dayPl: "Poniedzialek", hours: "09:00 - 21:00" },
      { day: "Tuesday", dayPl: "Wtorek", hours: "09:00 - 21:00" },
      { day: "Wednesday", dayPl: "Sroda", hours: "09:00 - 21:00" },
      { day: "Thursday", dayPl: "Czwartek", hours: "09:00 - 21:00" },
      { day: "Friday", dayPl: "Piatek", hours: "09:00 - 21:00" },
      { day: "Saturday", dayPl: "Sobota", hours: "10:00 - 18:00" },
      { day: "Sunday", dayPl: "Niedziela", hours: "zamkniete", isClosed: true },
    ],
    upcomingEventIds: ["e1"],
  },
  {
    id: "v7",
    name: "Klub Stodola",
    slug: "klub-stodola",
    category: "performing_arts",
    categoryLabel: "Klub",
    address: "Bukowska 16, 60-809 Poznan",
    city: "poznan",
    description:
      "Klub Stodola to legendarna scena koncertowa w Poznaniu. Od ponad 20 lat gosci krajowych i miedzynarodowych artystow — od rocka, przez stand-up, po kabaret.",
    followers: 3650,
    photoUrl: null,
    venuePhotos: [],
    lat: 52.4055,
    lng: 16.9055,
    openingHours: [
      { day: "Monday", dayPl: "Poniedzialek", hours: "zamkniete", isClosed: true },
      { day: "Tuesday", dayPl: "Wtorek", hours: "zamkniete", isClosed: true },
      { day: "Wednesday", dayPl: "Sroda", hours: "18:00 - 23:00" },
      { day: "Thursday", dayPl: "Czwartek", hours: "18:00 - 23:00" },
      { day: "Friday", dayPl: "Piatek", hours: "18:00 - 01:00", isOpenUntilLate: true },
      {
        day: "Saturday",
        dayPl: "Sobota",
        hours: "zamkniete (swieto)",
        isClosed: true,
        isHoliday: true,
      },
      { day: "Sunday", dayPl: "Niedziela", hours: "zamkniete", isClosed: true },
    ],
    upcomingEventIds: ["e7"],
  },
  {
    id: "v-empty",
    name: "Nowa Scena",
    slug: "nowa-scena",
    category: "performing_arts",
    categoryLabel: "Teatr",
    address: "Fredry 10, 61-701 Poznan",
    city: "poznan",
    description:
      "Nowa Scena to kameralna przestrzen teatralna w samym centrum Poznania. Powstala w 2024 roku z inicjatywy mlodych tworcow.",
    followers: 320,
    photoUrl: "/mock/event-9.jpg",
    venuePhotos: [],
    lat: 52.4072,
    lng: 16.9295,
    openingHours: [
      { day: "Monday", dayPl: "Poniedzialek", hours: "zamkniete", isClosed: true },
      { day: "Tuesday", dayPl: "Wtorek", hours: "16:00 - 22:00" },
      { day: "Wednesday", dayPl: "Sroda", hours: "16:00 - 22:00" },
      { day: "Thursday", dayPl: "Czwartek", hours: "16:00 - 22:00" },
      { day: "Friday", dayPl: "Piatek", hours: "16:00 - 23:00" },
      { day: "Saturday", dayPl: "Sobota", hours: "12:00 - 23:00" },
      { day: "Sunday", dayPl: "Niedziela", hours: "12:00 - 20:00" },
    ],
    upcomingEventIds: [],
  },
];

export const VENUE_MAP = Object.fromEntries(
  MOCK_VENUES.map((v) => [v.id, v]),
) as Record<string, MockVenue>;
