import React, { useState, useEffect } from 'react'

export default function IngredientCard({ingredient}) {
    
    const [data, setData] = useState([])
    const [userIngredients, setUserIngredients] = useState([])
    
    const handleUserIngredienteUpdate = (ingredientName) => {
        setUserIngredients(currentIngredients => [...currentIngredients, ingredientName]);
        
    };

    useEffect(()=>{
        console.log(userIngredients)
    },[userIngredients])

    useEffect(() => {
    fetch(`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}`, {
        method: 'GET',
        headers: {
            'x-api-key': '30e837b638ae4d4ea465cd42c060e2ef'
        }
        })
        .then(response => response.json())
        .then(data => {
            const ingredientsArray = []
            for(let i = 0; i < data.results.length; i++){
                
                ingredientsArray.push(data.results[i].name)
                
            }
        setData(ingredientsArray)    
        
        console.log(ingredientsArray);
        })
        .catch(error => {
        console.error('Error fetching data: ', error);
        })
    },[ingredient])
    
  return (
    <div>{data.map((name)=>
        <p key={name} style={{ cursor: 'pointer' }} onClick={() => handleUserIngredienteUpdate(name)}>{name}</p>
        )}</div>
  )
}
