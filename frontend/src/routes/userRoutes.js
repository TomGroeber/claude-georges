import AnimatedLogin from '../components/LoginScreen';
import ChangePassword from '../pages/ChangePassword';
import UserProfile from '../pages/Profile/ProfileScreen';
import Notification from '../pages/Notification/Notification';
import HistoryScreen from '../pages/History/HistoryScreen';
import Dashboard from '../pages/Dashboard/Dashboard';
import AddLeaveScreen from '../pages/History/AddLeave';
import NotFound from '../pages/404Page';

const routes = [
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: AnimatedLogin,
    private: false
  },
  {
    path: '/dashboard',
    exact: true,
    name: 'Dashboard',
    component: Dashboard,
    private: false
  },
  {
    path: '/change-password',
    exact: true,
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    path: '/profile',
    exact: true,
    name: 'UserProfile',
    component: UserProfile,
    private: false
  },
  {
    path: '/notification',
    exact: true,
    name: 'Notification',
    component: Notification,
    private: false
  },
  {
    path: '/leaves',
    exact: true,
    name: 'Leaves',
    component: HistoryScreen,
    private: false
  },
  {
    path: '/leaves/apply',
    exact: true,
    name: 'LeavesApply',
    component: AddLeaveScreen,
    private: false
  },
  {
    path: '*',
    exact: true,
    name: 'Not Found',
    component: NotFound,
    private: false
  },
];

export default routes;
