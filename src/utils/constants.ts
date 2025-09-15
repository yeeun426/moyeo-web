export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER_ID: "userId",
  NICKNAME: "nickname",
  CHARACTER: "character",
  OAUTH_STATE: "oauth_state",
} as const;

export const ERROR_MESSAGES = {
  NO_CODE: "인증 코드가 없습니다.",
  STATE_MISMATCH: "보안 검증에 실패했습니다.",
  LOGIN_FAILED: "로그인에 실패했습니다.",
  PROCESSING_ERROR: "로그인 처리 중 오류가 발생했습니다.",
} as const;

export const ERROR_ROUTES = {
  CODE_MISSING: "/auth/error?message=authorization_code_missing",
  STATE_MISMATCH: "/auth/error?message=state_mismatch",
  LOGIN_FAILED: "/auth/error?message=login_failed",
} as const;
