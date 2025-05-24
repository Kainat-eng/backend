import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './Models/Role.js';
import User from './Models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createRoles = async () => {
    const roles = [
        { name: 'Admin', permissions: [] },
        { name: 'ServerAdmin', permissions: [] },
        { name: 'user', permissions: [] },
    ];

    await Role.deleteMany({});
    await Role.insertMany(roles);
    console.log('✅ Roles seeded successfully');
};

const createAdminUsers = async () => {
    const adminRole = await Role.findOne({ name: 'Admin' });
    const serverAdminRole = await Role.findOne({ name: 'ServerAdmin' });

    if (!adminRole || !serverAdminRole) {
        console.log('❌ Roles must be seeded first');
        return;
    }

    const hashedAdminPassword = await bcrypt.hash('abc123', 10);
    const hashedServerAdminPassword = await bcrypt.hash('abc123', 10);

    const existingAdmin = await User.findOne({ email: 'kainat@servereye.com' });
    if (!existingAdmin) {
        await User.create({
            firstname: 'Kainat',
            lastname: 'Ahmed',
            email: 'kainat@servereye.com',
            password: hashedAdminPassword,
            role: adminRole._id,
        });
        console.log('✅ Admin user created');
    } else {
        console.log('ℹ️ Admin user already exists');
    }

    const existingServerAdmin = await User.findOne({ email: 'serveradmin@example.com' });
    if (!existingServerAdmin) {
        await User.create({
            firstname: 'Server',
            lastname: 'Admin',
            email: 'serveradmin@example.com',
            password: hashedServerAdminPassword,
            role: serverAdminRole._id,
        });
        console.log('✅ ServerAdmin user created');
    } else {
        console.log('ℹ️ ServerAdmin user already exists');
    }
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('🔌 MongoDB connected');

        await createRoles();
        await createAdminUsers();

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();

