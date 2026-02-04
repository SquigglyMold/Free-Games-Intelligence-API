/**
 * Shared types for the Free Games Intelligence API.
 * All game data is derived exclusively from Epic Games Store.
 */
/** API response shape for a single free game (no raw Epic fields). */
export interface FreeGameResponse {
    game: string;
    slug: string;
    free_until: string;
    original_price: string;
    value_score: number;
    why_claim: string[];
    skip_if: string[];
}
/** Internal normalized game with Epic-derived fields used for evaluation. */
export interface NormalizedGame {
    title: string;
    slug: string;
    free_until: string;
    description: string;
    /** Original price in cents from Epic, or null if not provided. */
    originalPriceCents: number | null;
    /** Number of keyImages (screenshots/videos) from Epic. */
    keyImagesCount: number;
    /** Days until free offer ends. */
    daysRemaining: number;
}
/** Structured result when fetching the list of free games from Epic. */
export interface EpicFreeGamesListResult {
    success: boolean;
    count: number;
    data: NormalizedGame[];
    message?: string;
}
/** Structured result when looking up a single game by slug. */
export type EpicFreeGameBySlugResult = {
    found: true;
    game: NormalizedGame;
} | {
    found: false;
    reason: 'not_found' | 'not_free';
    message: string;
};
/** Epic Games Store API response types (freeGamesPromotions endpoint). */
export interface EpicDiscountSetting {
    discountType?: string;
    discountPercentage?: number;
}
export interface EpicPromotionalOffer {
    startDate?: string;
    endDate?: string;
    discountSetting?: EpicDiscountSetting;
}
/** Epic can nest offers: promotionalOffers[].promotionalOffers[] */
export interface EpicPromotionalOfferWrapper {
    startDate?: string;
    endDate?: string;
    discountSetting?: EpicDiscountSetting;
    promotionalOffers?: EpicPromotionalOffer[];
}
export interface EpicPromotions {
    promotionalOffers?: EpicPromotionalOfferWrapper[];
    upcomingPromotionalOffers?: EpicPromotionalOfferWrapper[];
}
export interface EpicCatalogMapping {
    pageSlug?: string;
    pageType?: string;
}
export interface EpicCatalogNs {
    mappings?: EpicCatalogMapping[];
}
export interface EpicKeyImage {
    type?: string;
    url?: string;
}
export interface EpicPriceLine {
    originalPrice?: number;
    discountPrice?: number;
}
export interface EpicTotalPrice {
    originalPrice?: number;
    discountPrice?: number;
    fmtPrice?: {
        originalPrice?: string;
    };
}
export interface EpicPrice {
    totalPrice?: EpicTotalPrice;
    lineOffers?: Array<{
        appliedRules?: unknown;
        price?: EpicPriceLine;
    }>;
}
export interface EpicSearchStoreElement {
    title?: string;
    description?: string;
    longDescription?: string;
    productSlug?: string;
    /** Fallback slug when productSlug and catalogNs.mappings are missing */
    urlSlug?: string;
    catalogNs?: EpicCatalogNs;
    promotions?: EpicPromotions;
    keyImages?: EpicKeyImage[];
    price?: EpicPrice;
    id?: string;
    offerType?: string;
    itemType?: string;
}
export interface EpicSearchStore {
    elements?: EpicSearchStoreElement[];
}
export interface EpicCatalog {
    searchStore?: EpicSearchStore;
}
/** Live API returns 200 with optional errors array + data (https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions) */
export interface EpicFreeGamesResponse {
    errors?: Array<{
        message?: string;
        path?: string[];
    }>;
    data?: {
        Catalog?: EpicCatalog;
    };
}
//# sourceMappingURL=index.d.ts.map