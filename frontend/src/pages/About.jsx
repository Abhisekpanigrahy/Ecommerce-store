import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';

const About = () => {
  return (
    <div className="pb-20">
      <div className='text-3xl text-center pt-10 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-24'>
        {/* Left Side: Image with decorative frame */}
        <div className="relative w-full lg:w-1/2">
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-black/10 -z-10 hidden sm:block"></div>
          <img 
            className='w-full object-cover shadow-2xl grayscale-[0.3] hover:grayscale-0 transition-all duration-700' 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Our Studio" 
            loading="lazy" 
          />
          <div className="absolute -bottom-6 -right-6 bg-black text-white px-8 py-4 hidden lg:block">
            <p className="text-xs tracking-[0.3em] font-bold uppercase italic">Since 2024</p>
          </div>
        </div>
        
        {/* Right Side: Content */}
        <div className='flex flex-col justify-center gap-8 lg:w-1/2'>
          <h2 className="prata-regular text-4xl text-black leading-tight">
            Elevating Everyday <br />
            <span className="text-gray-400 italic">Through Fashion</span>
          </h2>
          
          <div className="space-y-6 text-gray-600 leading-relaxed text-base">
            <p>
              <span className="text-black font-semibold">ELITE WEAR</span> was born out of a passion for style and a desire to provide high-quality fashion to everyone. We believe that what you wear is an extension of your personality, and we are here to help you express yourself through our carefully selected pieces.
            </p>

            <p>
              Our journey started with a simple idea: to make premium shopping accessible and enjoyable. Today, we continue to innovate and grow, always keeping our customers at the heart of everything we do.
            </p>

            <div className="pt-6 border-t border-gray-100">
              <b className='text-black text-xl mb-4 block'>Our Mission</b>
              <p>Our mission is to empower individuals through fashion by providing versatile, high-quality clothing that combines comfort with contemporary style.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='text-2xl pt-20 pb-10 text-center'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 mb-20 gap-0 border border-gray-200'>  
          <div className='px-10 py-16 flex flex-col gap-6 hover:bg-black hover:text-white transition-all duration-300 group'>
              <span className="text-4xl group-hover:scale-110 transition-transform inline-block">💎</span>
              <b className='text-lg uppercase tracking-widest'>Quality Assurance</b>
              <p className='text-gray-500 group-hover:text-gray-300 transition-colors'>We meticulously source our materials and partner with reliable manufacturers to ensure every product meets our high standards.</p>
          </div>

          <div className='px-10 py-16 flex flex-col gap-6 border-y md:border-y-0 md:border-x border-gray-200 hover:bg-black hover:text-white transition-all duration-300 group'>
              <span className="text-4xl group-hover:scale-110 transition-transform inline-block">🚀</span>
              <b className='text-lg uppercase tracking-widest'>Convenience</b>
              <p className='text-gray-500 group-hover:text-gray-300 transition-colors'>With our user-friendly interface and hassle-free ordering process, shopping for your favorite styles has never been easier.</p>
          </div>

          <div className='px-10 py-16 flex flex-col gap-6 hover:bg-black hover:text-white transition-all duration-300 group'>
              <span className="text-4xl group-hover:scale-110 transition-transform inline-block">🎧</span>
              <b className='text-lg uppercase tracking-widest'>Exceptional Service</b>
              <p className='text-gray-500 group-hover:text-gray-300 transition-colors'>Our dedicated support team is available 24/7 to assist you with any inquiries or concerns, ensuring a smooth shopping experience.</p>
          </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
