'use client';
import React, { useEffect, useState } from 'react';
import IngredientCard from '../components/ingredientcard';
import RecipeCard from '../components/recipecard';
import {aisleDict} from '../components/aisleDict'

export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY;
  const [openDropdown, setOpenDropdown] = useState(null);
  const [recipesDetails, setRecipesDetails] = useState([]); // Stores ID and missedIngredientsCount
  const [recipeArray, setRecipeArray] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(200);

  const ingredientsListToString = (ingredientsList) => {
    return ingredientsList.join(', ');
  };

  useEffect(() => {
    if (ingredientsList.length > 0) {
      fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsListToString(ingredientsList)}&apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const tempRecipesDetails = data.map(item => ({
          id: item.id,
          missedIngredientsCount: item.missedIngredientCount
        }));
        setRecipesDetails(tempRecipesDetails);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
    }
  }, [ingredientsList, apiKey]);

  useEffect(() => {
    if (recipesDetails.length > 0) {
      const ids = recipesDetails.map(detail => detail.id).join(',');
      fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const tempRecipeArray = data.map(item => {
          const details = recipesDetails.find(detail => detail.id === item.id) || {};
          return {
            id: item.id,
            title: item.title,
            link: item.sourceUrl,
            image: item.image,
            time: item.readyInMinutes,
            missingIngredients: details.missedIngredientsCount
          };
        });
        setRecipeArray(tempRecipeArray);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
    }
  }, [recipesDetails, apiKey]);

  const handleIngredientsListUpdate = (newList) => {
    setIngredientsList(newList);
  };

  const handleTimeFilter = (time) => {
    setSelectedTime(time);
  };

  const filteredRecipes = selectedTime ? recipeArray.filter(recipe => recipe.time <= selectedTime) : recipeArray;



  return (
    <div className='h-screen w-full'>
      <h1 className="text-4xl font-bold mb-4 text-center pt-10">Suggested Recipes</h1>
      <div className="search-container mx-auto max-w-3xl p-5">
        <div className="search-box flex items-center border-2 rounded-lg border-gray-500 mb-8 bg-white">
          <input
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIngredientsList(prevIngredients => [...prevIngredients, ingredient]);
                setIngredient('');
              }
            }}
            className='flex-1 py-2 px-4 rounded-lg bg-transparent placeholder-gray-500 focus:outline-none'
            type='text'
            name='ingredient' 
            placeholder='Search for ingredients'
            required
          />
        </div>
        {/* Time Filter Buttons */}
        <div className="time-filters mx-auto max-w-3xl p-5 flex justify-around mb-4">
          {[9, 29, 59].map((time) => (
            <button
              key={time}
              className={`py-2 px-4 rounded-lg ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              // onClick={() => handleTimeFilter(time)}
            >
              {time === 9 && '< 10 Minutes'}
              {time === 29 && '< 30 Minutes'}
              {time === 59 && '< 1 hour'}
            </button>
          ))}
        </div>
        {/* IngredientCard
        <IngredientCard ingredient={ingredient} updateIngredientsList={handleIngredientsListUpdate} /> */}
      </div>
      {/* Drop Down Menus */}
      {Object.keys(aisleDict).map((aisle) => (
  <div key={aisle} className="mb-4">
    <button
      className="py-2 px-4 w-full text-left rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      type="button"
      onClick={() => setOpenDropdown(openDropdown === aisle ? null : aisle)}
    >
      {aisle}
    </button>
    {openDropdown === aisle && (
      <div className="mt-2 space-y-2">
        
        <IngredientCard key={aisle} ingredientList={aisleDict[aisle]} updateIngredientsList={handleIngredientsListUpdate} />
        
      </div>
    )}
  </div>
))}
      {/* RecipeCard Grid */}
      <div className='flex flex-wrap m-4 sm:m-8 lg:m-12 xl:m-16'>
        {recipeArray.map((recipe) => (
          <div
            key={recipe.id}
            className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 sm:p-4'
          >
            <RecipeCard
              name={recipe.title}
              image={recipe.image}
              link={recipe.link}
              time={recipe.time}
              missingIngredients={recipe.missingIngredients}
              id={recipe.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
