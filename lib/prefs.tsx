"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { IdentityGroup, UserPrefs } from "./types";
import { slugifyBrand } from "./slug";

const STORAGE_KEY = "cheapskate.prefs.v1";

const EMPTY: UserPrefs = {
  favoriteBrandIds: [],
  customBrands: [],
  cardIds: [],
  identities: [],
};

interface PrefsContextValue {
  prefs: UserPrefs;
  /** False until localStorage has been read — avoids hydration flicker. */
  loaded: boolean;
  toggleBrand: (id: string) => void;
  addCustomBrand: (name: string) => void;
  removeCustomBrand: (id: string) => void;
  toggleCard: (id: string) => void;
  toggleIdentity: (id: IdentityGroup) => void;
  reset: () => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<UserPrefs>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // corrupted storage — start fresh
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: UserPrefs) => {
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const value: PrefsContextValue = {
    prefs,
    loaded,
    toggleBrand: (id) =>
      persist({ ...prefs, favoriteBrandIds: toggleIn(prefs.favoriteBrandIds, id) }),
    addCustomBrand: (name) => {
      const id = slugifyBrand(name);
      if (!id) return;
      if (prefs.customBrands.some((b) => b.id === id)) return;
      if (prefs.favoriteBrandIds.includes(id)) return;
      persist({
        ...prefs,
        customBrands: [...prefs.customBrands, { id, name: name.trim() }],
      });
    },
    removeCustomBrand: (id) =>
      persist({
        ...prefs,
        customBrands: prefs.customBrands.filter((b) => b.id !== id),
      }),
    toggleCard: (id) => persist({ ...prefs, cardIds: toggleIn(prefs.cardIds, id) }),
    toggleIdentity: (id) =>
      persist({
        ...prefs,
        identities: toggleIn(prefs.identities, id) as IdentityGroup[],
      }),
    reset: () => persist(EMPTY),
  };

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}
