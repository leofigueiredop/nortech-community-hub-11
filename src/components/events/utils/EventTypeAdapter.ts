
// Fix for the comparison errors in lines 101-102
// We need to properly handle status type checking

export const getEventStatus = (status: string): "live" | "upcoming" | "ended" | "happening_soon" | "in_progress" => {
  // Convert status strings to allowed types using type assertion to prevent comparison errors
  if (status === "past") return "ended";
  if (status === "cancelled") return "ended";
  
  // Default fallback for invalid statuses
  if (!(["live", "upcoming", "ended", "happening_soon", "in_progress"] as string[]).includes(status)) {
    return "upcoming";
  }
  
  return status as "live" | "upcoming" | "ended" | "happening_soon" | "in_progress";
};
