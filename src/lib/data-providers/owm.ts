export interface OWMWeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  rain_1h?: number;
  wind_speed: number;
  provenance: {
    source: string;
    status: "LIVE" | "ERROR" | "MOCK";
    lastUpdated: Date;
  };
}

export async function getWeatherData(city: string = "Hyderabad,IN"): Promise<OWMWeatherData> {
  const apiKey = process.env.OWM_API_KEY;

  if (!apiKey) {
    console.warn("OWM_API_KEY is missing. Falling back to mock weather data.");
    return getMockWeatherData();
  }

  try {
    // Next.js fetch with revalidation (cache for 10 minutes)
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      console.error("OpenWeatherMap API error:", await res.text());
      return getMockWeatherData("ERROR");
    }

    const data = await res.json();

    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0]?.description || "Unknown",
      rain_1h: data.rain?.["1h"],
      wind_speed: data.wind?.speed || 0,
      provenance: {
        source: "OpenWeatherMap API",
        status: "LIVE",
        lastUpdated: new Date(),
      },
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return getMockWeatherData("ERROR");
  }
}

function getMockWeatherData(status: "MOCK" | "ERROR" = "MOCK"): OWMWeatherData {
  return {
    temp: 38.5,
    feels_like: 42.0,
    humidity: 45,
    description: "scattered clouds",
    rain_1h: 0,
    wind_speed: 5.5,
    provenance: {
      source: "OpenWeatherMap API (Mock Fallback)",
      status,
      lastUpdated: new Date(),
    },
  };
}
