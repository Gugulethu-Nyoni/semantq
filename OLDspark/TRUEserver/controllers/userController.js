import { userService } from '../services/userService.js';

const userController = {
    // User registration
    async register(req, res) {
        try {
            const { first_name, surname, mobile, email, password } = req.body;

            // Call the service to insert user data into Supabase
            const data = await userService.createUser({
                first_name, surname, mobile, email, password
            });

            res.status(200).json({ message: 'Registration successful', data });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },

    // ✅ Add login method
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Call the service to authenticate the user
            const data = await userService.loginUser({ email });

            res.status(200).json({ message: 'Login successful', data });
        } catch (error) {
            res.status(401).json({ message: 'Login failed', error: error.message });
        }
    },



  async getUsers(req, res) {
    try {
        // Call the service to get all users (no need for authentication data here)
        const data = await userService.getUsers(); // Fetch all users

        if (data && data.length > 0) {
            res.status(200).json({ message: 'Users fetched successfully', data });
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}





};

export default userController;
