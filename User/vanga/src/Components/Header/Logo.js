import React from 'react';
import LogoImg from '../../Assets/logo.png';


const Logo = ({onLogoClick}) => {
    return <img className="logo" src={LogoImg} onClick={onLogoClick}></img>
}

export default Logo;