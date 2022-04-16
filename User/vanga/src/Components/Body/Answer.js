import React, { useEffect, useState } from 'react'

const Answer = ({playerName, profileImage}) => {

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
    
    useEffect(() => {
        var canvas = document.getElementById("answerCanvas");
        var ctx = canvas.getContext("2d");
        //var drawFunction = stringToObject(jsonString).drawFunction;
        //drawFunction(ctx, profileImage, playerName);
    })

    return (<div>
        <canvas 
            id='answerCanvas' 
            width = "100%" >
        </canvas>
    </div>)
}

export default Answer;