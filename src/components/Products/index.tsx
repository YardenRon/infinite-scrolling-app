import { useEffect, useState } from "react";
import Product from "../../models/product";
import './styles.scss';

const PRODUCTS_URL = "https://dummyjson.com/products";
const PRODUCTS_LIMIT = 100;

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [reachedLimit, setReachedLimit] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${PRODUCTS_URL}?limit=20&skip=${count*20}`);
                const result = await response.json();

                if (result && result.products && result.products.length) {
                    setProducts(prevProducts => [...prevProducts, ...result.products]);
                    setIsLoading(false);
                }
            } catch (error: any) {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [count]);

    useEffect(() => {
        if (products && products.length === PRODUCTS_LIMIT) {
            setReachedLimit(true);
        }
    }, [products]);

    const onLoadMoreClick = () => setCount(count+1);

    if (isLoading) {
        return <div> Loading products. Please wait...</div>
    }

    return (
        <div className="container">
            <div className="products-container">
                {
                    products && products.length ? (
                        products.map(p => (
                            <div className="product" key={p.id}>
                                <img alt={p.title} src={p.thumbnail} />
                                <p>{p.title}</p>
                            </div>
                        ))
                    ) : null
                }
            </div>
            <div className="button-container">
                <button onClick={onLoadMoreClick} disabled={reachedLimit}>Load More Products</button>
                {
                    reachedLimit && <p> You have reached {PRODUCTS_LIMIT} products </p>
                }
            </div>
        </div>
    );
};

export default Products;