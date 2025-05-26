const SpoonAcularAPI = {
  BASE_URL: 'https://api.spoonacular.com/',
  API_KEY: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || '32dc1053acf34369bd6757a2eb7d5d57',
  ENDPOINTS: {
    SEARCH_RECIPES: 'recipes/complexSearch',
    RECIPE_INFO: 'recipes/{id}/information',
    RANDOM_RECIPES: 'recipes/random'
  }
};

export default SpoonAcularAPI;
