import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Models
import { User } from '../models/user.schema';
import { Instructor } from '../models/instructor.schema';
import { Course } from '../models/course.schema';
import { Module } from '../models/module.schema';
import { Lesson } from '../models/lesson.schema';
import { LessonResource } from '../models/lesson_resource.schema';
import { RecordingCategory } from '../models/recording_category.schema';
import { Recording } from '../models/recording.schema';
import { LabPartner } from '../models/lab_partner.schema';
import { Banner } from '../models/banner.schema';
import { AdminSettings } from '../models/admin_settings.schema';

// Load seed data via require() so rootDir constraint doesn't apply
const seedDir = path.join(__dirname, '../../seed-data');
const usersData            = require(path.join(seedDir, 'users.seeder.json'));
const instructorsData      = require(path.join(seedDir, 'instructors.seeder.json'));
const coursesData          = require(path.join(seedDir, 'courses.seeder.json'));
const modulesData          = require(path.join(seedDir, 'modules.seeder.json'));
const lessonsData          = require(path.join(seedDir, 'lessons.seeder.json'));
const lessonResourcesData  = require(path.join(seedDir, 'lesson_resources.seeder.json'));
const recordingCategoriesData = require(path.join(seedDir, 'recording_categories.seeder.json'));
const recordingsData       = require(path.join(seedDir, 'recordings.seeder.json'));
const labPartnersData      = require(path.join(seedDir, 'lab_partners.seeder.json'));
const bannersData          = require(path.join(seedDir, 'banners.seeder.json'));
const adminSettingsData    = require(path.join(seedDir, 'admin_settings.seeder.json'));

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

const toObjectIdOrNull = (id: string | null) =>
  id ? new mongoose.Types.ObjectId(id) : null;

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  Connected to MongoDB\n');

  // ── Clear all collections ──────────────────────────────────────────────────
  console.log('🗑   Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Instructor.deleteMany({}),
    Course.deleteMany({}),
    Module.deleteMany({}),
    Lesson.deleteMany({}),
    LessonResource.deleteMany({}),
    RecordingCategory.deleteMany({}),
    Recording.deleteMany({}),
    LabPartner.deleteMany({}),
    Banner.deleteMany({}),
    AdminSettings.deleteMany({}),
  ]);
  console.log('✅  All collections cleared\n');

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log('👤  Seeding users...');
  const usersToInsert = await Promise.all(
    usersData.map(async (u: any) => ({
      _id: toObjectId(u._id),
      email: u.email,
      password: await bcrypt.hash(u.password, 10),
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      role: u.role,
      status: u.status,
      is_whitelisted: u.is_whitelisted,
      welcomeEmailSent: u.welcomeEmailSent,
    }))
  );
  await User.insertMany(usersToInsert);
  console.log(`   ✔  ${usersToInsert.length} users inserted`);
  console.log(`      admin@cliniclaunch.com   →  password: Admin@123456`);
  console.log(`      student@cliniclaunch.com →  password: Student@123456\n`);

  // ── Instructors ────────────────────────────────────────────────────────────
  console.log('🎓  Seeding instructors...');
  const instructorsToInsert = instructorsData.map((i: any) => ({
    _id: toObjectId(i._id),
    firstName: i.firstName,
    lastName: i.lastName,
    title: i.title,
    bio: i.bio,
    photo: i.photo,
    status: i.status,
  }));
  await Instructor.insertMany(instructorsToInsert);
  console.log(`   ✔  ${instructorsToInsert.length} instructors inserted\n`);

  // ── Courses ────────────────────────────────────────────────────────────────
  console.log('📚  Seeding courses...');
  const coursesToInsert = coursesData.map((c: any) => ({
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
  await Course.insertMany(coursesToInsert);
  console.log(`   ✔  ${coursesToInsert.length} courses inserted\n`);

  // ── Modules ────────────────────────────────────────────────────────────────
  console.log('📂  Seeding modules...');
  const modulesToInsert = modulesData.map((m: any) => ({
    _id: toObjectId(m._id),
    course: toObjectId(m.course),
    title: m.title,
    order: m.order,
  }));
  await Module.insertMany(modulesToInsert);
  console.log(`   ✔  ${modulesToInsert.length} modules inserted\n`);

  // ── Lessons ────────────────────────────────────────────────────────────────
  console.log('🎬  Seeding lessons...');
  const lessonsToInsert = lessonsData.map((l: any) => ({
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
  await Lesson.insertMany(lessonsToInsert);
  console.log(`   ✔  ${lessonsToInsert.length} lessons inserted\n`);

  // ── Lesson Resources ───────────────────────────────────────────────────────
  console.log('📎  Seeding lesson resources...');
  const resourcesToInsert = lessonResourcesData.map((r: any) => ({
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
  await LessonResource.insertMany(resourcesToInsert);
  console.log(`   ✔  ${resourcesToInsert.length} lesson resources inserted\n`);

  // ── Recording Categories ───────────────────────────────────────────────────
  console.log('🎙   Seeding recording categories...');
  const recCatsToInsert = recordingCategoriesData.map((rc: any) => ({
    _id: toObjectId(rc._id),
    name: rc.name,
    status: rc.status,
    order: rc.order,
  }));
  await RecordingCategory.insertMany(recCatsToInsert);
  console.log(`   ✔  ${recCatsToInsert.length} recording categories inserted\n`);

  // ── Recordings ─────────────────────────────────────────────────────────────
  console.log('📹  Seeding recordings...');
  const recordingsToInsert = recordingsData.map((r: any) => ({
    _id: toObjectId(r._id),
    category: toObjectId(r.category),
    title: r.title,
    subheading: r.subheading,
    videoEmbed: r.videoEmbed,
    recordedDate: r.recordedDate ? new Date(r.recordedDate) : null,
    status: r.status,
    order: r.order,
  }));
  await Recording.insertMany(recordingsToInsert);
  console.log(`   ✔  ${recordingsToInsert.length} recordings inserted\n`);

  // ── Lab Partners ───────────────────────────────────────────────────────────
  console.log('🔬  Seeding lab partners...');
  const labsToInsert = labPartnersData.map((l: any) => ({
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
  await LabPartner.insertMany(labsToInsert);
  console.log(`   ✔  ${labsToInsert.length} lab partners inserted\n`);

  // ── Banners ────────────────────────────────────────────────────────────────
  console.log('🖼   Seeding banners...');
  const bannersToInsert = bannersData.map((b: any) => ({
    _id: toObjectId(b._id),
    imageUrl: b.imageUrl,
    label: b.label,
    status: b.status,
    order: b.order,
  }));
  await Banner.insertMany(bannersToInsert);
  console.log(`   ✔  ${bannersToInsert.length} banners inserted\n`);

  // ── Admin Settings ─────────────────────────────────────────────────────────
  console.log('⚙️   Seeding admin settings...');
  const [settings] = adminSettingsData;
  await AdminSettings.create({
    discordInviteUrl: settings.discordInviteUrl,
    supportEmail: settings.supportEmail,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  });
  console.log(`   ✔  Admin settings inserted\n`);

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log('🎉  Database seeded successfully!');
  console.log('─'.repeat(50));
  console.log('Login credentials:');
  console.log('  Admin   →  admin@cliniclaunch.com   /  Admin@123456');
  console.log('  Student →  student@cliniclaunch.com /  Student@123456');
  console.log('─'.repeat(50));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seeder failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
