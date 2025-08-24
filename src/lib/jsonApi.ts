// Get last updated date for a single JSON file
export async function getJsonLastUpdated(key: "prov" | "uob" | "core") {
  const res = await fetch(`http://localhost:5000/json/${key}/last-updated`);
  if (!res.ok) throw new Error(`Failed to fetch last updated for ${key}`);
  return res.json() as Promise<{ name: string; lastUpdatedUtc: string }>;
}

export async function getJsonData(key: "prov" | "uob" | "core") {
  const res = await fetch(`http://localhost:5000/json/${key}`);
  if (!res.ok) throw new Error(`Failed to fetch ${key}`);
  return res.json();
}

export async function updateJsonData(
  key: "prov" | "uob" | "core",
  data: any
) {
  const res = await fetch(`http://localhost:5000/json/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update ${key}`);
}
