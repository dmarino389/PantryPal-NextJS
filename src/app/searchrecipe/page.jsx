'use client'
import { useState, useEffect } from 'react'
import RecipeCard from '../components/recipecard'


export default function page() {
    const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY
    const [recipe, setRecipe] = useState([])
    const [recipeArray, setRecipeArray]= useState([])

    useEffect(() => {
        
            fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${recipe}&addRecipeInformation=true&number=50&fillIngredients=true`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey 
                }
            })
            .then(response => response.json())
            .then(data => {
                const recipes = data.results.map(result => ({
                    id: result.id,
                    title: result.title,
                    link: result.sourceUrl,
                    image: result.image,
                    time: result.readyInMinutes,
                    missingIngredients: result.missedIngredientCount
                  }))
                  setRecipeArray(recipes)               
                })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
        
    }, [recipe]);

  
    return (
        <div className='h-screen w-full bg-gray-100'>
          <div className="search-container mx-auto max-w-3xl p-4">
            <div className="search-box flex items-center border-2 rounded-md border-gray-400 mb-8 bg-white">
              <input
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                className='flex-1 py-2 px-4 md:h-[75px] rounded-md border-none bg-transparent placeholder-gray-400 focus:outline-none'
                type='text'
                name='recipe' 
                placeholder='Search for recipes'
                required
              />
            </div>            
          </div>
    
          <div className='flex flex-wrap m-4 sm:m-8 lg:m-12 xl:m-16'>
            {recipeArray.map((recipe) => (
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
