// Menu.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import section1 from '../../assets/section1.webp';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('oysters');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const menuData = {
    oysters: [
      {
        id: 1,
        name: 'Gulf Coast Oysters',
        description: 'Fresh, wild-caught oysters from pristine Gulf waters',
        price: '$13',
        image: section1,
        fullDescription: 'Our Gulf Coast oysters are sourced from the pristine waters of the Gulf, known for their briny flavor and firm texture. Harvested daily for peak freshness.',
      },
      {
        id: 2,
        name: 'East Coast Selection',
        description: 'Premium oysters with briny, crisp flavor profiles',
        price: '$24',
        image: section1,
        fullDescription: 'These premium East Coast oysters offer a crisp, briny flavor that pairs perfectly with our classic cocktails and fresh seafood.',
      },
      {
        id: 3,
        name: 'West Coast Varieties',
        description: 'Specialty oysters with unique terroir characteristics',
        price: '$19',
        image: section1,
        fullDescription: 'West Coast oysters bring unique flavors influenced by the cold Pacific waters. Each variety offers distinct characteristics and taste profiles.',
      },
      {
        id: 4,
        name: 'Shucker\'s Special',
        description: 'Chef\'s selection of the finest daily oysters',
        price: '$13',
        image: section1,
        fullDescription: 'Our head shucker handpicks the finest oysters available each day. This selection changes based on seasonal availability and quality.',
      },
    ],
    appetizers: [
      {
        id: 5,
        name: 'Oyster Rockefeller',
        description: 'Baked oysters with herbs and breadcrumb topping',
        price: '$18',
        image: section1,
        fullDescription: 'A classic preparation featuring fresh oysters baked with a rich herb and breadcrumb topping, finished with butter.',
      },
      {
        id: 6,
        name: 'Shrimp Remoulade',
        description: 'Chilled Gulf shrimp with classic spicy sauce',
        price: '$16',
        image: section1,
        fullDescription: 'Gulf shrimp chilled and served with our signature remoulade sauce, a New Orleans classic with just the right amount of spice.',
      },
      {
        id: 7,
        name: 'Crab Cake',
        description: 'Lump crab with light herb binding, pan-seared',
        price: '$14',
        image: section1,
        fullDescription: 'Made with premium lump crab meat and light herb binding, pan-seared to golden perfection. Simple, elegant, delicious.',
      },
      {
        id: 8,
        name: 'Seafood Platter',
        description: 'Assorted fresh catch with seasonal accompaniments',
        price: '$24',
        image: section1,
        fullDescription: 'A generous platter featuring the finest seasonal seafood, perfectly arranged and served with house-made accompaniments.',
      },
    ],
    entrees: [
      {
        id: 9,
        name: 'Grilled Fish of the Day',
        description: 'Market-fresh catch prepared with simple elegance',
        price: '$32',
        image: section1,
        fullDescription: 'Our chef selects the finest fish available daily and prepares it with simple, elegant technique to highlight its natural flavors.',
      },
      {
        id: 10,
        name: 'Pan-Seared Scallops',
        description: 'Diver scallops with lemon beurre blanc sauce',
        price: '$38',
        image: section1,
        fullDescription: 'Hand-selected diver scallops, seared to perfection and served with a bright lemon beurre blanc sauce.',
      },
      {
        id: 11,
        name: 'Gulf Shrimp Creole',
        description: 'Classic New Orleans preparation with rice',
        price: '$28',
        image: section1,
        fullDescription: 'Gulf shrimp in our signature Creole sauce, served over traditional rice. A true New Orleans classic.',
      },
      {
        id: 12,
        name: 'Lobster Tail',
        description: 'Butter-poached with seasonal vegetables',
        price: '$48',
        image: section1,
        fullDescription: 'Premium lobster tail gently poached in butter and served with seasonal vegetables. A true showstopper.',
      },
    ],
    cocktails: [
      {
        id: 13,
        name: 'Seaworthy Sazerac',
        description: 'Our signature rye cocktail with a twist',
        price: '$12',
        image: section1,
        fullDescription: 'A modern take on the classic Sazerac, featuring premium rye and our house-made bitters.',
      },
      {
        id: 14,
        name: 'Oyster Shot',
        description: 'Vodka, hot sauce, and fresh oyster broth',
        price: '$8',
        image: section1,
        fullDescription: 'A bold and unique shot combining vodka, hot sauce, and fresh oyster brine. Not for the faint of heart.',
      },
      {
        id: 15,
        name: 'Gulf Coast Mojito',
        description: 'Rum, mint, lime, and local sugar cane',
        price: '$11',
        image: section1,
        fullDescription: 'A refreshing mojito made with local rum and fresh mint, sweetened with local sugar cane.',
      },
      {
        id: 16,
        name: 'Seafoam Martini',
        description: 'Premium gin with house-made vermouth',
        price: '$13',
        image: section1,
        fullDescription: 'A sophisticated martini featuring premium gin and our house-made vermouth, perfectly balanced and elegantly served.',
      },
    ],
  };

  const categories = [
    { id: 'oysters', label: 'OYSTERS' },
    { id: 'appetizers', label: 'APPETIZERS' },
    { id: 'entrees', label: 'ENTREES' },
    { id: 'cocktails', label: 'COCKTAILS' },
  ];

  const handleItemClick = (item: any) => {
    navigate(`/menu/${item.id}`, { state: { item } });
  };

  const handleCategoryChange = (categoryId: string) => {
    setIsLoading(true);
    setActiveCategory(categoryId);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
       <section className="relative h-[500px] lg:h-[600px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={section1}
            alt="Menu"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>


        {/* Hero Content */}
         <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-12">
          <div data-aos="fade-up" className=" max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <h1 className="font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em]">
              MENU
            </h1>
          </div>
        </div>
      </section>

      {/* Menu Content Section */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`text-sm lg:text-base font-serif font-semibold tracking-widest transition-all duration-300 pb-2 border-b-2 ${
                  activeCategory === category.id
                    ? 'border-b-[#3d5055] text-[#3d5055]'
                    : 'border-b-transparent text-[#6b7c7e] hover:text-[#3d5055]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-[#a89f97]/30 border-t-[#3d5055] rounded-full animate-spin" />
                </div>
                <p className="font-serif text-[#6b7c7e] mt-4">Loading menu...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-fadeIn">
              {menuData[activeCategory as keyof typeof menuData]?.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group cursor-pointer pb-6 border-b border-[#a89f97]/30 hover:border-[#3d5055] transition-colors duration-300"
                >
                  <div className="flex items-start gap-4 mb-2">
                    {/* Small Image */}
                    <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md shadow-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3
                          className="font-serif text-lg lg:text-xl font-semibold flex-1"
                          style={{ color: '#3d5055' }}
                        >
                          {item.name}
                        </h3>
                        <span
                          className="font-serif text-sm lg:text-base font-medium whitespace-nowrap"
                          style={{ color: '#5a7a82' }}
                        >
                          {item.price}
                        </span>
                      </div>
                      <p
                        className="font-serif text-sm lg:text-base leading-relaxed"
                        style={{ color: '#6b7c7e' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Border */}
          <div className="mt-16 pt-12 border-t border-[#a89f97]/30 text-center">
            <p className="font-serif text-sm lg:text-base italic" style={{ color: '#6b7c7e' }}>
              Menu items and prices subject to change based on seasonal availability and market conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}