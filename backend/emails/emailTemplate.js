export const createWelcomeEmailTemplate = (name, profileUrl) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to LinkedIn Clone</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #0073b1;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    text-align: center;
                    padding: 20px 0;
                    color: #333;
                }
                .content p {
                    font-size: 18px;
                    margin: 15px 0;
                }
                .button-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .button {
                    background-color: #0073b1;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding: 20px 0;
                    font-size: 14px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to LinkedIn Clone, ${name}!</h1>
                </div>
                <div class="content">
                    <p>We're excited to have you on board! Start building your professional network now.</p>
                    <p>Complete your profile to stand out and connect with professionals in your field.</p>
                    <div class="button-container">
                        <a href="${profileUrl}" class="button">Complete Your Profile</a>
                    </div>
                </div>
                <div class="footer">
                    <p>If you did not sign up for this account, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const createConnectionAcceptedTemplate = (senderName, recipientName, profileUrl) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Connection Accepted</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #0073b1;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    text-align: center;
                    padding: 20px 0;
                    color: #333;
                }
                .content p {
                    font-size: 18px;
                    margin: 15px 0;
                }
                .button-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .button {
                    background-color: #0073b1;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding: 20px 0;
                    font-size: 14px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Connection Accepted</h1>
                </div>
                <div class="content">
                    <p>Hello ${recipientName},</p>
                    <p>${senderName} has accepted your connection request!</p>
                    <p>Check out their profile by clicking the button below.</p>
                    <div class="button-container">
                        <a href="${profileUrl}" class="button">View Profile</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Thank you for using LinkedIn Clone!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const createCommentedTemplate = (commentedBy, commentText, recipient, commentUrl) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Comment on Your Post</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #0073b1;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    text-align: center;
                    padding: 20px 0;
                    color: #333;
                }
                .content p {
                    font-size: 18px;
                    margin: 15px 0;
                }
                .comment-box {
                    background-color: #f4f4f4;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 16px;
                    font-style: italic;
                    color: #555;
                    margin: 10px 0;
                }
                .button-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .button {
                    background-color: #0073b1;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding: 20px 0;
                    font-size: 14px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Comment on Your Post</h1>
                </div>
                <div class="content">
                    <p>Hello ${recipient},</p>
                    <p>${commentedBy} has commented on your post:</p>
                    <div class="comment-box">
                        "${commentText}"
                    </div>
                    <p>Click the button below to view the full conversation.</p>
                    <div class="button-container">
                        <a href="${commentUrl}" class="button">View Comment</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Thank you for staying connected on LinkedIn Clone!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
