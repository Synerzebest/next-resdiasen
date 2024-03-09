import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return(
    <div className="w-screen h-screen flex justify-center gap-12 items-center">
        <div>
            <h1 className="text-4xl">
                Resdiasen
            </h1>
            <h3 className="text-xl">
                Rejoignez Resdiasen et façonnez le Sénégal de demain
            </h3>
        </div>
        <SignIn />
    </div>
  )
}