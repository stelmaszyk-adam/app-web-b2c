import type { CategorySlug } from "@/lib/categories";

export interface MockApiVenue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: CategorySlug;
  venue_type: string;
  description: string;
  photo_url: string | null;
  follower_count: number;
  is_claimed: boolean;
  photos: { id: string; url: string; position: number }[];
  opening_hours: {
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_flexible_close: boolean;
  }[];
  upcoming_events: {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    category: CategorySlug;
    photo_url: string | null;
  }[];
  created_at: string;
}

export interface MockApiEvent {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  category: CategorySlug;
  description: string;
  photo_url: string | null;
  price: number | null;
  ticket_url: string | null;
  source: string;
  venue: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  created_at: string;
  status: string;
  is_cancelled: boolean;
  photos?: { id: string; url: string; position: number }[];
  recurring_template_id?: string | null;
  recurrence?: { frequency: "daily" | "weekly" | "monthly" } | null;
  series_instances?: {
    id: string;
    start_time: string;
    end_time: string;
    is_cancelled: boolean;
  }[];
}

export const MOCK_VENUES: MockApiVenue[] = [
  {
    id: "v1",
    name: "Aula UAM",
    address: "Wieniawskiego 1, 61-712 Poznań",
    lat: 52.4083,
    lng: 16.9172,
    category: "music",
    venue_type: "concert_hall",
    description:
      "Aula Uniwersytetu im. Adama Mickiewicza — jedna z najlepszych sal koncertowych w Poznaniu.",
    photo_url: "/mock/event-1.jpg",
    follower_count: 2140,
    is_claimed: true,
    photos: [{ id: "v1-p1", url: "/mock/event-1.jpg", position: 0 }],
    opening_hours: [
      {
        day_of_week: 1,
        open_time: "09:00",
        close_time: "21:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 2,
        open_time: "09:00",
        close_time: "21:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 3,
        open_time: "09:00",
        close_time: "21:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 4,
        open_time: "09:00",
        close_time: "21:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 5,
        open_time: "09:00",
        close_time: "21:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 6,
        open_time: "10:00",
        close_time: "18:00",
        is_flexible_close: false,
      },
    ],
    upcoming_events: [
      {
        id: "e1",
        name: "Nils Frahm — All Encores Tour",
        start_time: "2026-11-24T20:00:00Z",
        end_time: "2026-11-24T22:00:00Z",
        category: "music",
        photo_url: "/mock/event-1.jpg",
      },
    ],
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "v2",
    name: "Tama",
    address: "Szyperska 3, 61-754 Poznań",
    lat: 52.4119,
    lng: 16.9305,
    category: "music",
    venue_type: "club",
    description:
      "Klub muzyczny nad Wartą z regularnymi koncertami i imprezami charytatywnymi.",
    photo_url: "/mock/event-2.jpg",
    follower_count: 980,
    is_claimed: false,
    photos: [],
    opening_hours: [
      {
        day_of_week: 4,
        open_time: "19:00",
        close_time: "02:00",
        is_flexible_close: true,
      },
      {
        day_of_week: 5,
        open_time: "19:00",
        close_time: "04:00",
        is_flexible_close: true,
      },
      {
        day_of_week: 6,
        open_time: "19:00",
        close_time: "04:00",
        is_flexible_close: true,
      },
    ],
    upcoming_events: [
      {
        id: "e2",
        name: "Smolik / Kev Fox — Solidarni z Ukrainą",
        start_time: "2026-11-24T21:30:00Z",
        end_time: "2026-11-25T00:00:00Z",
        category: "music",
        photo_url: "/mock/event-2.jpg",
      },
    ],
    created_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "v3",
    name: "SQ Klub",
    address: "Wenecjańska 9, 61-108 Poznań",
    lat: 52.4025,
    lng: 16.9198,
    category: "nightlife",
    venue_type: "club",
    description:
      "Jedno z najbardziej rozpoznawalnych miejsc na poznańskiej mapie elektroniki.",
    photo_url: "/mock/event-3.jpg",
    follower_count: 4280,
    is_claimed: true,
    photos: [
      { id: "v3-p1", url: "/mock/event-3.jpg", position: 0 },
      { id: "v3-p2", url: "/mock/event-2.jpg", position: 1 },
    ],
    opening_hours: [
      {
        day_of_week: 2,
        open_time: "23:00",
        close_time: "06:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 4,
        open_time: "23:00",
        close_time: "06:00",
        is_flexible_close: false,
      },
      {
        day_of_week: 5,
        open_time: "23:00",
        close_time: "07:00",
        is_flexible_close: true,
      },
      {
        day_of_week: 6,
        open_time: "23:00",
        close_time: "07:00",
        is_flexible_close: true,
      },
    ],
    upcoming_events: [
      {
        id: "e3",
        name: "Techno Tuesday: Recondite (live)",
        start_time: "2026-11-27T23:00:00Z",
        end_time: "2026-11-28T04:00:00Z",
        category: "nightlife",
        photo_url: "/mock/event-3.jpg",
      },
    ],
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "v4",
    name: "Piwnica pod Baranami",
    address: "Rynek Główny 27, 31-010 Kraków",
    lat: 50.0617,
    lng: 19.9373,
    category: "music",
    venue_type: "concert_hall",
    description: "Legendarna piwnica artystyczna w samym sercu Krakowa.",
    photo_url: null,
    follower_count: 512,
    is_claimed: false,
    photos: [],
    opening_hours: [
      {
        day_of_week: 6,
        open_time: "20:00",
        close_time: "23:00",
        is_flexible_close: false,
      },
    ],
    upcoming_events: [
      {
        id: "e5",
        name: "Kraków Jazz Autumn — preview",
        start_time: "2026-11-24T20:00:00Z",
        end_time: "2026-11-24T22:00:00Z",
        category: "music",
        photo_url: null,
      },
    ],
    created_at: "2025-03-10T10:00:00Z",
  },
];

export const MOCK_EVENTS: MockApiEvent[] = [
  {
    id: "e1",
    name: "Nils Frahm — All Encores Tour",
    start_time: "2026-11-24T20:00:00Z",
    end_time: "2026-11-24T22:00:00Z",
    category: "music",
    description:
      "Niemiecki kompozytor i pianista po raz pierwszy w Poznaniu. Dwie godziny improwizacji na fortepianie, syntezatorach i organach.",
    photo_url: "/mock/event-1.jpg",
    price: 189,
    ticket_url: "https://bilety.example.com/nils-frahm",
    source: "manual",
    venue: {
      id: "v1",
      name: "Aula UAM",
      address: "Wieniawskiego 1, 61-712 Poznań",
      lat: 52.4083,
      lng: 16.9172,
    },
    created_at: "2026-09-01T08:00:00Z",
    status: "published",
    is_cancelled: false,
    photos: [
      { id: "e1-p1", url: "/mock/event-1.jpg", position: 0 },
      { id: "e1-p2", url: "/mock/event-2.jpg", position: 1 },
      { id: "e1-p3", url: "/mock/event-3.jpg", position: 2 },
    ],
    recurring_template_id: null,
    recurrence: null,
  },
  {
    id: "e2",
    name: "Smolik / Kev Fox — Solidarni z Ukrainą",
    start_time: "2026-11-24T21:30:00Z",
    end_time: "2026-11-25T00:00:00Z",
    category: "music",
    description:
      "Smolik i Kev Fox spotykają się na scenie po raz pierwszy w tym roku. Cały dochód z biletów trafia do Fundacji Pomocy Ukrainie.",
    photo_url: "/mock/event-2.jpg",
    price: 129,
    ticket_url: null,
    source: "manual",
    venue: {
      id: "v2",
      name: "Tama",
      address: "Szyperska 3, 61-754 Poznań",
      lat: 52.4119,
      lng: 16.9305,
    },
    created_at: "2026-09-02T08:00:00Z",
    status: "published",
    is_cancelled: false,
  },
  {
    id: "e3",
    name: "Techno Tuesday: Recondite (live)",
    start_time: "2026-11-27T23:00:00Z",
    end_time: "2026-11-28T04:00:00Z",
    category: "nightlife",
    description:
      "Cotygodniowa noc techno w SQ. Tym razem na żywo Recondite — mistrz minimalistycznego, melancholijnego brzmienia.",
    photo_url: "/mock/event-3.jpg",
    price: 80,
    ticket_url: "https://bilety.example.com/techno-tuesday",
    source: "GoOut",
    venue: {
      id: "v3",
      name: "SQ Klub",
      address: "Wenecjańska 9, 61-108 Poznań",
      lat: 52.4025,
      lng: 16.9198,
    },
    created_at: "2026-08-15T08:00:00Z",
    status: "published",
    is_cancelled: false,
    recurring_template_id: "e3-template",
    recurrence: { frequency: "weekly" },
    series_instances: [
      {
        id: "e3",
        start_time: "2026-11-27T23:00:00Z",
        end_time: "2026-11-28T04:00:00Z",
        is_cancelled: false,
      },
      {
        id: "e3-r1",
        start_time: "2026-12-04T23:00:00Z",
        end_time: "2026-12-05T04:00:00Z",
        is_cancelled: false,
      },
      {
        id: "e3-r2",
        start_time: "2026-12-11T23:00:00Z",
        end_time: "2026-12-12T04:00:00Z",
        is_cancelled: false,
      },
      {
        id: "e3-r3",
        start_time: "2026-12-18T23:00:00Z",
        end_time: "2026-12-19T04:00:00Z",
        is_cancelled: true,
      },
    ],
  },
  {
    id: "e4",
    name: "Wystawa: Wojciech Fangor — Powierzchnie",
    start_time: "2026-11-25T10:00:00Z",
    end_time: "2026-12-30T18:00:00Z",
    category: "arts_culture",
    description:
      "Retrospektywa jednego z najważniejszych polskich artystów XX wieku. 60 obrazów, instalacja site-specific.",
    photo_url: "/mock/event-4.jpg",
    price: 0,
    ticket_url: null,
    source: "manual",
    venue: {
      id: "v1",
      name: "Aula UAM",
      address: "Wieniawskiego 1, 61-712 Poznań",
      lat: 52.4083,
      lng: 16.9172,
    },
    created_at: "2026-09-03T08:00:00Z",
    status: "published",
    is_cancelled: false,
  },
  {
    id: "e5",
    name: "Kraków Jazz Autumn — preview",
    start_time: "2026-11-24T20:00:00Z",
    end_time: "2026-11-24T22:00:00Z",
    category: "music",
    description: "Wieczór jazzowy w legendarnej Piwnicy pod Baranami.",
    photo_url: null,
    price: 120,
    ticket_url: null,
    source: "manual",
    venue: {
      id: "v4",
      name: "Piwnica pod Baranami",
      address: "Rynek Główny 27, 31-010 Kraków",
      lat: 50.0617,
      lng: 19.9373,
    },
    created_at: "2026-09-04T08:00:00Z",
    status: "published",
    is_cancelled: false,
  },
];
