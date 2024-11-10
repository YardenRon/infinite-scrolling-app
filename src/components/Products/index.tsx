import { useCallback, useEffect, useRef, useState } from "react";
import Product from "../../models/product";
import './styles.scss';

const PRODUCTS_URL = "https://dummyjson.com/products";
const PRODUCTS_LIMIT = 100;

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [reachedLimit, setReachedLimit] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${PRODUCTS_URL}?limit=20&skip=${count * 20}`);
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

    const lastPostElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setCount(count + 1);
                }
            });

            if (node) observer.current.observe(node);
        }, [isLoading]);

    return (
        <div className="container">
            <div className="products-container">
                {
                    products && products.length ? (
                        products.map((p, index) => (
                            <div className="product" key={p.id} ref={products.length === index + 1 ? lastPostElementRef : null}>
                                <img alt={p.title} src={p.thumbnail} />
                                <p>{p.title}</p>
                            </div>
                        ))
                    ) : null
                }
            </div>
            <div className="button-container">
                {
                    reachedLimit && <p> You have reached {PRODUCTS_LIMIT} products </p>
                }
            </div>
        </div>
    );
};

export default Products;