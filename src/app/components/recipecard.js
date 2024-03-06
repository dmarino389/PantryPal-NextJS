import Image from 'next/image'
import React from 'react'

export default function RecipeCard({name , image , link , time , missingIngredients }) {

    const handleMissingIngredients = () => {
        if(missingIngredients == 0){
            return 'you have all the ingredients'
        }else{
            return `you need ${missingIngredients} more ingredients`
        }
    }
    const handleTime = () => {
        if(time <= 10){
            return 'less than 10 mins'
        }else{
            return `${time} minutes`
        }
    }

  return (
    <div className=' h-[800px] w-[800px] grid grid-rows-2'>
        <Image src={image} width={100} height={100} className='flex row-span-1 h-1/2'/>
        <div className='flex row-span-1 h-full flex-col'>
            <h1>{name}</h1>
            <a href={link}>{link}</a>
            <div>{handleMissingIngredients()}</div>
            <div>{handleTime()}</div>
            
        </div>
    </div>
  )
}
