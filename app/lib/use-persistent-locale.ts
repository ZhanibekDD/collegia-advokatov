"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Locale } from "./portal-data";

const STORAGE_KEY = "jetisu-portal-locale";
const CHANGE_EVENT = "jetisu-portal-locale-change";

function readLocale(): Locale {
  return window.localStorage.getItem(STORAGE_KEY) === "kk" ? "kk" : "ru";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function usePersistentLocale(): [Locale, (locale: Locale) => void] {
  const locale = useSyncExternalStore(subscribe, readLocale, (): Locale => "ru");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [locale, setLocale];
}
