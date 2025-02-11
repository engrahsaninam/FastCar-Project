// adminSetup.js

const defaultAdminCredentials = {
    email: 'admin@123',
    password: 'admin@123' // This should be hashed in production
  };
  
  // Function to check if admin exists and create if not
  export const initializeAdmin = async () => {
    try {
      // This is where you would normally check your database
      // For now, we'll use localStorage as a simple example
      const adminExists = localStorage.getItem('adminInitialized');
      
      if (!adminExists) {
        // In a real application, this would be a database operation
        localStorage.setItem('adminCredentials', JSON.stringify(defaultAdminCredentials));
        localStorage.setItem('adminInitialized', 'true');
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
  };
  
  // Function to update admin password
  export const updateAdminPassword = async (newPassword) => {
    try {
      const admin = JSON.parse(localStorage.getItem('adminCredentials'));
      admin.password = newPassword;
      localStorage.setItem('adminCredentials', JSON.stringify(admin));
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };