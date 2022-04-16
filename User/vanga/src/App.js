import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Products from './Components/Body/Products';
import Play from './Components/Body/Play'
import { useState, useEffect } from "react";


const App = () => {
  const [lang, setLang] = useState("ka");
  const [productsList, setProductsList] = useState(true);
  const [gameId, setGameId] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [contextType, setContextType] = useState(null);

  const changeLang = (lang) => {
    setLang(lang);
  }

  const onProductClick = (gameId) => {
    setGameId(gameId);
    setProductsList(false);
  }

  const onLogoClick = () => {
    setProductsList(true);
    setGameId(false);
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.facebook.com/assets.php/en_US/fbinstant.latest.js";
    script.id = 'fbinstant';

    document.body.appendChild(script);

    script.onload = () => {
      window.FBInstant.initializeAsync().then(function() {
        window.FBInstant.startGameAsync().then(function() {
          setProfileImage(window.FBInstant.player.getPhoto());
          setPlayerName(window.FBInstant.player.getName());
          setPlayerId(window.FBInstant.player.getID());
          setContextType(window.FBInstant.context.getType());
        });
      });
    };
  })
  
  return (
    <div>
      <Header changeLang={changeLang} onLogoClick={onLogoClick}/>
      <h1> { lang == "ka" ? "ქართული" : lang == "ma" ? "მეგრული" : "pass" } </h1>
      { productsList && (<Products onProductClick={onProductClick}/>)}
      { gameId && <Play gameId={gameId} profileImage={profileImage} playerName={playerName} playerId={playerId} contextType={contextType}/> }
    </div>
  )
}

export default App;