import cors from "cors";
import express from "express";
import { HfInference } from "@huggingface/inference";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let generatedEmail = "";

// 🔹 Use environment variables instead of hardcoded keys
const HF_API_KEY = process.env.HF_API_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
export const inference = new HfInference(HF_API_KEY);

app.post("/generate-email", async (req, res) => {
    const { sender, receiver, topic, email, specialinstructions } = req.body;

    if (!sender || !receiver || !topic) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const prompt = `Write a professional email from ${sender} to ${receiver} about ${topic} using these special instructions ${specialinstructions}`;

    try {
        const response = await inference.chatCompletion({
            model: HF_MODEL,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });

        generatedEmail = response.choices[0]?.message?.content || "Error generating email.";
        res.json({ email: generatedEmail });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to generate email", error });
    }
});

app.post("/send-email", async (req, res) => {
    const { sender, recipientEmail, emailContent } = req.body;

    if (!sender || !recipientEmail || !emailContent) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Setup Brevo API Client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications["api-key"].apiKey = BREVO_API_KEY;
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    console.log("Recipient Email:", recipientEmail);

    // 📩 Email Data
    const emailData = {
        sender: { name: sender, email: "emailgenerator321@gmail.com" }, // Use Brevo-verified email
        to: [{ email: recipientEmail }],
        subject: "Generated Email",
        htmlContent: `<p>${generatedEmail}</p>`,
    };

    try {
        const emailresp = await apiInstance.sendTransacEmail(emailData);
        console.log(emailresp);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
