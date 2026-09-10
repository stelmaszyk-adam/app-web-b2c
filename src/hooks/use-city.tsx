"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { getCityBySlug, CITIES, type City } from "@/lib/cities";
import {
  getSavedCity,
  saveCity,
  isGeolocationDenied,
  setGeolocationDenied,
} from "@/lib/city-store";
import { findNearestCity } from "@/lib/geo-utils";
import { detectCityFromIp } from "@/lib/ip-city";

type GeoStatus = "idle" | "prompting" | "granted" | "denied" | "unavailable";

interface CityContextValue {
  city: City;
  geoStatus: GeoStatus;
  showCityPicker: boolean;
  isFirstVisit: boolean;
  openCityPicker: () => void;
  closeCityPicker: () => void;
  selectCity: (slug: string) => void;
  requestGeolocation: () => void;
}

const CityContext = createContext<CityContextValue | null>(null);

const DEFAULT_CITY = CITIES[0]; // Poznań

interface CityProviderProps {
  children: ReactNode;
}

export function CityProvider({ children }: CityProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Derive city from URL path (e.g. "/poznan" or "/poznan/music")
  const citySlug = pathname.split("/")[1] ?? "";
  const city = useMemo(
    () => getCityBySlug(citySlug) ?? DEFAULT_CITY,
    [citySlug],
  );

  // Always start as false on both server and client to avoid hydration mismatch.
  // The effect below updates these after mount when localStorage is available.
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  useEffect(() => {
    // Reads localStorage — unavailable on server, must run after mount to avoid hydration mismatch.
    const firstVisit = !getSavedCity();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFirstVisit(firstVisit);
    if (isGeolocationDenied()) setGeoStatus("denied");

    if (!firstVisit) return;

    // On first visit, try IP-based geolocation before showing the city picker.
    // If a city is detected the user is navigated there automatically; only fall
    // back to the picker when IP geo is unavailable.
    let cancelled = false;
    void detectCityFromIp().then((slug) => {
      if (cancelled) return;
      if (slug) {
        saveCity(slug);
        setIsFirstVisit(false);
        router.push(`/${slug}`);
      } else {
        setShowCityPicker(true);
      }
    });

    return () => {
      cancelled = true;
    };
    // router is stable in Next.js; including it would cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCity = useCallback(
    (slug: string) => {
      saveCity(slug);
      setShowCityPicker(false);
      setIsFirstVisit(false);
      router.push(`/${slug}`);
    },
    [router],
  );

  const openCityPicker = useCallback(() => setShowCityPicker(true), []);
  const closeCityPicker = useCallback(() => setShowCityPicker(false), []);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("unavailable");
      void detectCityFromIp().then((slug) => {
        if (slug) {
          selectCity(slug);
        } else {
          setShowCityPicker(true);
        }
      });
      return;
    }

    setGeoStatus("prompting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoStatus("granted");
        const nearest = findNearestCity(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (nearest) {
          selectCity(nearest.slug);
        } else {
          setShowCityPicker(true);
        }
      },
      () => {
        setGeoStatus("denied");
        setGeolocationDenied();
        // Try IP-based geolocation before falling back to the city picker
        void detectCityFromIp().then((slug) => {
          if (slug) {
            selectCity(slug);
          } else {
            setShowCityPicker(true);
          }
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [selectCity]);

  return (
    <CityContext.Provider
      value={{
        city,
        geoStatus,
        showCityPicker,
        isFirstVisit,
        openCityPicker,
        closeCityPicker,
        selectCity,
        requestGeolocation,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
