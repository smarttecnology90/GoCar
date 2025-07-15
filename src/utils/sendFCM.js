import axios from "axios";

export const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
  try {
    const message = {
      to: fcmToken,
      notification: {
        title,
        body
      },
  
      data
    };

    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      message,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${process.env.FCM_SERVER_KEY}`, // ضيفي المفتاح ده في .env
        }
      }
    );

    console.log("📨 تم إرسال الإشعار:", response.data);
  } catch (error) {
    console.error("❌ فشل الإرسال:", error.response?.data || error.message);
  }
};
