import Link from 'next/link'
import NavLinks from './nav-links';
import Header from "./header"

export default function SideNav() {
    return (
      <div className="flex flex-row justify-between items-center max-w-1200px mx-auto bg-white px-3 py-4 md:px-24 w-full">
      
     
          <NavLinks />
          
          <Header/>
      
      </div>
    );
  }
  