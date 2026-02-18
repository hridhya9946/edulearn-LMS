import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "Learning Management System"
        },
        siteDescription: {
            type: String,
            default: "Online Learning Platform"
        },
        logo: {
            type: String,
            default: ""
        },
        favicon: {
            type: String,
            default: ""
        },
        emailSettings: {
            smtpHost: String,
            smtpPort: Number,
            smtpUser: String,
            smtpPassword: String,
            fromEmail: String,
            fromName: String
        },
        paymentGateway: {
            provider: {
                type: String,
                enum: ["stripe", "paypal", "razorpay", "none"],
                default: "none"
            },
            apiKey: String,
            secretKey: String,
            webhookSecret: String
        },
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        allowRegistration: {
            type: Boolean,
            default: true
        },
        defaultUserRole: {
            type: String,
            enum: ["student", "instructor"],
            default: "student"
        }
    },
    { timestamps: true }
);

export default mongoose.model("SystemSettings", systemSettingsSchema);
