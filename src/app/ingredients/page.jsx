'use client'
import React, { useEffect, useState } from 'react'
import IngredientCard from '../components/ingredientcard'
import RecipeCard from '../components/recipecard'

export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY
  const [data, setData] = useState([])
  const [ingredient, setIngredient] = useState([])
  const [ingredientsList, setIngredientsList] = useState([])

  const ingredientsListToString = (ingredientsList) => {
    return ingredientsList.join(', ');
  }

  useEffect(() => {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientsListToString(ingredientsList)}&addRecipeInformation=true&number=50&fillIngredients=true`, {
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
      setData(recipeArray)
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, [ingredientsList]); 


  const handleIngredientsListUpdate = (newList) => {
    setIngredientsList(newList);
  };

  return (
    <div className='h-screen w-full bg-gray-100'>
      <h1 className="text-4xl font-bold mb-4 text-center pt-10">Suggested Recipes</h1>
      <div className="search-container mx-auto max-w-3xl p-5">
        <div className="search-box flex items-center border-2 rounded-lg border-gray-500 pl-16 mb-8 bg-white">
          <input
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIngredientsList(prevIngredients => [...prevIngredients, ingredient]);
              }
            }}
            className='flex-1 py-7 px-4 md:h-[75px] rounded-md border-none bg-transparent placeholder-gray-500 focus:outline-none'
            type='text'
            name='ingredient' 
            placeholder='Search for ingredients'
            required
          />
        </div>
        <ul className="ingredient-list flex space-x-2">
          {ingredientsList.map((ingredient, index) => (
            <li key={index}>
              <div className="circle h-4 w-4 rounded-full bg-gray-400">{ingredient}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <IngredientCard ingredient={ingredient} updateIngredientsList={handleIngredientsListUpdate} />
        </div>
      </div>

      <div className='flex flex-wrap m-4 sm:m-8 lg:m-12 xl:m-16'>
        {data.map((recipe) => (
          <div
            key={recipe.title}
            className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 sm:p-4 hover:shadow-lg transition duration-300 rounded-md' // Add rounded-md class for rounded corners
            style={{ marginBottom: '20px' }} // Add margin bottom for spacing
          >
            <RecipeCard name={recipe.title}  image={recipe.image}  link={recipe.link}  time={recipe.time}  missingIngredients={recipe.missingIngredients} id={recipe.id} />
          </div>
        ))}
      </div>
    </div>
  );
        }