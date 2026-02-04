"use strict";
/**
 * Game evaluation derived exclusively from Epic Games Store data.
 * Computes value_score (0-100), original_price display, why_claim, and skip_if.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFreeGameResponse = toFreeGameResponse;
exports.toFreeGameResponses = toFreeGameResponses;
const MAX_VALUE_SCORE = 100;
function formatOriginalPrice(cents) {
    if (cents === null || cents < 0)
        return 'Price varies';
    const dollars = cents / 100;
    if (dollars >= 100)
        return `$${Math.round(dollars)}`;
    if (dollars >= 1)
        return `$${dollars.toFixed(2)}`;
    if (dollars > 0)
        return `$${dollars.toFixed(2)}`;
    return 'Free';
}
/**
 * value_score (0-100) from Epic-only data:
 * - Original price (higher = more value)
 * - Full base game (assumed for free promotions)
 * - Media richness (keyImages count)
 * - Urgency (time remaining)
 */
function computeValueScore(g) {
    let score = 0;
    // Original price: 0-40 pts. Higher price = better value when free.
    if (g.originalPriceCents !== null) {
        const dollars = g.originalPriceCents / 100;
        if (dollars >= 40)
            score += 40;
        else if (dollars >= 25)
            score += 35;
        else if (dollars >= 15)
            score += 25;
        else if (dollars >= 5)
            score += 15;
        else
            score += 5;
    }
    else {
        score += 10;
    }
    // Full base game: free promotions are full games. 20 pts.
    score += 20;
    // Media richness: keyImages count. 0-20 pts.
    if (g.keyImagesCount >= 7)
        score += 20;
    else if (g.keyImagesCount >= 4)
        score += 15;
    else if (g.keyImagesCount >= 1)
        score += 8;
    // Urgency: less time left = higher urgency score. 0-20 pts.
    if (g.daysRemaining <= 1)
        score += 20;
    else if (g.daysRemaining <= 3)
        score += 15;
    else if (g.daysRemaining <= 7)
        score += 10;
    else
        score += 5;
    return Math.min(MAX_VALUE_SCORE, Math.max(0, score));
}
/** Deterministic why_claim reasons from Epic data. */
function buildWhyClaim(g, originalPriceFormatted) {
    const reasons = [];
    if (g.originalPriceCents !== null && g.originalPriceCents > 0) {
        reasons.push(`Usually ${originalPriceFormatted}`);
    }
    reasons.push('Full base game');
    reasons.push('No purchase required');
    if (g.keyImagesCount >= 4) {
        reasons.push('Rich media (screenshots/videos)');
    }
    if (g.daysRemaining <= 7) {
        reasons.push(g.daysRemaining <= 1 ? 'Ends very soon' : `Ends in ${g.daysRemaining} days`);
    }
    return reasons;
}
/** Deterministic skip_if conditions from Epic data. */
function buildSkipIf(g) {
    const conditions = [];
    if (g.daysRemaining < 3) {
        conditions.push('Offer ends soon');
    }
    conditions.push('Check system requirements before claiming');
    return conditions;
}
/**
 * Converts a normalized Epic game into the API response shape with
 * value_score, why_claim, and skip_if derived only from Epic data.
 */
function toFreeGameResponse(g) {
    const original_price = formatOriginalPrice(g.originalPriceCents);
    const value_score = computeValueScore(g);
    const why_claim = buildWhyClaim(g, original_price);
    const skip_if = buildSkipIf(g);
    return {
        game: g.title,
        slug: g.slug,
        free_until: g.free_until,
        original_price,
        value_score,
        why_claim,
        skip_if,
    };
}
/**
 * Converts an array of normalized games to API response format.
 */
function toFreeGameResponses(games) {
    return games.map(toFreeGameResponse);
}
//# sourceMappingURL=gameEvaluationService.js.map