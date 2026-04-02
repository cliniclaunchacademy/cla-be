"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const user_schema_1 = require("../models/user.schema");
const instructor_schema_1 = require("../models/instructor.schema");
const course_schema_1 = require("../models/course.schema");
const module_schema_1 = require("../models/module.schema");
const lesson_schema_1 = require("../models/lesson.schema");
const lesson_resource_schema_1 = require("../models/lesson_resource.schema");
const recording_category_schema_1 = require("../models/recording_category.schema");
const recording_schema_1 = require("../models/recording.schema");
const lab_partner_schema_1 = require("../models/lab_partner.schema");
const banner_schema_1 = require("../models/banner.schema");
const admin_settings_schema_1 = require("../models/admin_settings.schema");
const seedDir = path_1.default.join(__dirname, '../../seed-data');
const usersData = require(path_1.default.join(seedDir, 'users.seeder.json'));
const instructorsData = require(path_1.default.join(seedDir, 'instructors.seeder.json'));
const coursesData = require(path_1.default.join(seedDir, 'courses.seeder.json'));
const modulesData = require(path_1.default.join(seedDir, 'modules.seeder.json'));
const lessonsData = require(path_1.default.join(seedDir, 'lessons.seeder.json'));
const lessonResourcesData = require(path_1.default.join(seedDir, 'lesson_resources.seeder.json'));
const recordingCategoriesData = require(path_1.default.join(seedDir, 'recording_categories.seeder.json'));
const recordingsData = require(path_1.default.join(seedDir, 'recordings.seeder.json'));
const labPartnersData = require(path_1.default.join(seedDir, 'lab_partners.seeder.json'));
const bannersData = require(path_1.default.join(seedDir, 'banners.seeder.json'));
const adminSettingsData = require(path_1.default.join(seedDir, 'admin_settings.seeder.json'));
const toObjectId = (id) => new mongoose_1.default.Types.ObjectId(id);
const toObjectIdOrNull = (id) => id ? new mongoose_1.default.Types.ObjectId(id) : null;
async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌  MONGODB_URI is not set in .env');
        process.exit(1);
    }
    await mongoose_1.default.connect(uri);
    console.log('✅  Connected to MongoDB\n');
    console.log('🗑   Clearing existing data...');
    await Promise.all([
        user_schema_1.User.deleteMany({}),
        instructor_schema_1.Instructor.deleteMany({}),
        course_schema_1.Course.deleteMany({}),
        module_schema_1.Module.deleteMany({}),
        lesson_schema_1.Lesson.deleteMany({}),
        lesson_resource_schema_1.LessonResource.deleteMany({}),
        recording_category_schema_1.RecordingCategory.deleteMany({}),
        recording_schema_1.Recording.deleteMany({}),
        lab_partner_schema_1.LabPartner.deleteMany({}),
        banner_schema_1.Banner.deleteMany({}),
        admin_settings_schema_1.AdminSettings.deleteMany({}),
    ]);
    console.log('✅  All collections cleared\n');
    console.log('👤  Seeding users...');
    const usersToInsert = await Promise.all(usersData.map(async (u) => ({
        _id: toObjectId(u._id),
        email: u.email,
        password: await bcryptjs_1.default.hash(u.password, 10),
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        role: u.role,
        status: u.status,
        is_whitelisted: u.is_whitelisted,
        welcomeEmailSent: u.welcomeEmailSent,
    })));
    await user_schema_1.User.insertMany(usersToInsert);
    console.log(`   ✔  ${usersToInsert.length} users inserted`);
    console.log(`      admin@cliniclaunch.com   →  password: Admin@123456`);
    console.log(`      student@cliniclaunch.com →  password: Student@123456\n`);
    console.log('🎓  Seeding instructors...');
    const instructorsToInsert = instructorsData.map((i) => ({
        _id: toObjectId(i._id),
        firstName: i.firstName,
        lastName: i.lastName,
        title: i.title,
        bio: i.bio,
        photo: i.photo,
        status: i.status,
    }));
    await instructor_schema_1.Instructor.insertMany(instructorsToInsert);
    console.log(`   ✔  ${instructorsToInsert.length} instructors inserted\n`);
    console.log('📚  Seeding courses...');
    const coursesToInsert = coursesData.map((c) => ({
        _id: toObjectId(c._id),
        title: c.title,
        subheading: c.subheading,
        about: c.about,
        thumbnail: c.thumbnail,
        banner: c.banner,
        instructor: toObjectId(c.instructor),
        status: c.status,
        comingSoon: c.comingSoon,
        releaseDate: c.releaseDate ? new Date(c.releaseDate) : null,
        order: c.order,
    }));
    await course_schema_1.Course.insertMany(coursesToInsert);
    console.log(`   ✔  ${coursesToInsert.length} courses inserted\n`);
    console.log('📂  Seeding modules...');
    const modulesToInsert = modulesData.map((m) => ({
        _id: toObjectId(m._id),
        course: toObjectId(m.course),
        title: m.title,
        order: m.order,
    }));
    await module_schema_1.Module.insertMany(modulesToInsert);
    console.log(`   ✔  ${modulesToInsert.length} modules inserted\n`);
    console.log('🎬  Seeding lessons...');
    const lessonsToInsert = lessonsData.map((l) => ({
        _id: toObjectId(l._id),
        module: toObjectId(l.module),
        course: toObjectId(l.course),
        title: l.title,
        subheading: l.subheading,
        videoEmbed: l.videoEmbed,
        status: l.status,
        comingSoon: l.comingSoon,
        releaseDate: l.releaseDate ? new Date(l.releaseDate) : null,
        order: l.order,
    }));
    await lesson_schema_1.Lesson.insertMany(lessonsToInsert);
    console.log(`   ✔  ${lessonsToInsert.length} lessons inserted\n`);
    console.log('📎  Seeding lesson resources...');
    const resourcesToInsert = lessonResourcesData.map((r) => ({
        _id: toObjectId(r._id),
        lesson: toObjectId(r.lesson),
        course: toObjectId(r.course),
        title: r.title,
        type: r.type,
        url: r.url,
        description: r.description,
        status: r.status,
        order: r.order,
    }));
    await lesson_resource_schema_1.LessonResource.insertMany(resourcesToInsert);
    console.log(`   ✔  ${resourcesToInsert.length} lesson resources inserted\n`);
    console.log('🎙   Seeding recording categories...');
    const recCatsToInsert = recordingCategoriesData.map((rc) => ({
        _id: toObjectId(rc._id),
        name: rc.name,
        status: rc.status,
        order: rc.order,
    }));
    await recording_category_schema_1.RecordingCategory.insertMany(recCatsToInsert);
    console.log(`   ✔  ${recCatsToInsert.length} recording categories inserted\n`);
    console.log('📹  Seeding recordings...');
    const recordingsToInsert = recordingsData.map((r) => ({
        _id: toObjectId(r._id),
        category: toObjectId(r.category),
        title: r.title,
        subheading: r.subheading,
        videoEmbed: r.videoEmbed,
        recordedDate: r.recordedDate ? new Date(r.recordedDate) : null,
        status: r.status,
        order: r.order,
    }));
    await recording_schema_1.Recording.insertMany(recordingsToInsert);
    console.log(`   ✔  ${recordingsToInsert.length} recordings inserted\n`);
    console.log('🔬  Seeding lab partners...');
    const labsToInsert = labPartnersData.map((l) => ({
        _id: toObjectId(l._id),
        name: l.name,
        subheading: l.subheading,
        logo: l.logo,
        portalUrl: l.portalUrl,
        applicationEmbed: l.applicationEmbed,
        status: l.status,
        releaseDate: l.releaseDate ? new Date(l.releaseDate) : null,
        maintenanceMsg: l.maintenanceMsg,
        order: l.order,
    }));
    await lab_partner_schema_1.LabPartner.insertMany(labsToInsert);
    console.log(`   ✔  ${labsToInsert.length} lab partners inserted\n`);
    console.log('🖼   Seeding banners...');
    const bannersToInsert = bannersData.map((b) => ({
        _id: toObjectId(b._id),
        imageUrl: b.imageUrl,
        label: b.label,
        status: b.status,
        order: b.order,
    }));
    await banner_schema_1.Banner.insertMany(bannersToInsert);
    console.log(`   ✔  ${bannersToInsert.length} banners inserted\n`);
    console.log('⚙️   Seeding admin settings...');
    const [settings] = adminSettingsData;
    await admin_settings_schema_1.AdminSettings.create({
        discordInviteUrl: settings.discordInviteUrl,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
    });
    console.log(`   ✔  Admin settings inserted\n`);
    console.log('🎉  Database seeded successfully!');
    console.log('─'.repeat(50));
    console.log('Login credentials:');
    console.log('  Admin   →  admin@cliniclaunch.com   /  Admin@123456');
    console.log('  Student →  student@cliniclaunch.com /  Student@123456');
    console.log('─'.repeat(50));
    await mongoose_1.default.disconnect();
    process.exit(0);
}
seed().catch((err) => {
    console.error('❌  Seeder failed:', err);
    mongoose_1.default.disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map