// src/components/Footer.tsx
import { FaReact, FaGithub } from "react-icons/fa";
import { SiTailwindcss, SiNetlify, SiFirebase } from "react-icons/si";

export default function Footer() {
  const techs = [
    { icon: <FaReact className="text-blue-400" />, name: "React" },
    { icon: <SiTailwindcss className="text-teal-400" />, name: "Tailwind" },
    { icon: <SiNetlify className="text-green-400" />, name: "Netlify" },
    { icon: <SiFirebase className="text-yellow-400" />, name: "Firebase" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* GitHub */}
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <FaGithub
            className="text-2xl hover:text-gray-400 hover:scale-110 transition-all cursor-pointer"
            onClick={() =>
              window.open("https://github.com/MohnajibG/todoliste", "_blank")
            }
          />
          <span className="text-sm md:text-base">Mon GitHub</span>
        </div>

        {/* Tech logos */}
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
          {techs.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 hover:scale-110 transition-transform cursor-pointer"
              title={tech.name}
            >
              {tech.icon}
              <span className="text-xs md:text-sm">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs mt-4">
        © {new Date().getFullYear()} TodoListe by Mohamed Najib. All rights
        reserved.
      </div>
    </footer>
  );
}
