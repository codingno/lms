import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
	CircularProgress,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { CategoryListHead, CategoryListToolbar, CategoryMoreMenu } from '../components/_dashboard/course';

// import CreateUser from './user/CreateUser';
import BreadCrumb from '../components/Breadcrumb'
//
import { getCourseList } from '../store/actions/get/getCourses';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'shortname', label: 'Short Name', alignRight: false },
  // { id: 'code', label: 'Course Code', alignRight: false },
  // { id: 'category', label: 'Category', alignRight: false },
  // { id: 'position', label: 'Position', alignRight: false },
  { id: 'course_image', label: 'CourseImage', alignRight: false },
  { id: 'status', label: 'Status', alignRight: true },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Courses(props) {
	const {category_code, sub_category} = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {courseList, refresh, user}= useSelector((state) => state);
  // const [courseList1, setCourseList] = useState([]);

	const [subCategory, setSubCategory] = useState({})

	const [isLoading, setLoading] = useState(false)
  const courses = courseList.data.length > 2 ? JSON.parse(courseList.data).filter(data => {
    return (user.data.role_id == 1 || (data.user_enrollment && data.user_enrollment.split(',').indexOf(user.data.id.toString()) >= 0) || data.createdBy == user.data.id)
    
  }) : []
	async function getDataCategoryList(){
			setLoading(true)
			try {
				await dispatch(getCourseList(null, {category_code : sub_category}));
				setLoading(false)
				dispatch({type : 'refresh_done'})
			} catch(error) {

			}
	}

	async function getSubCategoryName() {
		try {
			const { data } = await axios.get('/api/category/info/'+sub_category)
			setSubCategory(data.data)
		} catch (error) {
			alert(error)	
		}
	}

  useEffect(() => {
		if (refresh) {
  	  getDataCategoryList();
			getSubCategoryName()
		}
  }, [refresh]);

  useEffect(() => {
		if (sub_category) {
			dispatch({type : 'refresh_start'})
		}
  }, [sub_category]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = courses.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

	const gotoTopic = (code, name, id) => {
		if(category_code && sub_category && code) {
			navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/${code}/session`, { state : { course_name : name, course_id : id }})
		}
	}

	const gotoEnrollment = (code, name, id) => {
		if(category_code && sub_category && code) {
			navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/${code}/enrollment`, { state : { course_name : name, course_id : id }})
		}
	}

	const gotoGrade = (code, name, id) => {
		if(category_code && sub_category && code) {
			navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/${code}/grade`, { state : { course_name : name, course_id : id }})
		}
	}

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

  const filteredUsers = courseList.data ? applySortFilter(courseList.data.length > 0 ? courses : [], getComparator(order, orderBy), filterName) : [];
  const isUserNotFound = filteredUsers.length === 0;
  // return categoryList.data && ( 
  return ( 
    <Page title="Courses | UIII LMS">
      <Container>
				{/* <Stack sx={{ marginBottom: '3em'}}>
					<BreadCrumb />
				</Stack> */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses { subCategory.name ? 'of ' + subCategory.name : ''}
          </Typography>
          <Button
            variant="contained"
            // component={RouterLink}
            // to="#"
						// onClick={() => setCreateUser(true)}
						onClick={() => {
							navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/create`, {state:{category_code, sub_category}})
						}}
            startIcon={<Icon icon={plusFill} />}
          >
            Add Courses
          </Button>
        </Stack>

        <Card>
          <CategoryListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
						refresh={() => dispatch({type : 'refresh_start'})}
          />

          <Scrollbar>
					{
						isLoading ?
						<div style={{ margin: 'auto', display: 'flex', justifyContent: 'center'}}>
							<CircularProgress /> 
						</div> :
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={courses.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, shortname, code, category_code, position, status, image_url, user_enrollment, createdBy } = row;
                      const isItemSelected = selected.indexOf(code) !== -1;
                      // if(user.role_id == 1 || user_enrollment.split(',').indexOf(user.id) >= 0 || createdBy == user.id)
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, code)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none"
														// sx={{ cursor : 'pointer'}}													
													>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
																{name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* <TableCell align="left">{shortname}</TableCell>
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="left">{category_code}</TableCell>
                          <TableCell align="left">{position || "None"}</TableCell> */}
                          {/* <TableCell align="left">
														<Button
															onClick={() => gotoTopic(code, name, id)}
														>
															Manage Session
														</Button>
													</TableCell>
                          <TableCell align="left">
														<Button
															onClick={() => gotoTopic(code, name, id)}
														>
															Manage Enrollment
														</Button>
													</TableCell> */}
                          <TableCell align="left">
														{
															image_url.length > 0 &&
															<img src={window.location.origin + '/' + image_url} width={100} />
														}
													</TableCell>
                          <TableCell align="right">{status || "None"}</TableCell>
                          {<TableCell align="right">
                            <CategoryMoreMenu 
															code={code} 
															name={name}
															gotoTopic={() => gotoTopic(code, name, id)} 
															gotoEnrollment={() => gotoEnrollment(code, name, id)} 
															gotoGrade={() => gotoGrade(code, name, id)} 
															/>
                          </TableCell>}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
					}
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courseList.data ? courses.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
