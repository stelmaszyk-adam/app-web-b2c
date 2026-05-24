"use client";

import {
  createContext,
  useContext,
  useState,
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

function getInitialGeoStatus(): GeoStatus {
  if (typeof window === "undefined") return "idle";
  return isGeolocationDenied() ? "denied" : "idle";
}

function getInitialFirstVisit(): boolean {
  if (typeof window === "undefined") return false;
  return !getSavedCity();
}

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

  const [geoStatus, setGeoStatus] = useState<GeoStatus>(getInitialGeoStatus);
  const [isFirstVisit, setIsFirstVisit] = useState(getInitialFirstVisit);
  // Show city picker automatically on first visit (no saved city)
  const [showCityPicker, setShowCityPicker] = useState(isFirstVisit);

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
      setShowCityPicker(true);
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
        setShowCityPicker(true);
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
