// lib/hero-intelligence.ts
export function getHeroByWeather(weather: any) {
    const rain = weather?.current?.precipitation ?? 0
    const wind = weather?.current?.wind_speed_10m ?? 0
    const temp = weather?.current?.temperature_2m ?? 20

    // 🌧️ Heavy rain
    if (rain > 2) {
        return {
            title: "🌧️ Heavy Rains Expected",
            subtitle: "Protect your crops from fungal diseases and water stress.",
            cta: "/shop",
            tag: "Fungicides & Crop Protection",
            theme: "rain",
        }
    }

    // ☀️ Hot & dry
    if (temp > 28 && rain < 0.5) {
        return {
            title: "☀️ Dry Conditions Ahead",
            subtitle: "Keep your crops hydrated and prevent heat stress.",
            cta: "/shop",
            tag: "Irrigation & Water Solutions",
            theme: "sun",
        }
    }

    // 🌱 Normal planting conditions
    return {
        title: "🌱 Good Farming Conditions",
        subtitle: "Perfect time for planting and fertiliser application.",
        cta: "/shop",
        tag: "Fertilisers & Seeds",
        theme: "balanced",
    }
}