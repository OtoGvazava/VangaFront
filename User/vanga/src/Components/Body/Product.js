import React from 'react';
import './Product.css';


const Product = ({id, imgSrc, title, onProductClick}) => {
    return (
        <div className="ProductList" onClick={() => {onProductClick(id)}}>
            <img className="ProductListImg" src={imgSrc}></img>
            <p className="ProductListText" >{title}</p>
        </div>
    )
}

export default Product;