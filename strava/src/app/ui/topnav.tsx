import Link from 'next/link'
import NavLinks from './nav-links';
import Header from "./header"

export default function SideNav() {
    return (
      <div className="flex flex-row justify-between items-center   bg-white px-3 py-4 md:px-2 w-full">
      
     
          <NavLinks />
          
          <Header/>
      
      </div>
    );
  }
  