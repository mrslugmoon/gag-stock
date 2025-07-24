export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:5000';

export async function fetchStockData() {
  const response = await fetch(`${API_BASE_URL}/api/stock`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchRestockTimes() {
  const response = await fetch(`${API_BASE_URL}/api/stock/restock-time`);
  if (!response.ok) {
    throw new Error(`Failed to fetch restock times: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchWeatherData() {
  const response = await fetch(`${API_BASE_URL}/api/weather`);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchApiStatus() {
  const response = await fetch(`${API_BASE_URL}/api/status`);
  if (!response.ok) {
    throw new Error(`Failed to fetch API status: ${response.statusText}`);
  }
  return response.json();
}
