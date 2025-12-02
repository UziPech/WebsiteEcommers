import { useState } from 'react';

export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    tag?: string;
}

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Monstera Deliciosa',
        price: '$450 MXN',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        tag: 'Best Seller',
    },
    {
        id: 2,
        name: 'Palma Areca',
        price: '$800 MXN',
        image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        name: 'Maceta Negra',
        price: '$250 MXN',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        tag: 'Limited',
    },
    {
        id: 4,
        name: 'Sustrato Premium',
        price: '$120 MXN',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        name: 'Orquídea Real',
        price: '$650 MXN',
        image: 'https://images.unsplash.com/photo-1566958763363-2394fbd77180?auto=format&fit=crop&w=800&q=80',
        tag: 'Rare',
    },
    {
        id: 6,
        name: 'Cactus San Pedro',
        price: '$350 MXN',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
    },
];

export const useStore = () => {
    const [products] = useState<Product[]>(INITIAL_PRODUCTS);
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCart((prev) => [...prev, product]);
        console.log(`Added ${product.name} to cart`);
    };

    return {
        products,
        cart,
        addToCart,
    };
};
