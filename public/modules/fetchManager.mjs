import { http } from "./http.mjs";


export function get(url) {
  return http(url);
}

export function post(url, data) {
  return http(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export function del(url) {
  return http(url, {
    method: "DELETE"
  });
}
