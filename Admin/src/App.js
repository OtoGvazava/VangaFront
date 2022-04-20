import './App.css';
import React, {useCallback, useEffect, useState} from 'react'

const App = () => {
  const [variants, setVariants] = useState([]);
  const [texts, setTexts] = useState([{ka: "", ma: ""}]);
  const [images, setImages] = useState([""]);
  const [title, setTitle] = useState({ka: "", ma: ""});
  const [mainImage, setMainImage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [gender, setGender] = useState("Neutral");
  const [variantForCanvas, setVariantForCanvas] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const startDrawFunction = {
    drawFunction: function (ctx, profileImage, playerName, title, variant) 
      {
        try {
          function draw(ctx, image, x, y, w=300, h=450) {
            if (!image.complete){
                setTimeout(function () {
                    draw(ctx, image, x, y, w, h);
                }, 50);
                return;
            }
            ctx.drawImage(image, x, y, w, h)
          }
          ctx.fillText("Canvas here. write code and compile!", 220, 450);
        } catch (e) {
          alert(e);
        }
      }
  }

  var [drawFunction, setDrawFunction] = useState(startDrawFunction);

  const objectToJSONString = (drawFunction) => {
    return JSON.stringify(drawFunction, function(key, value) {
        if (typeof value === "function") {
            return "/Function(" + value.toString() + ")/";
        }
        return value;
    });
  }

  const stringToObject = (jsonString) => {
    var object = JSON.parse(jsonString, function(key, value) {
        if (typeof value === "string" &&
            value.startsWith("/Function(") &&
            value.endsWith(")/")) {
          value = value.substring(10, value.length - 2);
          return (0, eval)("(" + value + ")");
        }
        return value;
    });
    return object;
  }

  const changeCode = () => {
    var textArea = document.getElementById("codeText").value;
    textArea = JSON.stringify(textArea);
    textArea = textArea.substring(1, textArea.length-1  );
    var codeString = objectToJSONString(startDrawFunction);
    codeString = codeString.replace('ctx.fillText(\\"Canvas here. write code and compile!\\", 220, 450);', textArea);
    
    drawFunction = stringToObject(codeString);
    setDrawFunction(drawFunction);
  }

  const textOnChange = (e, index, lang) => {
    const {value} = e.target;
    const list = [...texts];
    if (lang == 'ka') {
      list[index] = {ka: value, ma: texts[index].ma};
      setTexts(list);
    }

    if (lang == 'ma') {
      list[index] = {ka: texts[index].ka, ma: value};
      setTexts(list);
    }
  }

  const textRemove = (index) => {
    const list = [...texts];
    list.splice(index, 1);
    setTexts(list);
  }

  const addTextInput = () => {
    setTexts([...texts, ""]);
  }

  const imageOnChange = (e, index) => {
    const image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const list = [...images];
      list[index] = reader.result;
      setImages(list);
      console.log(list)
    }
  }

  const mainImageOnChange = (e) => {
    const image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setMainImage(reader.result);
    }
  }

  const imageRemove = (index) => {
    const list = [...images];
    list.splice(index, 1);
    setImages(list);
  }

  const addImageInput = () => {
    setImages([...images, ""]);
  }

  const addNewVariant = () => {
    let add = true;
    texts.map((item) => {
      if (item.length < 1) add = false;
    })
    images.map((item) => {
      if (item.length < 1) add = false;
    })
    if (add) {
      setVariants([...variants, {texts: texts, images: images, gender: gender}]);
      setTexts([""]);
      setImages([""]);
      setGender("Neutral");
    } else {
      alert("Input all fields");
    }
  }

  const removeVariant = (index) => {
    const list = [...variants];
    list.splice(index, 1);
    setVariants(list);
  }

  const onGenderChange = (e) => {
    setGender(e.target.value);
  }

  const getNextVariantFromVariants = () => {
    let variant = variantForCanvas + 1;
    if (variantForCanvas > variants.length-2) {
      variant = 0;
    }
    setVariantForCanvas(variant);
  }

  const compileNextVariant = () => {
    getNextVariantFromVariants();
    changeCode();
  }

  const sendGame = async () => {
    if (!isSending && mainImage.length > 0 && variants.length > 0 && title.ka.length > 0 && title.ma.length > 0) {

      setIsSending(true);

      let jsonData = {
        "title": JSON.stringify(title),
        "mainImage": mainImage,
        "variantsString": JSON.stringify(variants),
        "drawFunction": objectToJSONString(drawFunction),
        "publish_datetime": new Date()
      };

      await fetch('http://127.0.0.1:8000/api/createGame/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData) // body data type must match "Content-Type" header
      });

      setIsSending(false);

      alert("თამაში წარმატებით აიტვირთა!");
    } else {
      alert("გთხოვთ შეავსოთ სავალდებულო ველები!");
    }
  }

  useEffect(() => {
    var canvas = document.getElementById("answerCanvas");
    canvas.height = "900";
    canvas.width = "600";
    var ctx = canvas.getContext("2d");
    drawFunction.drawFunction(ctx, profileImage, playerName, title, variants[variantForCanvas]);
  }, [drawFunction]);

  return (
    <div>
      <div className='canvasDiv'>
        <canvas id='answerCanvas'></canvas>
      </div>
      <div className='writeCodeDiv'>
        <textarea id='codeText'> ctx.fillText("Canvas here. write code and compile!", 220, 450); </textarea>
        <button onClick={changeCode} className='compileButton'>Compile</button>
        <button onClick={compileNextVariant} className='compileButton'>Compile With next variant</button>
      </div>
      <div className='gameDetailDiv'>
        <div className='mainDetail'>
          <input placeholder='Input game title ka' id='titleInputKa' value={title.ka} onChange={(e) => setTitle({ka: e.target.value, ma: title.ma})}></input>
          <input placeholder='Input game title ma' id='titleInputEn' value={title.ma} onChange={(e) => setTitle({ka: title.ka, ma: e.target.value})}></input>
          <input placeholder='Input player name' id='playerNameInput' value={playerName} onChange={(e) => setPlayerName(e.target.value)}></input>
          <p>Upload main Image:</p>
          <input files={[mainImage]} placeholder='Upload main photo' id='mainImage' type="file" name="img" accept="image/*" onChange={(e) => mainImageOnChange(e)}></input>
          <p>Upload profile image:</p>
          <input placeholder='Upload profile image' id='profileImage' type="file" name="img" accept="image/*" onChange={(e) => setProfileImage(URL.createObjectURL(e.target.files[0]))}></input>
        </div>
        <div className='gameVariantsDiv'>
            <h2>Variants:</h2>
            {variants.map((variant, index) => (
              <div>
                <h3>Variant {index}</h3>
                {variant.texts.map((text, index) => (
                  <div>
                    <h3>text {index}</h3>
                    <p>input ka</p>
                    <p>{text.ka}</p>
                    <p>input ma</p>
                    <p>{text.ma}</p>
                  </div>
                ))}
                {variant.images.map((image, index) => (
                  <div>
                    <h3>image {index}</h3>
                    <img className='variantsImg' src={image}></img>
                  </div>
                ))}
                <p>Gender: {variant.gender}</p>
                <button onClick={() => removeVariant(index)}>Remove Variant</button>
              </div>
            ))}
        </div>
        <div className='gameVariantAddDiv'>

          <h2>Add New Variant</h2>
          {texts.map((text, index) => (
            <div>
              <p>text {index}</p>
              <p>input ka</p>
              <input type="text" value={text.ka} onChange={(e) => textOnChange(e, index, "ka")} required></input>
              <p>input ma</p>
              <input type="text" value={text.ma} onChange={(e) => textOnChange(e, index, "ma")} required></input> 
              {texts.length > 1 && <button onClick={() => textRemove(index)}>Remove Text</button>}
            </div>))
          }
          <button onClick={() => addTextInput()}>Add Text Input</button>
          <br></br>
          {images.map((image, index) => (
            <div>
              <p>image {index}</p>
              <input files={[image]} type="file" name="img" accept="image/*" onChange={(e) => imageOnChange(e, index)}></input>
              {images.length > 1 && <button onClick={() => imageRemove(index)}>Remove Image</button>}
            </div>))
          }
          <button onClick={() => addImageInput()}>Add Image Input</button>
          <br></br>
          <input type="radio" id='radioMen' name='gender' value="Men" checked={gender === "Men"} onChange={(e) => onGenderChange(e)}/>
          <label for="radioMen">Men</label>
          <input type="radio" id='radioWomen' name='gender' value="Women" checked={gender === "Women"} onChange={(e) => onGenderChange(e)}/>
          <label for="radioWomen">women</label>
          <input type="radio" id='radioNeutral' name='gender' value="Neutral" checked={gender === "Neutral"} onChange={(e) => onGenderChange(e)}/>
          <label for="radioNeutral">Neutral</label>
          <button onClick={() => addNewVariant()}>Add New Variant</button>
        </div>
        <button onClick={() => sendGame()}>Send Game</button>
      </div>
    </div>
  )
}

export default App;
