import { Navbar, Footer } from "@/components";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs";
import Image from 'next/image';
import { Divider } from "antd";


export default async function Page(params: {
    searchParams: {search?: string};
}) {

    const query = params.searchParams.search;
 
    const users = query ? await clerkClient.users.getUserList({ query }) : [];
 

    return (
        <>
            <Navbar />
            
            <SearchUsers />

            <div className="w-11/12 m-auto flex justify-center flex-wrap flex-row gap-12 items-center text-center pt-8">

                {users.map((user) => {
                    return (
                    <div key={user.id} className="w-72 flex flex-col items-center gap-3 rounded-lg pb-4 pt-2 border border-gray-200">
                        <Image src={user.imageUrl} alt="profile picture" width={200} height={200} className="mt-2 mb-4 rounded-full w-24" />
                        <p className="text-lg capitalize">{user.lastName}</p>
                        <p>{user.firstName}</p>
                        {user.publicMetadata.role as string}
                    </div>
                    );
                })}

            </div>

            <Divider className="absolute top-96 my-32"/>
                        
            <Footer />
        </>
    )
}