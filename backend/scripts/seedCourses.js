import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const instructorId = '699352a7a983cc6880433eac'; // From previous search

const courses = [
    {
        title: "Mastering React 18: The Complete Guide",
        description: "Learn React from scratch to advanced concepts like Concurrent Mode, Suspense, and Hooks. Build massive real-world applications.",
        price: 3999,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Web Development",
        level: "Intermediate",
        status: "published",
        instructor: instructorId,
        modules: [
            {
                title: "Introduction to React",
                lessons: [
                    { title: "What is React?", type: "video", contentUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", duration: 10 },
                    { title: "Setting up your Dev Environment", type: "video", contentUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", duration: 15 }
                ]
            },
            {
                title: "Hooks & State Management",
                lessons: [
                    { title: "useState and useEffect", type: "video", contentUrl: "https://www.youtube.com/watch?v=hQAHSlTtcmY", duration: 25 },
                    { title: "Custom Hooks", type: "video", contentUrl: "https://www.youtube.com/watch?v=6ThXsBCMizg", duration: 20 }
                ]
            }
        ]
    },
    {
        title: "UI/UX Design Masterclass with Figma",
        description: "Master Figma and learn the principles of modern UI/UX design. Design stunning web and mobile interfaces that wow users.",
        price: 2499,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        category: "Design",
        level: "Beginner",
        status: "published",
        instructor: instructorId,
        modules: [
            {
                title: "Design Foundations",
                lessons: [
                    { title: "Color Theory and Typography", type: "video", contentUrl: "https://www.youtube.com/watch?v=mD0VAnvRzO4", duration: 30 },
                    { title: "Grid Systems and Layouts", type: "video", contentUrl: "https://www.youtube.com/watch?v=0kI8mR1Tzpw", duration: 20 }
                ]
            }
        ]
    },
    {
        title: "Advanced Python for Data Science",
        description: "Go beyond basics. Learn Pandas, NumPy, Matplotlib and build predictive models with Scikit-Learn.",
        price: 4999,
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Information Technology",
        level: "Advanced",
        status: "published",
        instructor: instructorId,
        modules: [
            {
                title: "Data Manipulation with Pandas",
                lessons: [
                    { title: "Pandas DataFrames", type: "video", contentUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: 40 },
                    { title: "Cleaning Messy Data", type: "video", contentUrl: "https://www.youtube.com/watch?v=K8L6KVGG-7o", duration: 35 }
                ]
            }
        ]
    }
];

async function seed() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // We need to use the actual model from the file or redefine it here
        const lessonSchema = new mongoose.Schema({
            title: String,
            description: String,
            type: String,
            contentUrl: String,
            videoUrl: String,
            duration: Number
        });

        const moduleSchema = new mongoose.Schema({
            title: String,
            lessons: [lessonSchema]
        });

        const courseSchema = new mongoose.Schema({
            title: String,
            description: String,
            price: Number,
            thumbnail: String,
            category: String,
            level: String,
            status: String,
            instructor: mongoose.Schema.Types.ObjectId,
            modules: [moduleSchema],
            lessons: [lessonSchema],
            enrollmentCount: { type: Number, default: 0 }
        });

        const Course = mongoose.model('Course_Seed', courseSchema, 'courses');

        await Course.insertMany(courses);
        console.log('Courses seeded successfully! 🎓🌱');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
