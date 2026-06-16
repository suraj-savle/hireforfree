const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getErrorMessage(data: unknown) {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return "Request failed";
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");

  let data: unknown = null;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
  throw new Error(getErrorMessage(data));
}

return (data ?? {}) as T;
}
