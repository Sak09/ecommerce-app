const TOKEN_COOKIE_NAMES = ["access-token", "token"];

export const getAuthToken = () => {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) =>
    TOKEN_COOKIE_NAMES.some((name) => cookie.startsWith(`${name}=`))
  );

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : "";
};

export const clearAuthToken = () => {
  TOKEN_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  });
};

export const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = {
      status: response.status,
      message: data?.message || response.statusText || "Something went wrong",
      data,
    };

    if (response.status === 401) {
      clearAuthToken();
      error.authExpired = true;
    }

    throw error;
  }

  return data;
};
