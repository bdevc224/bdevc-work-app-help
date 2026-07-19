import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

const PHONE = "2349166226690";
const WHATSAPP = "2349166226690";
const LINKEDIN = "http://www.linkedin.com/in/ikeagwuonu-chinemerem-benedict-bdevc-585a34307";
const LOCATION = "https://maps.google.com/?q=Nigeria";

const projects = [
  {
    title: "Resume Builder Web App",
    desc: "A modern resume builder built with Vite, React, Tailwind & TypeScript. Designed for simplicity and professional output.",
    Link: "/resumebuilder",
  },
  {
    title: "Creative Design System",
    desc: "A personal design system combining UI, branding, and motion principles for consistent product visuals.",
  },
  {
    title: "Social Media Mockup Engine",
    desc: "Dynamic mockups for LinkedIn, Instagram, and Facebook-style UI presentations.",
  },
];

const AboutDeveloper: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 md:px-16 py-16">

      {/* HERO */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Hi, I'm
            <span className="block text-cyan-400">
              <TypeAnimation
                sequence={[
                  "BDevC",
                  1500,
                  "A Creative Developer",
                  1500,
                  "A Digital Builder",
                  1500,
                ]}
                speed={50}
                repeat={Infinity}
              />
            </span>
          </h1>

          <p className="mt-6 text-gray-300">
            Ikeagwuonu Chinemerem Benedict — a developer who blends
            <span className="text-white"> code, design, and motion</span> to create
            experiences that stand out.
          </p>

          <p className="mt-4 text-gray-400">
            I don’t just build apps — I craft digital experiences that communicate,
            engage, and convert.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-full font-semibold"
            >
              Work With Me
            </a>

            <a
              href={LINKEDIN}
              target="_blank"
              className="border border-gray-700 hover:border-cyan-500 px-6 py-3 rounded-full"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>

        {/* RIGHT - IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            
            {/* Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500 via-purple-500 to-blue-500 blur-2xl opacity-30 rounded-full"></div>

            {/* IMAGE */}
            <img
              src="/images/BDevC.png"
              alt="BDevC"
              className="relative w-72 h-72 object-cover rounded-full border-4 border-gray-800 shadow-xl"
            />
          </div>
        </motion.div>
      </div>

      {/* CONTACT STRIP */}
      <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-green-500 hover:bg-green-800 p-3 rounded-lg text-center">WhatsApp</a>
        <a href={`tel:${PHONE}`} className="bg-blue-500 hover:bg-blue-800 p-3 rounded-lg text-center">Call</a>
        <a href="mailto:bdevc@gmail.com?subject=Work%20With%20BDevC"
          className="bg-linear-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition px-6 py-3 rounded-full text-white text-center font-semibold shadow-lg"
        >
          Contact via Email
        </a>
        <a href={LINKEDIN} target="_blank" className="bg-gray-800 hover:bg-gray-600 p-3 rounded-lg text-center">LinkedIn</a>
        <a href={LOCATION} target="_blank" className="bg-purple-600 hover:bg-purple-800 p-3 rounded-lg text-center">Location</a>
      </div>

      {/* SKILLS */}
      <div className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">What I Do</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            "Web Development",
            "React & TypeScript",
            "UI/UX Design",
            "Graphics Design",
            "Video Editing",
            "Motion Graphics",
          ].map((skill, i) => (
            <div key={i} className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-cyan-500">
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <div className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Link to="/resumebuilder"
              key={i}
              className="bg-[#111] border border-gray-800 p-6 rounded-xl hover:border-cyan-500"
            >
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{project.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center mt-24">
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          className="bg-cyan-500 px-10 py-4 rounded-full font-semibold hover:bg-cyan-800"
        >
          Let’s build something impactful
        </a>
      </div>
    </div>
  );
};

export default AboutDeveloper;