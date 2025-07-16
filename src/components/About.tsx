import React from "react";

interface AboutProps {
  id?: string;
}

const About: React.FC<AboutProps> = ({ id = "" }) => {
  return (
    <section
      className={`lg:min-h-screen h-auto py-10 flex flex-col items-center justify-center text-white lg:px-6 lg:py-20 ${id}`}
    >
      <div className="lg:max-w-4xl p-5 lg:w-3/4 w-4/5 text-center bg-blue-900/50 backdrop-blur-xs lg:p-44 rounded-lg">
        <h2 className="lg:text-5xl text-3xl font-bold text-blue-400 mb-6">
          About Us
        </h2>
        <p className="lg:text-xl text-md text-gray-100 leading-relaxed">
          We are a vibrant community of innovators, creators, and problem-solvers 
          passionate about making a positive impact in our field. From hosting workshops 
          and events to building meaningful projects and solutions, we strive to ignite 
          curiosity and drive change across disciplines. Join us in our mission to 
          connect, learn, and grow together.
        </p>
      </div>
    </section>
  );
};

export default About;
