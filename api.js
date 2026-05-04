export const fetchToyotaModels = async () => {
  const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/toyota?format=json');
  
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle models from NHTSA');
  }
  
  const data = await response.json();
  return data.Results.slice(0, 50);
};

export const loginToGarage = async (username, password) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      action: 'secure_login'
    }),
  });

  if (!response.ok) {
    throw new Error('Authentication server error');
  }

  const data = await response.json();
  return data;
};