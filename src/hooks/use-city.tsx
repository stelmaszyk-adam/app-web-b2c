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
    const firstVisit = !getSavedCity();
    setIsFirstVisit(firstVisit);
    setShowCityPicker(firstVisit);
    if (isGeolocationDenied()) setGeoStatus("denied");
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
