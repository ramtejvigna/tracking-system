import { User } from "../models/User.js";

// Register new user
export const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            role,
            department,
            phoneNumber
        } = req.body;

        // Check if user exists by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            role,
            department,
            phoneNumber
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users with filters & pagination
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, department, role, search } = req.query;
        
        let query = {};
        
        // Add filters
        if (department) query.department = department;
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await User.find(query)
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user by MongoDB _id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user (permanent)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const markAttended = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const today = new Date().toISOString().split("T")[0];

        const alreadyMarked = user.attend_stamps.some(stamp =>
            new Date(stamp).toISOString().startsWith(today)
        );

        if (alreadyMarked) {
            return res.status(400).json({ message: "Attendance already marked today" });
        }

        user.attend_stamps.push(new Date());
        await user.save();

        return res.status(200).json({ message: "Attendance marked successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Error marking attendance",
            error: error.message
        });
    }
};
