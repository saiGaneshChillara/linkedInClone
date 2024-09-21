/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ connectionRequest }) => {
    const queryClient = useQueryClient();

    const { mutate: acceptConnectionRequest } = useMutation({
        mutationFn: async (id) => axiosInstance.put(`/connections/accept/${id}`),
        onSuccess: () => {
            toast.success("Connection request accepted");
            queryClient.invalidateQueries(["connectionRequests"]);
        },
        onError: (err) => {
            toast.error(err.response.data.error || "Failed to accept connection request");
        },
    });

    const { mutate: rejectConnectionRequest } = useMutation({
        mutationFn: async (id) => axiosInstance.put(`/connections/reject/${id}`),
        onSuccess: () => {
            toast.success("Connection request rejected");
            queryClient.invalidateQueries(["connectionRequests"]);
        },
        onError: (err) => {
            toast.error(err.response.data.error || "Failed to reject connection request");
        },
    });

    return (
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
                <Link to={`/profile/${connectionRequest.sender.username}`}>
                    <img 
                        src={connectionRequest.sender.profilePicture || "/avatar.png"}
                        alt={connectionRequest.sender.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </Link>
                <div>
                    <Link 
                        to={`/profile/${connectionRequest.sender.username}`}
                        className="font-semibold text-lg"
                    >
                        {connectionRequest.sender.name}
                    </Link>
                    <p className="text-gray-600">{connectionRequest.sender.headline}</p>
                </div>
            </div>
            <div className="space-x-2">
                <button
                    className="bg-primary text-white px-4 rounded-md hover:bg-primary-dark transition-colors"
                    onClick={() => acceptConnectionRequest(connectionRequest._id)}
                >
                    Accept
                </button>
                <button
                    className="bg-gray-200 text-gray-800 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => rejectConnectionRequest(connectionRequest._id)}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default FriendRequest;