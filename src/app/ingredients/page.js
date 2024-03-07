'use client'
import React, { useEffect, useState } from 'react'
import IngredientCard from '../components/ingredientcard'
import RecipeCard from '../components/recipecard'

export default function Page() {
  const [data, setData] = useState([])
  const [ingredient, setIngredient] = useState('')
  const [ingredientsList, setIngredientsList] = useState([])
  
  
  const ingredientsListToString = (ingredientsList) => {
    return ingredientsList.join(', ');
  }

    useEffect(() => {
      fetch(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientsListToString(ingredientsList)}&addRecipeInformation=true&number=50&fillIngredients=true`, {
          method: 'GET',
          headers: {
              'x-api-key': '018dc60b8bd24101aea56650763b5db6' 
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
  },[ingredientsList]); 

    useEffect(()=>{
      console.log(data)
    }, [ingredientsList])
    const handleIngredientsListUpdate = (newList) => {
        setIngredientsList(newList);
    };

    return (
        <div className='h-[100vh] w-full'>
            <input
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className='border-2 md:h-[75px] rounded-md w-2/3 border-gray-400 mb-8 bg-white md:placeholder:text-[30px]'
                type='text'
                name='ingredient' 
                placeholder='search for an ingredient'
                required
            />

          <div className=''>
            <IngredientCard ingredient={ingredient} updateIngredientsList={handleIngredientsListUpdate} key={1} />
            <div className='flex flex-wrap m-4 sm:m-8 lg:m-12 xl:m-16'>
            {data.map((recipe)=>
              <div
              key={recipe.title}
              className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 sm:p-4 hover:shadow-lg transition duration-300'
            >
              <RecipeCard name={recipe.title}  image={recipe.image}  link={recipe.link}  time={recipe.time}  missingIngredients={recipe.missingIngredients} id={recipe.id} />
              </div>
            )}
            </div>
          </div> 
        </div>
    );
}
