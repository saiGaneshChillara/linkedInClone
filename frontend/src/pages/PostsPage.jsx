import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/SideBar";
import Post from "../components/Post";

const PostsPage = () => {

    const { postId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"]});

    const { data: post, isLoading: postLoading } = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => axiosInstance.get(`/posts/${postId}`,)
    });

    if (postLoading) return <div>Loading...</div>;
    
    if (!post.data) return <div>Post not found</div>;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
                <Sidebar user={authUser} />
            </div>

            <div className="col-span-1 lg:col-span-3">
                <Post post={post.data} />
            </div>
        </div>
    );
};

export default PostsPage;