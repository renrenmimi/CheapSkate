import fs from "fs";
import path from "path";
import type { Brand } from "../types";

// File-backed cache so live-fetched brand data survives dev-server restarts
// and each brand costs one web-search run per TTL window, not per page view.

const CACHE_FILE = path.join(process.cwd(), ".cache", "brand-live.json");
const TTL_MS =
  Number(process.env.BRAND_CACHE_TTL_HOURS ?? 6) * 60 * 60 * 1000;

interface Entry {
  fetchedAt: string;
  brand: Brand;
}

type Store = Record<string, Entry>;

let memory: Store | null = null;

function load(): Store {
  if (memory) return memory;
  try {
    memory = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as Store;
  } catch {
    memory = {};
  }
  return memory;
}

function save(store: Store) {
  memory = store;
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2));
  } catch {
    // cache persistence is best-effort; memory copy still works
  }
}

export function getCached(id: string): Entry | null {
  const entry = load()[id];
  if (!entry) return null;
  if (Date.now() - new Date(entry.fetchedAt).getTime() > TTL_MS) return null;
  return entry;
}

export function putCached(id: string, brand: Brand) {
  const store = load();
  store[id] = { fetchedAt: new Date().toISOString(), brand };
  save(store);
}
