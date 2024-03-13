'use client';
import React, { useEffect, useState } from 'react';
import IngredientCard from '../components/ingredientcard';
import RecipeCard from '../components/recipecard';

export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY;
  
  const [data, setData] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(200);

  const ingredientsListToString = (ingredientsList) => {
    return ingredientsList.join(', ');
  };

  useEffect(() => {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${ingredientsListToString(ingredientsList)}&addRecipeInformation=true&number=50&fillIngredients=true&maxReadyTime=${selectedTime}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      const recipeArray = data.results.map(result => ({
        id: result.id,
        title: result.title,
        link: result.sourceUrl,
        image: result.image,
        time: result.readyInMinutes,
        missingIngredients: result.missedIngredientCount
      }));
      
      setData(recipeArray);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });

  }, [ingredientsList, apiKey, selectedTime]);

  
    

   

  
    
 

  const handleIngredientsListUpdate = (newList) => {
    setIngredientsList(newList);
  };

  const handleTimeFilter = (time) => {
    setSelectedTime(prevTime => prevTime === time ? '' : time);
  };

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
              onClick={() => handleTimeFilter(time)}
            >
              {time === 9 && '< 10 Minutes'}
              {time === 29 && '< 30 Minutes'}
              {time === 59 && '< 1 hour'}
            </button>
          ))}
        </div>
        {/* IngredientCard */}
        <IngredientCard ingredient={ingredient} updateIngredientsList={handleIngredientsListUpdate} />
      </div>
      {/* RecipeCard Grid */}
      <div className='flex flex-wrap m-4 sm:m-8 lg:m-12 xl:m-16'>
        {data.map((recipe) => (
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
