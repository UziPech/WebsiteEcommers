
import React from 'react';

const products = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: '$450 MXN',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Palma Areca',
    price: '$800 MXN',
    image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Maceta de Barro Negra',
    price: '$250 MXN',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    tag: 'Artesanal',
  },
  {
    id: 4,
    name: 'Sustrato Premium',
    price: '$120 MXN',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Orquídea Phalaenopsis',
    price: '$650 MXN',
    image: 'https://images.unsplash.com/photo-1566958763363-2394fbd77180?auto=format&fit=crop&w=600&q=80',
    tag: 'Exclusivo',
  },
  {
    id: 6,
    name: 'Cactus San Pedro',
    price: '$350 MXN',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80',
  },
];

const Card: React.FC<{ item: typeof products[0] }> = ({ item }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
    {/* Image Container */}
    <div className="relative h-72 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.name} 
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {item.tag && (
        <div className="absolute top-3 left-3">
          <span className="bg-stone-900/90 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase backdrop-blur-sm shadow-md">
            {item.tag}
          </span>
        </div>
      )}
    </div>
    
    {/* Content */}
    <div className="flex flex-1 flex-col justify-between p-6">
      <div className="mb-4">
        <h3 className="text-xl font-medium text-stone-900 leading-tight mb-1">{item.name}</h3>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Vivero Balam</p>
      </div>
      <div className="flex items-center justify-between border-t border-stone-200/50 pt-4">
        <span className="text-lg font-bold text-emerald-800">{item.price}</span>
        <button className="rounded-full bg-stone-900 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
          ADD TO CART
        </button>
      </div>
    </div>
  </div>
);

export const StoreInterface: React.FC = () => {
  return (
    <div 
      className="absolute w-full z-20 pointer-events-auto min-h-screen flex flex-col"
      style={{ top: '100vh' }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-20 md:px-12">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tighter mb-3">
            Nuestra Selección
          </h2>
          <p className="text-stone-600 font-medium max-w-xl text-lg">
            Plantas endémicas y macetas artesanales curadas para tu espacio.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-32">
          {products.map((product) => (
            <Card key={product.id} item={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
