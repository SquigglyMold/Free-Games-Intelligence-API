/**
 * Epic Games Store free games service.
 * Fetches live data from the Epic freeGamesPromotions endpoint.
 * All game data is derived exclusively from Epic; no external sources.
 */

import { getJson } from './httpClient';
import type {
  EpicFreeGamesResponse,
  EpicSearchStoreElement,
  EpicPromotionalOffer,
} from '../types';
import type { NormalizedGame, EpicFreeGamesListResult, EpicFreeGameBySlugResult } from '../types';

/** Live Epic free games promotions endpoint (no auth required). */
const EPIC_FREE_GAMES_URL = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';

/** Flatten Epic's nested promotionalOffers (live API returns wrappers with inner promotionalOffers[]). */
function getActiveFreeOffers(element: EpicSearchStoreElement): EpicPromotionalOffer[] {
  const wrappers = element.promotions?.promotionalOffers ?? [];
  const flat: EpicPromotionalOffer[] = [];
  for (const w of wrappers) {
    const inner = (w as { promotionalOffers?: EpicPromotionalOffer[] }).promotionalOffers;
    if (Array.isArray(inner) && inner.length > 0) {
      flat.push(...inner);
    } else if (w.endDate != null || w.startDate != null) {
      flat.push(w as EpicPromotionalOffer);
    }
  }
  return flat;
}

function isCurrentlyFree(element: EpicSearchStoreElement): boolean {
  const offers = getActiveFreeOffers(element);
  if (offers.length === 0) return false;
  const now = new Date();
  for (const offer of offers) {
    const end = offer.endDate ? new Date(offer.endDate) : null;
    const start = offer.startDate ? new Date(offer.startDate) : null;
    const pct = offer.discountSetting?.discountPercentage ?? 0;
    const is100Off = pct >= 100 || pct === 0;
    if (is100Off && end && end >= now && (!start || start <= now)) return true;
  }
  return false;
}

function getFreeUntil(element: EpicSearchStoreElement): string | null {
  const offers = getActiveFreeOffers(element);
  let latestEnd: Date | null = null;
  const now = new Date();
  for (const offer of offers) {
    const end = offer.endDate ? new Date(offer.endDate) : null;
    const pct = offer.discountSetting?.discountPercentage ?? 0;
    const is100Off = pct >= 100 || pct === 0;
    if (is100Off && end && end >= now && (!latestEnd || end > latestEnd)) latestEnd = end;
  }
  if (!latestEnd) return null;
  return latestEnd.toISOString().slice(0, 10);
}

function getOriginalPriceCents(element: EpicSearchStoreElement): number | null {
  const total = element.price?.totalPrice?.originalPrice;
  if (typeof total === 'number' && total >= 0) return total;
  const lineOffer = element.price?.lineOffers?.[0]?.price?.originalPrice;
  if (typeof lineOffer === 'number' && lineOffer >= 0) return lineOffer;
  return null;
}

function getKeyImagesCount(element: EpicSearchStoreElement): number {
  const arr = element.keyImages;
  return Array.isArray(arr) ? arr.length : 0;
}

function toSlug(title: string, element: EpicSearchStoreElement): string {
  const slug =
    element.productSlug ??
    element.catalogNs?.mappings?.[0]?.pageSlug ??
    element.urlSlug;
  if (slug && typeof slug === 'string') return slug;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function daysRemaining(freeUntil: string): number {
  const end = new Date(freeUntil + 'T23:59:59Z');
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function elementToNormalizedGame(element: EpicSearchStoreElement): NormalizedGame | null {
  const freeUntil = getFreeUntil(element);
  if (!freeUntil) return null;
  const title = element.title?.trim() ?? 'Unknown';
  const slug = toSlug(title, element);
  const description = (element.description ?? element.longDescription ?? '').trim() || 'No description.';
  const originalPriceCents = getOriginalPriceCents(element);
  const keyImagesCount = getKeyImagesCount(element);
  const days = daysRemaining(freeUntil);
  return {
    title,
    slug,
    free_until: freeUntil,
    description,
    originalPriceCents,
    keyImagesCount,
    daysRemaining: days,
  };
}

export async function fetchEpicFreeGamesStructured(): Promise<EpicFreeGamesListResult> {
  try {
    const body = await getJson<EpicFreeGamesResponse>(EPIC_FREE_GAMES_URL);
    const elements = body.data?.Catalog?.searchStore?.elements ?? [];
    const games: NormalizedGame[] = [];
    for (const el of elements) {
      if (!el?.title) continue;
      if (!isCurrentlyFree(el)) continue;
      const game = elementToNormalizedGame(el);
      if (game) games.push(game);
    }
    return {
      success: true,
      count: games.length,
      data: games,
      ...(games.length === 0 && { message: 'No free games currently available.' }),
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch Epic free games.';
    return {
      success: false,
      count: 0,
      data: [],
      message,
    };
  }
}

export async function fetchEpicFreeGames(): Promise<NormalizedGame[]> {
  const result = await fetchEpicFreeGamesStructured();
  if (!result.success) {
    throw new Error(result.message ?? 'Failed to fetch Epic free games.');
  }
  return result.data;
}

export async function getEpicFreeGameBySlug(slug: string): Promise<EpicFreeGameBySlugResult> {
  const trimmed = slug?.trim();
  if (!trimmed) {
    return { found: false, reason: 'not_found', message: 'Slug is required.' };
  }
  const result = await fetchEpicFreeGamesStructured();
  if (!result.success) {
    return { found: false, reason: 'not_free', message: result.message ?? 'Unable to load free games.' };
  }
  const game = result.data.find((g) => g.slug.toLowerCase() === trimmed.toLowerCase());
  if (game) {
    return { found: true, game };
  }
  return { found: false, reason: 'not_free', message: 'The title is not available as a free game at this time' };
}
