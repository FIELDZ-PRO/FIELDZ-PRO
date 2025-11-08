// Admin Feature - Public API
// This file exports the public interface of the admin feature

// Pages
export { default as AdminDashboard } from './pages/AdminDashboard';
export { default as AdminClubs } from './pages/AdminClubs';
export { default as AdminJoueurs } from './pages/AdminJoueurs';
export { default as AdminLogin } from './pages/AdminLogin';

// Components
export { default as AdminLayout } from './components/AdminLayout';

// Services
export * from './services/adminService';
