import {HiMenuAlt4} from 'react-icons/hi';
import {AiOutlineClose} from 'react-icons/ai';
import { useState } from 'react';
import logo from '../../images/logo.png';

const NavbarItem = ({title, classProps}) => {
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      {title}
    </li>
  )
}
const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);


  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center ">
        <img src={logo} alt='logo' className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index)=>(
          <NavbarItem key={item + index} title={item} />
        ))}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] ">
          Login
        </li>
      </ul>
      <div className="flex relative ">
        {toggleMenu
          ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu( false )} />
          : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu( true )} />
        }
      
        {toggleMenu && (
          <ul className="z-10 text-white fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
              flex flex-col justify-start items-end rounded-md blue-glassmorphism animate-slide-in 
          ">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={()=> setToggleMenu(false)}/>
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index)=>(
          <NavbarItem key={item + index} title={item} classProps="my-2 text-lg" />
             ))}
          </ul>
        )

        }
      </div>
    </nav>
  )
}

export default Navbar;




// Deploying 'Transactions'
//    ------------------------
//    > transaction hash:    0x965e5fc038afe76dca674a8be7b9c070a2a49f24a913ce474e492d96a91078b3
//    > Blocks: 2            Seconds: 17
//    > contract address:    0x3727069135D1E44117aDdD4DAAA4c84517C29441
//    > block number:        6013891
//    > block timestamp:     1717177368
//    > account:             0x9F7f3fe3d1A27f4FD35b3a07fc8f3D7588a99F57
//    > balance:             0.101434393001243395
//    > gas used:            599617 (0x92641)
//    > gas price:           6.194244034 gwei
//    > value sent:          0 ETH
//    > total cost:          0.003714174024934978 ETH
