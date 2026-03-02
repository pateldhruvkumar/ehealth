// ─── Auth ────────────────────────────────────────────────────────────────────
/** JWT token lifetime — passed directly to jsonwebtoken `expiresIn` option. */
export const JWT_EXPIRES_IN = "7d" as const;

/** bcrypt cost factor. Higher = slower hash but more secure. */
export const BCRYPT_ROUNDS = 10;

// ─── S3 Presigned URLs ───────────────────────────────────────────────────────
/** Seconds until a PUT presigned upload URL expires (15 min). */
export const S3_UPLOAD_URL_EXPIRES_IN = 15 * 60; // 900

/** Seconds until a GET presigned download URL expires (1 hr). */
export const S3_DOWNLOAD_URL_EXPIRES_IN = 60 * 60; // 3600

// ─── Pagination ──────────────────────────────────────────────────────────────
/** Default page size when no `limit` query param is supplied. */
export const PAGINATION_DEFAULT_LIMIT = 10;

/** Hard cap on `limit` — prevents accidentally fetching the whole table. */
export const PAGINATION_MAX_LIMIT = 100;

// ─── Access Codes ────────────────────────────────────────────────────────────
/** Character count for randomly-generated sharing access codes. */
export const ACCESS_CODE_LENGTH = 8;
