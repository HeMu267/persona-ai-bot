"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface PersonaCardProps {
  name: string;
  image: string;
  personaId: string;
}

export default function PersonaCard({ name, image, personaId }: PersonaCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat?persona=${personaId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition hover:scale-105 hover:shadow-blue-500/50 hover:ring-2 hover:ring-blue-400"
    >
      <Image
        src={image}
        alt={name}
        width={300}
        height={300}
        className="object-cover w-full h-64"
      />
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
      </div>
    </div>
  );
}
