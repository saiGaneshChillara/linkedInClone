import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillSection from "../components/SkillSection";


const ProfilePage = () => {
    const { username } = useParams();
    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({ queryKey: ['authUser'] });

    const { data: userProfile, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile', username],
        queryFn: async () => axiosInstance.get(`/users/${username}`),
    });

    const { mutate: updateProfile } = useMutation({
        mutationFn: async (updatedData) => {
           await axiosInstance.put("/users/update", updatedData);
        },
        onSuccess: () => {
            // queryClient.invalidateQueries(['authUser']);
            queryClient.invalidateQueries(['userProfile'], username);
        },
    });

    if (isProfileLoading) return null;
    
    const isOwnProfile = authUser.username === userProfile.data.username;
    const userData = isOwnProfile ? authUser : userProfile.data;

    console.log("user Profile is", userProfile);
    const handleOnSave = (updatedData) => {
        updateProfile(updatedData);
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleOnSave} />
            <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleOnSave} />
            <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleOnSave} />
            <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleOnSave} />
            <SkillSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleOnSave} />
        </div>
    );
};

export default ProfilePage;