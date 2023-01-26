import { Navigate, useRoutes, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import CourseStudent from './pages/CourseStudent';
import LabTabs from './pages/courseDetail';
import Login from './pages/LoginLms';
// import Register from './pages/Register';
import Register from './pages/RegisterLms';
import ResetPassword from './pages/ResetPassword';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import Categories from './pages/Categories';
import NotFound from './pages/Page404';

import CreateUser from './pages/user/CreateUser';
import CreateCategory from './pages/category/CreateCategory';

import Course from './pages/Courses'
import CreateCourse from './pages/course/CreateCourse'
import Topics from './pages/Topics'
import CreateTopic from './pages/topic/CreateTopic'
import TopicActivity from './pages/TopicActivity'
import CreateTopicActivity from './pages/topicActivity/CreateTopicActivity'
import Enrollment from './pages/Enrollment'
import CalendarLayout from './pages/Calendar';
import Grade from './pages/Grade'
import Attendance from './pages/Attendance'
import StudentActivity from './pages/StudentActivity'
// import LabTabs from './pages/courseDetail';

// ----------------------------------------------------------------------

export default function Router() {
	const { category_code, sub_category, course_code } = useParams()
	const { user } = useSelector(state => state)

	const isLogin = (Component) => {
		return user.isLogin ? <Component /> : <Navigate to="/login" />
	}

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" /> },
        // { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'calendar', element: <CalendarLayout /> },
        { path: 'user',
					children: [
						{ element: <User />,},
						{ path: 'create', element: <CreateUser /> },
						{ path: ':user_id/edit', element: <CreateUser edit={true} /> },
					]
			 	},
        {
          path: 'courses',
          children: [
						{ path: 'admin',
              element: <Categories main_category={true}  /> },
						{ 
							path : 'admin/create', 
							element: <CreateCategory />,
						},
						{ 
							path : 'admin/:category_code', 
							element: <Categories main_category={true} />,
						},
						{ 
							path : 'admin/:category_code/edit', 
							element: <CreateCategory />,
						},
						{ 
							path : 'admin/:category_code/create', 
							element: <CreateCategory />,
						},
            { path: 'admin/:category_code/:sub_category', 
							children : [
								{ element: <Course />},
							]},
            { path: 'admin/:category_code/:sub_category/edit', element: <CreateCategory /> },
            { path: 'admin/:category_code/:sub_category/create', element: <CreateCourse /> },
            { path: 'admin/:category_code/:sub_category/:course_code/edit', element: <CreateCourse edit={true} /> },
						{ path: 'admin/:category_code/:sub_category/:course_code',
        			element: <Navigate to={`admin/${category_code}/${sub_category}/${course_code}/session`} />, 
						},
						{ path: 'admin/:category_code/:sub_category/:course_code/session',
							children: [
								{ element: <Topics/>},
								{ path : 'create', element : <CreateTopic />},
								{ path : 'edit', element : <CreateTopic edit={true} />},
								{ path : ':topic_id', 
									children: [
										{ element : <TopicActivity /> },
										{ path : 'attend', element : <Attendance />},
										{ path : ':topic_activity', element : <StudentActivity/>},
										{ path : ':topic_activity/student_activity', element : <StudentActivity />},
										{ path : 'create', element : <CreateTopicActivity />},
										{ path : 'edit', element : <CreateTopicActivity edit={true} />},
									]
								},
							]
						},
						{ path: 'admin/:category_code/:sub_category/:course_code/enrollment',
							children: [
								{ element: <Enrollment />},
							]
						},
						{ path: 'admin/:category_code/:sub_category/:course_code/grade',
							children: [
								{ element: <Grade />},
							]
						},
            { path: 'admin/category', 
							children: [
								{ element: <Categories /> },
								// { path: 'create', element: <CreateCategory /> },
								{ path: 'edit', element: <CreateCategory edit={true} /> },
							]
					 	},
            { path: 'admin/main_category', 
							children : [
								{ element: <Categories main_category={true}  /> },
								{ 
									path : ':category_code', 
									element: <Categories main_category={true} />,
								}
							]},
            { path: 'main_category/:category_code/:sub_category', 
							children : [
								{ element: <Course /> },
							]},
            { path: 'admin/list', element: <Course /> },
            { path: 'admin/create', element: <CreateCourse /> },
            { path: 'admin/edit', element: <CreateCourse edit={true} /> },
            { path: 'student', element: <CourseStudent /> },
            { path: "student/:course_id/detail", element: <LabTabs />},
						{ path: 'teacher',
              element: <Categories main_category={true}  /> },
						{ 
							path : 'teacher/:category_code', 
							element: <Categories main_category={true} />,
						},
            { path: 'teacher/:category_code/:sub_category', 
							children : [
								{ element: <Course />},
							]},
            { path: 'teacher/:category_code/:sub_category/create', element: <CreateCourse /> },
            { path: 'teacher/:category_code/:sub_category/:course_code/edit', element: <CreateCourse edit={true} /> },
						{ path: 'teacher/:category_code/:sub_category/:course_code',
        			element: <Navigate to={`teacher/${category_code}/${sub_category}/${course_code}/session`} />, 
						},
						{ path: 'teacher/:category_code/:sub_category/:course_code/session',
							children: [
								{ element: <Topics/>},
								{ path : 'create', element : <CreateTopic />},
								{ path : 'edit', element : <CreateTopic edit={true} />},
								{ path : ':topic_id', 
									children: [
										{ element : <TopicActivity /> },
										{ path : 'attend', element : <Attendance />},
										{ path : ':topic_activity', element : <StudentActivity/>},
										{ path : ':topic_activity/student_activity', element : <StudentActivity />},
										{ path : 'create', element : <CreateTopicActivity />},
										{ path : 'edit', element : <CreateTopicActivity edit={true} />},
									]
								},
							]
						},
						{ path: 'teacher/:category_code/:sub_category/:course_code/enrollment',
							children: [
								{ element: <Enrollment />},
							]
						},
						{ path: 'teacher/:category_code/:sub_category/:course_code/grade',
							children: [
								{ element: <Grade />},
							]
						},
            // { path: 'enrollment', element: <Products /> },
          ]
        },
        { path: 'activity', element: <Products /> },
        { path: 'resources', element: <Products /> },
        { path: 'grades', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
		{ path: '/login', element: !user.isLogin ? <Login /> : <Navigate to="/" /> },
		{ path: '/register', element: !user.isLogin ? <Register /> : <Navigate to="/" />},
		{ path: '/resetPassword/:token', element: !user.isLogin ? <ResetPassword /> : <Navigate to="/" />},
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: !user.isLogin ? <Navigate to="/login" /> : <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
