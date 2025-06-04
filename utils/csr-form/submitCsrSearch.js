export default async function submitCsrSearch(payload) {
  const response = await fetch("https://www.lilly.com/csr-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}
