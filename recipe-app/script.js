// USAGE : themealDB cdnjs api  from github

const mealsEl = document.getElementById('meals');
const favMeals = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  //fetch from url
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  console.log(randomMeal);

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

  const respData = await resp.json();
  const meal = respData.meals;

  console.log(meals);

  return meal;
}

function addMeal(mealData, random = false) {

  console.log(mealData);

  const meal = document.createElement('div');
  meal.classList.add('meal');

  meal.innerHTML = `
    <div class="meal-header">
      ${random ? `
      <span class="random"> Random Recipe </span>` : ''}

      <img 
        src = "${mealData.strMealThumb}"
        alt = "${mealData.strMeal}"
        />
    </div>    
    <div class="meal-body">
      <h4> ${mealData.strMeal} </h4>
      <button class="fav-btn">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    `;

  //add event listen on added fav btn
  const favBtn = meal.querySelector(".meal-body .fav-btn");
  favBtn.addEventListener("click", () => {
    // if active remove else add
    if (favBtn.classList.contains('active')) {
      removeMealLS(mealData.idMeal);
      favBtn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      favBtn.classList.add("active");
    }

    fetchFavMeals();
  });

  mealsEl.appendChild(meal);
}

function addMealLS(mealId) {

  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  //if null
  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  // clean the favorite meal container
  favMeals.innerHTML = "";

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    // meals.push(meal);

    addMealFav(meal);
  }
}

function addMealFav(mealData) {

  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
    <img 
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"/>
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
  `;

  const btn = favMeal.querySelector('.clear');
  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeals();
  });

  favMeals.appendChild(favMeal);
}

searchBtn.addEventListener('click', async () => {
  // clean container
  mealsEl.innerHTML = "";

  const searchTxt = searchTerm.value;
  const meals = await getMealsBySearch(searchTxt);

  // check if meal exists
  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});


popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add("hidden");
  console.log('hide');
});