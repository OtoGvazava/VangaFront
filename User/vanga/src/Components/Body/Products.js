import React from "react";
import axios from 'axios';
import Product from './Product';
import { useEffect, useState } from "react";

const Products = ({onProductClick}) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [endScroll, setEndScroll] = useState(false);

    const baseURL = "http://127.0.0.1:8000";
    
    useEffect(() => {
        axios.get(baseURL + "/api/products?format=json&page=" + page) 
            .then(response => {
                var newData = response.data;
                if(newData.length) {
                    setData(data.concat(newData))
                } else {
                    setEndScroll(true);
                }; 
        })
    }, [page])

    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === 
            document.documentElement.offsetHeight) {
                if (!endScroll) setPage(page + 1);
        }
    }

    return (
        <div>
            {data.map(element => <Product id={element.id} imgSrc={baseURL + element.header_image} title={element.title} onProductClick={onProductClick}/>)}
        </div>
    )
}

export default Products;