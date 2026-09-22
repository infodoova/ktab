import tokenManager, {
  TOKEN_EXPIRY_MINUTES,
  TOTAL_TOKEN_EXPIRY,
  calculateRefreshThreshold,
  calculateCheckInterval,
  hasSessionHint,
  setSessionHint,
} from "../src/core/services/tokenManager";

export {
  tokenManager,
  TOKEN_EXPIRY_MINUTES,
  TOTAL_TOKEN_EXPIRY,
  calculateRefreshThreshold,
  calculateCheckInterval,
  hasSessionHint,
  setSessionHint,
};
export default tokenManager;
