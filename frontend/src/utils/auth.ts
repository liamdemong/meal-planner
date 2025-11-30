import { auth } from "../firebase";

// Get the current user's Firebase ID token for API authentication
export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

// Fetch wrapper that automatically includes authentication header
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}
