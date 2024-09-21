import Notification from "../models/notification.model.js";


export const getUserNotifications = async (req, res) => {
    // console.log("Getting notifications");
    try {
        const notifications = await Notification.find({ recipent: req.user._id })
        .sort({ createdAt: -1 })
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image");

        // console.log("notifications are");
        // console.log(notifications);
        
        return res.status(200).json(notifications);
    } catch (err) {
        console.log("Error in getUserNotifications controller: ", err);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        console.log("Getting notification", notificationId);

        const notification = await Notification.findByIdAndUpdate(
            { _id: notificationId, recipent: req.user._id },
            {read: true },
            { new: true }
        );

        res.status(200).json(notification);
    } catch (err) {
        console.log("Error in markingRead controller: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        await Notification.findOneAndDelete({
            _id: notificationId,
            recipent: req.user._id,
        });

        res.status(200).json({
            message: "Notification deleted successfully",
        });
    } catch (err) {
        console.log("Error in deleting notification: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};