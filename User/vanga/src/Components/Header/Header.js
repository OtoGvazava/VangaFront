import React from 'react';
import Logo from './Logo';
import Menu from './Menu';


const Header = ({changeLang, onLogoClick}) => {
    return (
        <div className="header">
            <Menu changeLang={changeLang}/>
            <Logo onLogoClick={onLogoClick}/>
        </div>
    );
}

export default Header;