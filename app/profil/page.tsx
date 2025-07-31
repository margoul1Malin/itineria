"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page des informations personnelles
    router.replace('/profil/infos');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );
} 