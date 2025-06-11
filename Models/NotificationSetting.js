// // models/NotificationSetting.js
// import mongoose from 'mongoose';

// const notificationSettingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   emailNotifications: { type: Boolean, default: true },
//   smsNotifications: { type: Boolean, default: false },
//   alertTypes: [String], // e.g. ['downtime', 'cpu', 'security']
// });

// const NotificationSetting = mongoose.model('NotificationSetting', notificationSettingSchema);
// export default NotificationSetting;
