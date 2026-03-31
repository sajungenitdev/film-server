const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        user.fullName = req.body.fullName || user.fullName;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        
        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        
        // Update avatar if provided
        if (req.body.avatar) {
            user.avatar = req.body.avatar;
        }
        
        const updatedUser = await user.save();
        
        res.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user stats (projects, tasks, etc.)
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    try {
        // Get counts from your database models
        // Adjust these based on your actual models
        
        const Project = require('../models/Project');
        const Task = require('../models/Task');
        const Contribution = require('../models/Contribution');
        
        const stats = {
            totalProjects: await Project.countDocuments({ userId: req.user.id }),
            completedTasks: await Task.countDocuments({ 
                userId: req.user.id, 
                status: 'completed' 
            }),
            pendingTasks: await Task.countDocuments({ 
                userId: req.user.id, 
                status: { $in: ['pending', 'in-progress'] } 
            }),
            contributions: await Contribution.countDocuments({ userId: req.user.id })
        };
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        // Return empty stats if models don't exist yet
        res.status(200).json({
            success: true,
            data: {
                totalProjects: 0,
                completedTasks: 0,
                pendingTasks: 0,
                contributions: 0
            }
        });
    }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/users/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await (require('../models/Project')?.countDocuments() || 0);
        const totalTasks = await (require('../models/Task')?.countDocuments() || 0);
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProjects,
                totalTasks,
                recentUsers: await User.find().sort('-createdAt').limit(5).select('-password')
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Keep your existing functions
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Update user fields
        user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        await user.remove();
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getUserStats
};