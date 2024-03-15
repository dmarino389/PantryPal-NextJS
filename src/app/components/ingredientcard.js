import React, { useEffect, useState } from 'react';
import './IngredientCard.css';

export default function IngredientCard({ ingredientList , updateIngredientsList }) {
    
    const handleIngredientClick = (ingredient) => {
        updateIngredientsList(ingredient);
      }
  
    // const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY
    // const [data, setData] = useState([]);
    // const [userIngredients, setUserIngredients] = useState([]);

    // const handleUserIngredientUpdate = (ingredientName) => {
    //     setUserIngredients(currentIngredients => [...currentIngredients, ingredientName]);
    // };

    // useEffect(() => {
    //     updateIngredientsList(userIngredients);
    // }, [userIngredients, updateIngredientsList]);

    // // useEffect(() => {
    // //     fetch(`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}`, {
    // //         method: 'GET',
    // //         headers: {
    // //             'x-api-key': apiKey 
    // //         }
    // //     })
    // //     .then(response => response.json())
    // //     .then(data => {
    // //         const ingredientsArray = data.results.map(result => result.name);
    // //         setData(ingredientsArray);            
    // //     })
    // //     .catch(error => {
    // //         console.error('Error fetching data: ', error);
    // //     });
    // // }, [ingredient, apiKey]); 

    return (
        <div className="ingredient-card border p-4 rounded-lg flex flex-row flex-wrap gap-4">
            {ingredientList.map((name) => (
                <div key={name.id} className="ingredient-name w-1/5 flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => handleIngredientClick(name)}>
                    <span>{name.name}</span>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
            ))}
        </div>
    );
}