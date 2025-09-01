// Get last updated date for a single JSON file
export async function getJsonLastUpdated(key: "prov" | "uob" | "core") {
  // Sample JSON response for demonstration
  return {
    name: key,
    lastUpdatedUtc: "2025-09-01T12:00:00Z"
  };
}

export async function getJsonData(key: "prov" | "uob" | "core") {
  // Sample JSON data for demonstration
  return {
    key,
    data: {
      example: true,
      message: `Sample data for ${key}`
    }
  };
}

export async function updateJsonData(key: "prov" | "uob" | "core", data: any) {
  // Simulate update and return a sample response
  return {
    key,
    updated: true,
    received: data
  };
}
