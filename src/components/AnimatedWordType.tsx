"use client ";
import { TypeAnimation } from "react-type-animation";

export default function AnimatedWordType() {
  return (
    <span className="bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] bg-clip-text text-transparent animate-gradient text-5xl sm:text-7xl font-extrabold">
      JUST -{" "}
      <TypeAnimation
        sequence={["WORDS.", 1500, "VOICE.", 1500]}
        wrapper="span"
        speed={50}
        style={{ display: "inline-block" }}
        repeat={Infinity}
        aria-live="polite"
      />
    </span>
  );
}
