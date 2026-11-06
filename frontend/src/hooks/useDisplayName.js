import { useAuth } from "./useAuth.js";
import { getGuestName } from "../utils/sessionPreferences.js";

// Name shown on your video tile and chat messages: the account's name when logged in,
// otherwise the name typed on the guest page (or "Guest").
export const useDisplayName = () => {
  const { currentUser } = useAuth();
  return currentUser?.name || getGuestName();
};
