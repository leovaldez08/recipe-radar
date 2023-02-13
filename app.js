// Creating necessary variables for the functions using Query Selector
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const randomMealSection = document.querySelector(".random-meal");
const searchedMealsSection = document.querySelector(".searched-meals");
const ingredientModal = document.querySelector(".ingredient-modal");
const searchResult = document.querySelector("#search-results");

// Function for creating a meal-div (template)
const createMealElement = (meal) => {
  const mealEl = document.createElement("div");
  mealEl.classList.add("meal");
  mealEl.innerHTML = `
    <img src="${meal.strMealThumb}" alt="meal-image"> 
    <h3>${meal.strMeal}</h3>
  `;
  // Setting up event listener for the modal
  mealEl.addEventListener("click", () => {
    showIngredientsModal(meal.idMeal);
  });
  return mealEl;
};

// Function for getting the ingredient list using the meal id through Fetch API
const showIngredientsModal = async (mealId) => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await response.json();
  const mealDetails = data.meals[0];
  const ingredients = Object.entries(mealDetails)
    .filter(([key, value]) => key.startsWith("strIngredient") && value)
    .map(([, value]) => `<li>${value}</li>`)
    .join("");

  // Appending the fetched ingredient list inside the ingredient modal section
  ingredientModal.innerHTML = `
    <h3>Ingredients</h3> 
    <ul> ${ingredients} </ul>
  `;
  ingredientModal.style.display = "block";
};

// Function to fetch a random meal and display it as the "Meal of the Day"
async function fetchRandomMeal() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  const meal = data.meals[0];
  randomMealSection.innerHTML = "";
  randomMealSection.appendChild(createMealElement(meal));
}

// Function to fetch meals by catergoies
async function fetchMealsByCategory(category) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await response.json();
  const meals = data.meals;
  searchedMealsSection.innerHTML = "";

  if (meals) {
    meals.forEach((meal) => {
      searchedMealsSection.appendChild(createMealElement(meal));
    });
  } else {
    console.log("No meals found for the specified category");
  }
}

// Setting Up all the Eventlisteners => (^_^) => {

// Onclick event for the Search Button to fetch meals by categories:
searchBtn.addEventListener("click", () => {
  const category = searchInput.value;
  searchResult.innerHTML = `Search Results for "${category}"`;
  fetchMealsByCategory(category);
});

// Using keyboard events to use the enter key for fetching meals by categories:
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const category = searchInput.value;
    searchResult.innerHTML = `Search Results for "${category}"`;
    fetchMealsByCategory(category);
  }
});

// onclick event for closing the Ingredient modal:
window.onclick = (e) => {
  if (e.target == ingredientModal || ingredientModal.contains(e.target)) {
    ingredientModal.style.display = "none";
  }
};
// }

// Calling the Function
fetchRandomMeal();
