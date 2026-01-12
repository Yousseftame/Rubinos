import interior from '../../assets/interior.webp';
import ambiance from '../../assets/ambiance-1.jpg';
import mapTexture from '../../assets/ambiance-1.jpg';
import { MapPin, Phone, Mail } from 'lucide-react';

const Dashboard = () => {
  return (
    <>
      {/* Hero Section - Full Screen with Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={interior}
            alt="Seaworthy Interior"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-12"> 
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            {/* Large SEAWORTHY Text */}
            <h1 className=" font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em] animate-fade-in">
              Rubino's
            </h1>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-secondary/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary/70 rounded-full animate-pulse" />
          </div>
        </div> */}
      </section>

      {/* About Section */}
      <section className="relative bg-seaworthy-textured py-20 lg:py-32">
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl text-secondary tracking-wider mb-8 animate-fade-in-up">
              Come for the Oysters, Stay for the Everything
            </h2>

            <div className="space-y-6 text-secondary/80 font-body text-base lg:text-lg leading-relaxed">
              <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Seaworthy showcases wild-caught, sustainably harvested oysters from American 
                waters—including the Gulf Coast, East Coast, and West Coast—alongside locally 
                sourced fish and game. Named the <em>Best Oyster Happy Hour</em> by <em>Eater</em> and 
                recognized for the <em>Best Raw Oysters in New Orleans</em> by <em>Where Y'at</em>, 
                Seaworthy has become the go-to destination for oyster lovers across the city.
              </p>
              <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Housed in a historic 19th century Creole townhome built in 1832, Seaworthy draws 
                inspiration from the Gulf Coast waters, the timeless traditions of Southern 
                hospitality, and the vibrant spirit of New Orleans.
              </p>
            </div>

            <a
              href="https://www.opentable.com/r/seaworthy-new-orleans-2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-seaworthy inline-block mt-10 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              Reserve Now
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Image Row */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={ambiance}
              alt="Seaworthy Ambiance"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={interior}
              alt="Seaworthy Bar"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Private Dining Section */}
      <section id="private-dining" className="relative bg-seaworthy-textured py-20 lg:py-32">
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative overflow-hidden animate-fade-in-up">
              <img
                src={ambiance}
                alt="Private Dining"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-seaworthy-teal/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl lg:text-4xl text-secondary tracking-wider mb-6 animate-fade-in-up">
                The Pearl of Private Dining
              </h2>

              <p className="text-secondary/80 font-body text-base lg:text-lg leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Seaworthy provides a unique setting for intimate gatherings, special celebrations, 
                or corporate dinners. Guests can enjoy a curated menu featuring fresh, wild-caught 
                oysters, locally sourced seafood, and expertly crafted cocktails, all tailored to 
                fit your occasion.
              </p>

              <a
                href="#private-events"
                className="btn-seaworthy inline-block animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                More About Private Events
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section with Map Texture */}
      <section
        id="contact"
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${mapTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-seaworthy-teal-dark/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Location Info */}
            <div className="text-center lg:text-left">
              <h2 className="font-display text-4xl lg:text-5xl text-secondary tracking-wider mb-10 animate-fade-in">
                LOCATION
              </h2>

              <div className="space-y-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-secondary">
                  <MapPin className="w-5 h-5 text-secondary/70" strokeWidth={1.5} />
                  <a
                    href="https://maps.app.goo.gl/DNhEqSRg7yZdN9uc6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-lg hover:text-secondary/80 transition-colors"
                  >
                    630 Carondelet Street New Orleans, LA 70130
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 text-secondary">
                  <Phone className="w-5 h-5 text-secondary/70" strokeWidth={1.5} />
                  <a
                    href="tel:504-930-3071"
                    className="font-body text-lg hover:text-secondary/80 transition-colors"
                  >
                    504.930.3071
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 text-secondary">
                  <Mail className="w-5 h-5 text-secondary/70" strokeWidth={1.5} />
                  <a
                    href="mailto:info@seaworthynola.com"
                    className="font-body text-lg hover:text-secondary/80 transition-colors"
                  >
                    info@seaworthynola.com
                  </a>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/DNhEqSRg7yZdN9uc6"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-seaworthy-solid inline-block animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                Get Direction
              </a>
            </div>

            {/* Right - Hours */}
            <div className="text-center lg:text-left" id="menu">
              <h2 className="font-display text-4xl lg:text-5xl text-secondary tracking-wider mb-10 animate-fade-in">
                MENU
              </h2>

              <div className="space-y-8">
                {/* Restaurant Hours */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <h3 className="font-display text-xl text-secondary tracking-wider mb-4">
                    Restaurant Hours
                  </h3>
                  <div className="text-secondary/80 font-body space-y-1">
                    <p>Sunday - Wednesday 4pm - 10pm</p>
                    <p>Thursday - Saturday 4pm - 11pm</p>
                  </div>
                </div>

                {/* Happy Hour */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-display text-xl text-secondary tracking-wider mb-2">
                    Oyster Happy Hour
                  </h3>
                  <p className="text-secondary/70 font-body text-sm italic mb-3">
                    Half-off Shucker's select oysters and drink specials
                  </p>
                  <p className="text-secondary/80 font-body">
                    7 days a Week 4pm - 6pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;