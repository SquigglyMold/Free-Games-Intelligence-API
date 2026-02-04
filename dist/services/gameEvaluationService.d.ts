/**
 * Game evaluation derived exclusively from Epic Games Store data.
 * Computes value_score (0-100), original_price display, why_claim, and skip_if.
 */
import type { NormalizedGame, FreeGameResponse } from '../types';
/**
 * Converts a normalized Epic game into the API response shape with
 * value_score, why_claim, and skip_if derived only from Epic data.
 */
export declare function toFreeGameResponse(g: NormalizedGame): FreeGameResponse;
/**
 * Converts an array of normalized games to API response format.
 */
export declare function toFreeGameResponses(games: NormalizedGame[]): FreeGameResponse[];
//# sourceMappingURL=gameEvaluationService.d.ts.map