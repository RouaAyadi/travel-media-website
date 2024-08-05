import React from 'react';
import ProfilePage from '../components/ProfilePage';
import { fetchUserProfileById } from '../../../utils/user';

 async function Profile  ({ params }) {
    console.log(params.profile)
    const userResp = await fetchUserProfileById(params.profile);
    return (
       
        <ProfilePage userID={params.profile} data={userResp?.data[0]}>
        </ProfilePage>
       
    
    );
};

export default Profile