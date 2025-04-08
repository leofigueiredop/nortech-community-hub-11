
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Nortech Communities has been a game-changer for our online academy. We've seen engagement increase by 300% since switching platforms.",
    author: "Sarah Johnson",
    role: "Founder, Digital Academy",
    avatar: "SJ"
  },
  {
    quote: "The course functionality combined with community features is exactly what we needed. Our members love the seamless experience.",
    author: "Michael Chen",
    role: "Community Manager, TechLearn",
    avatar: "MC"
  },
  {
    quote: "We evaluated all the major community platforms before choosing Nortech. The customization options and white-labeling made it an easy choice.",
    author: "Alex Rodriguez",
    role: "CEO, CreatorHub",
    avatar: "AR"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by community builders</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            See why creators and businesses choose Nortech Communities for their community platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="mb-6">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.33333 18.6667C10.8 18.6667 12 19.8667 12 21.3333C12 22.8 10.8 24 9.33333 24C7.86667 24 6.66667 22.8 6.66667 21.3333C6.66667 17.3333 7.2 12 13.3333 8.66667L14.6667 10.6667C11.3333 13.3333 11.3333 16.6667 11.3333 18.6667H9.33333ZM22.6667 18.6667C24.1333 18.6667 25.3333 19.8667 25.3333 21.3333C25.3333 22.8 24.1333 24 22.6667 24C21.2 24 20 22.8 20 21.3333C20 17.3333 20.5333 12 26.6667 8.66667L28 10.6667C24.6667 13.3333 24.6667 16.6667 24.6667 18.6667H22.6667Z" fill="#8B5CF6"/>
                  </svg>
                </div>
                <p className="text-gray-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.avatar}`} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
