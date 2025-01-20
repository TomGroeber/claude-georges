import AnimatedLogin from '../components/LoginScreen';
import Users from '../pages/Users/Users';
import UserAddEdit from '../pages/Users/AddUpdateUser';
import ChangePassword from '../pages/ChangePassword';
import UserProfile from '../pages/Profile/ProfileScreen';
import Notification from '../pages/Notification/Notification';
import ManageBoundary from '../pages/Boundary/BoundaryScreen';
import UserProfileView from '../pages/Users/UserProfileView';
import Dashboard from '../pages/Dashboard/Dashboard';
import LeaveApplication from '../pages/LeaveApplication/leaveApplication';
import RequestScreen from '../pages/Request/requestScreen';
import LeaveApplicationAdmin from '../pages/LeaveApplication/leaveApplicationAdmin';
import NotFound from '../pages/404Page';
import CustomEvents from '../pages/CustomEvents/customEvents';
import AddEditCustomEvent from '../pages/CustomEvents/addEditCustomEvents';

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
    path: '/users',
    exact: true,
    name: 'Users',
    component: Users,
    private: false
  },
  {
    path: '/users/add-edit',
    exact: true,
    name: 'UsersAddEdit',
    component: UserAddEdit,
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
    path: '/boundaries',
    exact: true,
    name: 'Boundaries',
    component: ManageBoundary,
    private: false
  },
  {
    path: '/users/user-profile',
    exact: true,
    name: 'User Profile',
    component: UserProfileView,
    private: false
  },
  {
    path: '/leaves-notification',
    exact: true,
    name: 'Leave Application',
    component: LeaveApplication,
    private: false
  },
  {
    path: '/leaves',
    exact: true,
    name: 'Leaves',
    component: RequestScreen,
    private: false
  },
  {
    path: '/leaves-application',
    exact: true,
    name: 'Leaves Application',
    component: LeaveApplicationAdmin,
    private: false
  },
  {
    path: '/custom-events',
    exact: true,
    name: 'Custom Events',
    component: CustomEvents,
    private: false
  },
  {
    path: '/custom-events/add-edit',
    exact: true,
    name: 'Custom Events Add Edit',
    component: AddEditCustomEvent,
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
