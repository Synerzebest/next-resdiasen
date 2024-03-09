"use client";
 
import { usePathname, useRouter } from "next/navigation";
 
export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
 
  return (
    <div className="w-1/4 m-auto flex justify-center gap-4 pt-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
      >
        <input autoComplete="off" id="search" name="search" type="text" placeholder="Cherchez un utilisateur" className="outline-none shadow appearance-none border rounded py-2 px-3 text-gray-500"/>
        <button type="submit" className="text-white bg-blue-500 p-3 rounded text-lg">Chercher</button>
      </form>
    </div>
  );
};