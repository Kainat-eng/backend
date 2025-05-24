import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../Models/User.js';
import Role from '../Models/Role.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(401).send('User already exists with this email');
        }

        // Assign default role
        const defaultRole = await Role.findOne({ name: 'user' });
        if (!defaultRole) {
            return res.status(500).json({ message: 'Default user role not found' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await Users.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: defaultRole._id,
        });

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email, role: defaultRole.name },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        user.token = token;
        user.password = undefined;  // Hide the password in the response

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with populated role and permissions
        const user = await Users.findOne({ email }).populate({
            path: 'role',
            populate: { path: 'permissions' },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role.name },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Cookie options
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        };

        user.password = undefined;

        // Set cookie with token and return user info
        return res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role.name,
                permissions: user.role.permissions.map(p => p.name),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Assign a role to a user by role name
export const assignRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        // Find role by name
        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Update user's role
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { role: role._id },
            { new: true }
        ).populate('role');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Role assigned successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning role', error });
    }
};

// Get all users
export const getAllUsers = async (_req, res) => {
    try {
        const users = await Users.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Update user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    try {
        const updateData = { firstname, lastname, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Admin dashboard (test route)
export const adminDashboard = (_req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard!' });
};
