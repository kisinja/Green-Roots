// lib/weather.ts
export async function getWeather() {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=-1.2864&longitude=36.8172&current=temperature_2m,precipitation,wind_speed_10m`,
        {
            next: {
                revalidate: 60 * 60, // 15 minutes
            }
        }
    )

    if (!res.ok) throw new Error("Weather fetch failed")
    const data = await res.json()
    //console.log(data);

    return data
}