const BASE_URL = "https://frontend-take-home-service.fetch.com";

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiRequest = async (
  endpoint: string,
  options: ApiOptions = {}
): Promise<Response> => {
  const url: string = `${BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  return fetch(url, config);
};
