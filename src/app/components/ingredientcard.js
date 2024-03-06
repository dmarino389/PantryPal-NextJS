import React, { useEffect, useState } from 'react';

export default function IngredientCard({ ingredient, updateIngredientsList }) {
    const [data, setData] = useState([]);
    const [userIngredients, setUserIngredients] = useState([]);

    const handleUserIngredientUpdate = (ingredientName) => {
        setUserIngredients(currentIngredients => [...currentIngredients, ingredientName]);
    };

    useEffect(() => {
        updateIngredientsList(userIngredients);
    }, [userIngredients]);

    useEffect(() => {
        fetch(`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}`, {
            method: 'GET',
            headers: {
                'x-api-key': '30e837b638ae4d4ea465cd42c060e2ef' 
            }
        })
        .then(response => response.json())
        .then(data => {
            const ingredientsArray = data.results.map(result => result.name);
            setData(ingredientsArray);            
            
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
    }, [ingredient]); 

    return (
        <div>{data.map((name) =>
            <p key={name} style={{ cursor: 'pointer' }} onClick={() => handleUserIngredientUpdate(name)}>{name}</p>
        )}</div>
    );
}