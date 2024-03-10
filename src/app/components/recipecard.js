import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function RecipeCard({name , image , link , time , missingIngredients, id }) {

    const router = useRouter()

    const toSlug = () => {
        console.log(id)
        router.push(`/${name}/${id}`)
      }

    const handleMissingIngredients = () => {
        if(missingIngredients == 0){
            return 'you have all the ingredients'
        }else{
            return `you need ${missingIngredients} more ingredients`
        }
    }
    const handleTime = () => {
        const numTime = Number(time);
    
        if (isNaN(numTime)) {
            console.error('Time is not a valid number:', time);
            return 'Invalid time';
        }
    
        if (numTime < 10) {
            return '< 10 mins';
        } else if (numTime >= 10 && numTime < 60) {
            return `${numTime} minutes`;
        } else {
            const hours = Math.floor(numTime / 60);
            const minutes = numTime % 60;
            
            return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
        }
    }
  return (
    <div onClick={toSlug} className=' h-[800px] w-[800px] grid grid-rows-2'>
        <div className='row-span-1 h-full w-full relative'>
           
            <Image priority fill style={{cursor: 'pointer'}} alt={name} src={image} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  />
        </div>
        <div className='flex row-span-1 h-full flex-col'>
            <h1 className=''>{name}</h1>
            <a href={link}>Recipe.com</a>
            <div>{handleMissingIngredients()}</div>
            <div>{handleTime()}</div>
            
        </div>
    </div>
  )
}
