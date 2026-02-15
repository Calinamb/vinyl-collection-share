export async function http(url, options = {}) {
  const res = await fetch(url, options);

 
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {

    const message = (data && data.error) ? data.error : "Request failed";
    throw new Error(message);
  }

  return data;
}
