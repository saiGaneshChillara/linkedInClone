/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const {
        data: connectionStatus,
        refetch: refetchConnectionStatus } = useQuery({
            queryKey: ["connectionStatus", userData._id],
            queryFn: async () => axiosInstance.get(`/connections/status/${userData._id}`),
            enabled: !isOwnProfile,
        });
    
    const isConnected = userData.connections.some((connection) => connection._id === authUser._id);

    const { mutate: sendConnectionRequest } = useMutation({
        mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
        onSuccess: () => {
            toast.success("Connection request sent");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequests"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error || "An error occurred");
        },
    });

    const { mutate: acceptConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
        onSuccess: () => {
            toast.success("Connection request accepted");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequests"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error || "An error occurred");
        },
    });

    const { mutate: rejectConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
        onSuccess: () => {
            toast.success("Connection request rejected");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequests"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error || "An error occurred");
        },
    });

    const { mutate: removeConnection } = useMutation({
        mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
        onSuccess: () => {
            toast.success("Connection removed");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connections"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error || "An error occurred");
        },
    });

    console.log("Isownproifle", isOwnProfile);

    const getConnectionState = () => {
        if (isConnected) return "connected";
        // if (!isConnected) return "notConnected";

        return connectionStatus?.data.status;
    };

    const renderConnectionButton = () => {
        const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

        switch (getConnectionState()) {
            case "connected":
                return (
                    <div className="flex gap-2 justify-center">
                        <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
                            <UserCheck size={20} className="mr-2" />
                            Connected
                        </div>
                        <button
                            className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
                            onClick={() => removeConnection(userData._id)}
                        >
                            <X size={20} className="mr-2" />
                            Remove Connection
                        </button>
                    </div>
                );
            case "pending":
                return (
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
                        <Clock size={20} className="mr-2" />
                        Pending
                    </button>
                );
            case "received":
                return (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => acceptConnectionRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-green-500 hover:bg-green-600`}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => rejectConnectionRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
                        >
                            Reject
                        </button>
                    </div>
                );
            default:
                return (
                    <button
                        onClick={() => sendConnectionRequest(userData._id)}
                        className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300
                        flex items-center justify-center"
                    >
                        <UserPlus size={20} className="mr-2" />
                        Connect
                    </button>
                );
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedData((prev) => ({...prev, [e.target.name]: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(editedData);
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow rounded-lg mb-6">
            <div 
                className="relative h-48 rounded-t-lg bg-cover bg-center"
                style={{
                    backgroundImage: `url('${editedData.bannerImage || userData.bannerImage || "/banner.png"}')`,
                }}
            >
                {isEditing && (
                    <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
                        <Camera size={20} />
                        <input 
                            type="file"
                            className="hidden"
                            name="bannerImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </label>
                )}
            </div>
            <div className="p-4">
                <div className="relative -mt-20 mb-4">
                    <img
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                        src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
                        alt={userData.name}
                    />
                    {isEditing && (
                        <label className="absolute bottom-0 right-1/2 transfrom translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
                            <Camera size={20} />
                            <input 
                                type="file"
                                className="hidden"
                                name="profilePicture"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </label>
                    )}
                </div>
                <div className="text-center mb-4">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedData.name ?? userData.name}
                            onChange={(e) => setEditedData({...editedData, name: e.target.value })}
                            className='text-2xl font-bold mb-2 text-center w-full'
                            required
                        />
                    ) : (
                        <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
                    )}
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedData.headline ?? userData.headline}
                            onChange={(e) => setEditedData({...editedData, headline: e.target.value })}
                            className="text-gray-600 text-center w-full"
                        />
                    ) : (
                        <p className="text-gray-600">{userData.headline}</p>
                    )}
                    <div className="flex justify-center items-center mt-2">
                        <MapPin size={16} className="text-gray-500 mr-1" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedData.locatation?? userData.locatation}
                                onChange={(e) => setEditedData({...editedData, locatation: e.target.value })}
                                className="text-gray-600 text-center"
                            />
                        ) : (
                            <span className="text-gray-600">{userData.locatation ?? "Earth"}</span>
                        )}
                    </div>
                </div>

                {isOwnProfile ? (
                    isEditing ? (
                        <button
                            onClick={handleSave}
                            className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark 
                            transition duration-300"
                        >
                            Save Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark 
                            transition duration-300"
                        >
                            Edit Profile
                        </button>
                    )
                ) : (
                    <div className="flex justify-center">
                        {renderConnectionButton()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;