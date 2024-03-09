import { UserProfile } from '@clerk/nextjs';
import { Navbar, PostAnnouncement, Footer } from '@/components';

const Profile = () => {
    return(
        <>
            <Navbar />

            <div className="w-screen flex justify-center">
                <PostAnnouncement />
            </div>
            

            <div className="w-screen flex justify-center relative top-[10rem]">
                <UserProfile />
            </div>
            


            <Footer />
            
        </>
    )
}

export default Profile;