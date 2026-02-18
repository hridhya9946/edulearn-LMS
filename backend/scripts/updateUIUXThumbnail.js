import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const NEW_THUMBNAIL = "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

async function updateThumbnail() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);

        const courseSchema = new mongoose.Schema({
            title: String,
            thumbnail: String
        });

        const Course = mongoose.model('Course_Update', courseSchema, 'courses');

        const result = await Course.updateMany(
            { title: /UI\/UX Design Masterclass/i },
            { $set: { thumbnail: NEW_THUMBNAIL } }
        );

        console.log(`Matched ${result.matchedCount} courses, updated ${result.modifiedCount} courses.`);
        console.log('Thumbnail update complete! 🎨✨');

        process.exit(0);
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
}

updateThumbnail();
