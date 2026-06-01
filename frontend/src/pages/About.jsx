import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title  text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="about_img" loading="lazy" />
        
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>ELITE WEAR. was born out of a passion for style and a desire to provide high-quality fashion to everyone. We believe that what you wear is an extension of your personality, and we are here to help you express yourself through our carefully selected pieces.</p>

          <p>Our journey started with a simple idea: to make premium shopping accessible and enjoyable. Today, we continue to innovate and grow, always keeping our customers at the heart of everything we do.</p>


          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to empower individuals through fashion by providing versatile, high-quality clothing that combines comfort with contemporary style.</p>
        </div>

      </div>
      
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>  

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Quality Assurance:</b>
              <p className='text-gray-600'>We meticulously source our materials and partner with reliable manufacturers to ensure every product meets our high standards.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Convenience:</b>
              <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping for your favorite styles has never been easier.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Exceptional Customer Service:</b>
              <p className='text-gray-600'>Our dedicated support team is available 24/7 to assist you with any inquiries or concerns, ensuring a smooth shopping experience.</p>
          </div>

      </div>


    <NewsletterBox/>

    </div>
  )
}

export default About
