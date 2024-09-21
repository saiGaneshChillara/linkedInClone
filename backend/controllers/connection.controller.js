import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";

export const sendConnectionReques = async (req, res) => {
    try {
        const { userId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === userId) {
            return res.status(400).json({
                message: "You cannot send a connection request to yourself",
            });
        }

        const existingRequest = await Connection.findOne({
            sender: senderId,
            recipent: userId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You have already sent a pending connection request to this user",
            });
        }

        const connectionRequest = new Connection({
            sender: senderId,
            recipent: userId,
        });

        await connectionRequest.save();

        res.status(201).json({
            message: "Connection request sent successfully",
        });
    } catch (err) {
        console.log("Error in sendingConnectionController: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await Connection.findById(requestId);

        if (!request) {
            return res.status(404).json({
                message: "Connection request not found",
            });
        }

        if (request.recipent.toString()!== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this connection request",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "This connection request is not pending",
            });
        }

        request.status = "accepted";

        await request.save();

        // Adding Id to the connections list of each user
        await User.findByIdAndUpdate(request.sender._id, {
            $addToSet : { connections: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet : { connections: request.sender._id }
        });

        const notification = new Notification({
            recipent: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId,
        });

        await notification.save();

        return res.status(200).json({
            message: "Connection request accepted successfully",
        });

    } catch (err) {
        console.log("Error in accepting Connection: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const declineConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await Connection.findById(requestId);

        if (request.recipent.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to decline this connection request",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "This connection request is not pending",
            });
        }

        request.status = "rejected";
        await request.save();

        return res.status(200).json({
            message: "Connection request rejected",
        });
    } catch (err) {
        console.log("Error in rejecting connection request: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await Connection.find({
            recipent: userId, status: "pending"
        }).populate("sender", "name username profilePicture headline connections");

        res.json(requests);
    } catch (err) {
        console.log("Error in getting user connection Requests: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
        .populate("connections", "name username profilePicture headline connections");

        res.json(user.connections);
    } catch (err) {
        console.log("Error in getting user connections: ", err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const removeConnection = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, { $pull: { connections: userId }});
        await User.findByIdAndUpdate(userId, { $pull: { connections: myId }});

        const connectionRequest = await Connection.findOne({
            $or: [
                { sender: myId, recipent: userId },
                { sender: myId, recipent: userId },
            ],
         });

         if (connectionRequest) {
            await Connection.findByIdAndDelete(connectionRequest._id);
         }
         
        return res.status(200).json({
            message: "Connection removed successfully",
        });
    } catch (err) {
        console.log("Error in removing the connection: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        const currentUser = req.user;
        if (currentUser.connections.includes(targetUserId)) {
            return res.json({
                status: "connected",
            });
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, recipent: targetUserId },
                { sender: targetUserId, recipent: currentUserId },
            ],
            status: "pending",
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.status(200).json({
                    status: "pending",
                });
            } else {
                return res.status(200).json({
                    status: "recieved",
                    requestId: pendingRequest._id,
                });
            }
        }

        return res.json({
            status: "not_connected",
        });
    } catch (err) {
        console.log("Error in getting status of request: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

