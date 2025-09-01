import { MicroServiceApiKey } from "@/constants/MainConstants";

// Get last updated date for a single JSON file
export async function getJsonLastUpdated(key: MicroServiceApiKey) {
  const res = await fetch(
    `https://localhost:7298/api/configsetting/${key}/last-updated`
  );
  if (!res.ok) throw new Error(`Failed to fetch last updated for ${key}`);
  return res.json() as Promise<{ name: string; lastUpdatedUtc: string }>;
}

export async function getJsonData(key: MicroServiceApiKey) {
  const res = await fetch(`https://localhost:7298/api/configsetting/${key}`);
  if (!res.ok) throw new Error(`Failed to fetch ${key}`);
  return res.json();
}

export async function updateJsonData(key: MicroServiceApiKey, data: any) {
  const res = await fetch(`https://localhost:7298/api/configsetting/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update ${key}`);
}
