
import { useState } from 'react';
import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    const recipient = "abhisekpanigrahy79@gmail.com";
    const subject = `New Message from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    
    // Using mailto as a client-side solution for immediate "send to that email" requirement
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    toast.success("Opening your email client to send the message!");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pb-20">
      <div className="text-center text-3xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-16 flex flex-col lg:flex-row justify-center items-start gap-16 lg:gap-24'>
        {/* Left Side: Image with floating detail */}
        <div className="relative w-full lg:w-1/2">
          <img 
            className='w-full object-cover shadow-2xl rounded-sm' 
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop" 
            alt="Contact Us" 
          />
          <div className="absolute -top-6 -right-6 bg-white p-6 shadow-xl hidden xl:block border border-gray-100">
            <p className="text-black font-bold text-lg mb-1">Visit Our HQ</p>
            <p className="text-gray-400 text-xs tracking-widest uppercase">Mon - Fri | 9am - 6pm</p>
          </div>
        </div>

        {/* Right Side: Contact Info & Form */}
        <div className='flex flex-col justify-start items-start gap-10 w-full lg:w-1/2'> 
          <div className="space-y-6 w-full">
            <h2 className="prata-regular text-4xl text-black">Get In Touch</h2>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Have a question about our collection or an order? Our team is here to help you. Reach out through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full border-t border-gray-100 pt-10">
            <div className="space-y-4">
              <p className='font-bold text-sm uppercase tracking-[0.2em] text-black'>Our Store</p>
              <p className='text-gray-500 leading-relaxed'>
                Sector 10, Uttara Model Town <br />
                Bhubaneswar, Odisha, India
              </p>
            </div>

            <div className="space-y-4">
              <p className='font-bold text-sm uppercase tracking-[0.2em] text-black'>Contact Details</p>
              <div className="text-gray-500 space-y-2">
                <p>Tel: <a className='text-black hover:underline font-medium' href='tel:+919348657780'>+919348657780</a></p>
                <p>Email: <a className='text-black hover:underline font-medium' href='mailto:abhisekpanigrahy79@gmail.com'>abhisekpanigrahy79@gmail.com</a></p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#f9f9f9] p-8 md:p-10 rounded-sm">
            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all" 
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email" 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all" 
                />
              </div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message" 
                rows="4" 
                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all resize-none"
              ></textarea>
              <button 
                type="submit"
                className="bg-black text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-gray-800 transition-all active:scale-95"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
