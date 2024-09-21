import cloudinary from "../lib/cloudinaryConfig.js";

import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] }})
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({ createdAt: - 1});

        res.status(200).json(posts);
    } catch (err) {
        console.log("Error in getPosts controller: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content && !image) {
            return res.status(400).json({
                message: "Please provide content or an image."
            });
        }
        
        let newPost;

        if (image) {
            const result = await cloudinary.uploader.upload(image);
            newPost = new Post({
                content,
                image: result.secure_url,
                author: req.user._id
            });
        } else {
            newPost = new Post({
                content,
                author: req.user._id
            });
        }

        await newPost.save();

        return res.status(201).json(newPost);
    } catch (err) {
        console.log("Error in createPost controller: " + err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Your are not authorized to delete this post",
            });
        }

        if (post.image) { //deleting the image from cloudinary database
            const imageId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (err) {
        console.log("Error in delete Post controller: ",err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture username headline");

        res.status(200).json(post);
    } catch (err) {
        console.log("Error in getpostById controller", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: { user: req.user._id, content } }
        }, { new: true });

        if (post.author.toString() !== req.user._id.toString()) {
            const notification = new Notification({
                recipent: post.author,
                type: "comment",
                relatedPost: post._id,
                relatedUser: req.user._id,
            });

            await notification.save();
        }

        res.status(200).json(post);
    } catch (err) {
        console.log("Error in commentPost Controller: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;

        if (post.likes.includes(userId)) { //means user already lked the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
            
            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    recipent: post.author,
                    type: "like",
                    relatedPost: post._id,
                    relatedUser: req.user._id,
                });

                await newNotification.save();
            }
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        console.log("Error in likePost controller: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};