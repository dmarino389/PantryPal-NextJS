'use client'
import React, { useState } from 'react'
import IngredientCard from '../components/ingredientcard'

export default function page() {

  const [ingredient, setIngredient] = useState('')
    
  
  return (
    <div>
      <input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className='border-2 md:h-[75px] rounded-md w-2/3 border-gray-400 mb-8 bg-white md:placeholder:text-[30px]'
          type='text'
          name='ingridient'
          placeholder='search for an ingredient'
          required
        />
      
        <IngredientCard ingredient={ingredient} key={1}/>
      
    </div>
  )
}
