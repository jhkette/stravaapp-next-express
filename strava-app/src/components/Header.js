import React from 'react'
import ReturnProfile from './UserProfile'

export default function Header({athlete, message}) {
 if(!!athlete.id ){
    <header className="pt-4 px-24 w-full flex justify-end ">
             {
               <div>
                 <ReturnProfile athlete={athlete} />{" "}
               </div>
             }
             {message && <h4>{message}</h4>}
           </header>

 }else{
    <header className="pt-4 px-24 w-full flex justify-end ">
    {
      <div>
      
      </div>
    }
    {message && <h4>{message}</h4>}
  </header>

 }
}
           
   