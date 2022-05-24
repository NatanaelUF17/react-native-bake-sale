const API_URL = 'https://bakesaleforgood.com';

export const getDeals = async () => {
  try {
    const response = await fetch(`${API_URL}/api/deals`);
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getDeal = async id => {
  try {
    const response = await fetch(`${API_URL}/api/deals/${id}`);
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const searchDealsResults = async searchTerm => {
  try {
    const response = await fetch(
      `${API_URL}/api/deals?searchTerm=${searchTerm}`,
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
