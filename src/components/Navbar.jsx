import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center bg-violet-950 text-[#4F4D46] py-4'>
        <img src="/iTask.svg" alt="iTask logo" width={175} height={70}/>
        {/* <span className='logo font-bold text-2xl mx-9 font-poppins hover:font-extrabold transition-all'>iTask</span> */}
        <ul className='list-none mx-9 flex gap-9'>
            <li className='cursor-pointer hover:font-bold transition-all font-poppins text-white'>Home</li>
            <li className='cursor-pointer hover:font-bold transition-all font-poppins text-white'>Tasks</li>
        </ul>
    </nav>
  )
}

export default Navbar
