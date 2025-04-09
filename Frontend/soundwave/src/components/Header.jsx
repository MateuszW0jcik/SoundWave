import React from 'react';

const Header = () => {
    return (
        <header className="flex justify-between items-center p-5 bg-[#f8f8f8] border-b-2 border-[#333] relative">
            <div className="flex items-center select-none">
                <a href="/SoundWave">
                    <img src="src/assets/logo.png" alt="SoundWave Logo" width="70" height="70"/>
                </a>
            </div>

            <button
                className="flex md:hidden flex-col justify-between w-[30px] h-[21px] bg-transparent border-none cursor-pointer p-0 z-10"
                aria-label="Toggle menu">
                <span className="w-full h-[3px] bg-[#333] transition duration-300"></span>
                <span className="w-full h-[3px] bg-[#333] transition duration-300"></span>
                <span className="w-full h-[3px] bg-[#333] transition duration-300"></span>
                <span className="w-full h-[3px] bg-[#333] transition duration-300"></span>
            </button>

            <nav
                className="flex gap-[20px] z-10 max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:bg-[#f8f8f8] max-md:flex-col max-md:p-[20px] max-md:gap-[15px] max-md:translate-y-[-100%] max-md:opacity-0 max-md:invisible max-md:transition-all max-md:duration-[300]">
                <a className="no-underline text-[#333] font-medium transition-colors duration-300"
                   href="/SoundWave">Home</a>
                <a className="no-underline text-[#333] font-medium transition-colors duration-300"
                   href="/SoundWave/products?page=1">Products</a>
                <a className="no-underline text-[#333] font-medium transition-colors duration-300"
                   href="/SoundWave/contact">Contact Us</a>
                <div className="flex items-center gap-1">
                    <img className="select-none" src="src/assets/icons/call-icon.png" alt="Call icon" width="20"
                         height="20"/>
                    <span>34 377 00 00</span>
                </div>
            </nav>

            <div className="flex gap-1 items-center">
                <button aria-label="Search" className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none" id="searchButton">
                    <img src="/src/assets/icons/search-icon.png" alt="Search icon" width="20" height="20"/>
                </button>
                <button aria-label="Shopping cart" className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none" id="shoppingCartButton">
                    <img src="/src/assets/icons/cart-icon.png" alt="Cart icon" width="20" height="20"/>

                    <span className="absolute top-[-5px] right-[-10px] bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">0</span>
                </button>
                <button aria-label="User account" className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none" id="userButton">
                    <img src="/src/assets/icons/user-icon.png" alt="User icon" width="20" height="20"/>
                </button>
            </div>
        </header>
    )
}

export default Header;