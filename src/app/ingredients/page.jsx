'use client';
import React, { useEffect, useState } from 'react';
import IngredientCard from '../components/ingredientcard';

import {aisleDict} from '../components/aisleDict'

export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_SECRET_API_KEY;
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const [recipeArray, setRecipeArray] = useState([]);
  const [pantryItems, setPantryItems] = useState([])
  const [ingredient, setIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(200);
  ;

  function getUserToken() {      
    if (typeof window !== 'undefined') {
      return localStorage.getItem('usertoken') || '';
    }
    return ''
  }
  useEffect(() => {
    const fetchPantryItems = async () => {
      const userToken = getUserToken();
      if (!userToken) {
        console.log("No user token found");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/get_user_pantry_items', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pantry items');
        }

        const data = await response.json();
        setPantryItems(data);
      } catch (error) {
        console.error("Error fetching pantry items:", error.message);
      }
    };

    fetchPantryItems();
    
  }, [])

  useEffect(()=>{
    if(userToken){
      console.log(pantryItems)
    }
    
  },[pantryItems, userToken])
  
  
  const handleIngredientsListUpdate = async (ingredient) => {
    let currentList = JSON.parse(sessionStorage.getItem('ingredientsList')) || []

    const index = currentList.findIndex(item => item.name === ingredient.name);

    if (index === -1) {
      currentList.push(ingredient);
    } else {
      currentList.splice(index, 1); // Remove the ingredient if it's already in the list
    }
  
    const userToken = getUserToken(); // Retrieve user token
  
    if (userToken) {
      const response = await fetch('http://127.0.0.1:5000/handle_user_ingredient_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usertoken: userToken, 
          name: ingredient.name,
          id: ingredient.id,
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to update ingredients in the database');
        return;
      }
    } else {
      sessionStorage.setItem('ingredientsList', JSON.stringify(currentList));
      setIngredientsList(currentList);
    }
  }

  const userToken = getUserToken();
  if (!userToken) {
      console.log("No user token found");
      return;
  }

  

  

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
      
  </div>
  );
}
