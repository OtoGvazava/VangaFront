import React, {useState} from "react";
import LanguageImg from '../../Assets/language.svg';
import "./Menu.css";

const Menu = ({changeLang}) => {
    const [popup, setPopup] = useState(false);

    const popupVisible = () => {
        if (popup == true) {
            setPopup(false);
        } else {
            setPopup(true);
        }
    }

    const changeLangAndPopup = (lang) => {
        changeLang(lang);
        popupVisible();
    }

    return (
        <div className="menu">
            <div className="menuButton">
                <img className="menuImg" onClick={popupVisible} src={LanguageImg}></img>
            </div>
            {popup && (
                <div className="modal">
                <div onClick={popupVisible} className="overlay"></div>
                <div className="modal-content">
                    <div className="languageMenu">
                        <ul>
                            <li onClick={() => changeLangAndPopup("ka")}>ქართული</li>
                            <li onClick={() => changeLangAndPopup("ma")}>მეგრული</li>
                        </ul>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}


export default Menu;