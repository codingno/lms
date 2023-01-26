import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import {
  Container,
  Stack,
  Typography,
  Button,
	Input,
  Icon,
  Card,
  Select,
  MenuItem,
  FormControl,
  FilledInput,
  OutlinedInput,
	TextField,
	TextareaAutosize,
	FormLabel,
	FormControlLabel,
	FormHelperText,
	RadioGroup,
	Radio,
	CircularProgress,
} from "@mui/material";
import DatePicker from '@mui/lab/DatePicker';
import isWeekend from 'date-fns/isWeekend';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryList } from '../../store/actions/get/getCategories';

import { useNavigate, useLocation, useParams } from "react-router-dom";

// import './create-user.css'

function FormContainer(props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      ml={5}
      mt={2}
      sx={{ width: "60%", display: "flex", justifyContent: "flex-start" }}
    >
      <span style={{ width: "35%" }}>{props.label}</span>
      <FormControl sx={{ width: "65%" }} variant="outlined">
        <OutlinedInput
					type={props.type}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        />
				{ props.helper && <FormHelperText>{props.helper}</FormHelperText> }
      </FormControl>
    </Stack>
  );
}

function FormParent(props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      ml={5}
      mt={2}
      sx={{ width: "60%", display: "flex", justifyContent: "flex-start" }}
    >
      <span style={{ width: "35%" }}>{props.label}</span>
			{props.children}
    </Stack>
  );
}

function CreateCourse(props) {
  const { state } = useLocation();
	const { category_code, sub_category, course_code } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [categoryID, setCategoryID] = useState(null);
  const [courseID, setCourseID] = useState(null);
  const [topicID, setTopicID] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [shortname, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [image_url, setImageUrl] = useState("");
	const [courseStatus, setCourseStatus] = useState(1)

  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseFormat, setCourseFormat] = useState("single");
  const [courseCategoryName, setCourseCategoryName] = useState("");
  // const [categoryCode, setCategoryCode] = useState(state.category_code);
  const [mainCategories, setMainCategories] = useState([]);
  const [position, setPosition] = useState("");

  const [activity, setActivity] = useState(1);
	const [startDate, setStartDate] = useState(new Date().setDate(new Date().getDate()));
	const [endDate, setEndDate] = useState(new Date().setDate(new Date().getDate() + 1));

  const [numberOfTopics, setNumberOfTopics] = useState(4);
  const [nameOfTopics, setNameOfTopics] = useState("");

	const [isLoading, setLoading] = useState(false)
  const {user} = useSelector(state => state)

	async function getUserInfo() {
		setLoading(true)
		try {
			const user = await axios.get("/api/course/info/" + course_code);
			const { data } = user.data;
			setCourseID(data.id);
			setCourseName(data.name);
			setCode(data.code);
			setShortName(data.shortname);
			setDescription(data.description);
			setImageUrl(data.image_url);
			setCourseStatus(data.status);
			setCourseCategory(parseInt(data.category));
			setCourseCategoryName(data.category_name)
			// setCategoryCode(data.category_code)
			setPosition(parseInt(data.position))
			setLoading(false)
		} catch (error) {
			if (error.response) {
				alert(error.response.data);
				navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/list`);
			}
		}
	}

	async function getTopicInfo() {
		setLoading(true)
		try {
			const topic = await axios.get("/api/topic/info/" + state.code)
			const { data } = topic.data
			setTopicID(data.id)
			setName(data.name)
			setStartDate(data.startDate)
			setEndDate(data.endDate)
		} catch(error) {
			if (error.response) {
				alert(error.response.data);
				navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/${course_code}`, {state:{category_code, sub_category, course_code }})
			}
		}
	}

  useEffect(() => {
    if (course_code) getUserInfo();
    if (props.edit) getTopicInfo();

  }, []);

  useEffect(() => {
    if (mainCategories.length == 0) getRoles();

    async function getRoles() {
      try {
        const getCategoryData = await axios.get("/api/category");
        const { data } = getCategoryData.data;
				const categorySelected = data.filter(item => item.code === state.sub_category)[0]
				setCourseCategory(categorySelected.id)
				setCourseCategoryName(categorySelected.name)
				// setCategoryCode(categorySelected.code)
        setMainCategories(data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data);
          // props.setCreateUser(false)
      		// navigate("/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/"+state.category_code+"/"+state.sub_category);
        }
      }
    }

  }, [mainCategories]);

	const uploadImage = async () => {
		if(courseImage === "")
			return null
		const formData = new FormData();

		formData.append('course', courseImage);
		formData.append('folder', 'course');
		try {
      const file = await axios.post("/api/image/upload/course", 
				formData)
			return file
		} catch (error) {
			alert(error)	
		}
	}

  const createUser = async () => {
		setLoading(true)
		
    try {
			// const imageFile = await uploadImage()
      await axios.post("/api/topic/create", {
				course_id: courseID,
				name,
				// startDate : new Date(startDate),
				// endDate : new Date(endDate),
				startDate,
				endDate,
      });
      await dispatch(getCategoryList());
      alert(`Session created successfully.`);
      // props.setCreateUser(false)
      // navigate("/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/sub_category/"+categoryCode);
			gotoTopic(course_code, courseName, courseID)
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      }
    }
  };

  const updateUser = async () => {
		setLoading(true)
    try {
      await axios.patch("/api/topic/update", {
				id: topicID,
				course_id: courseID,
				name,
				// startDate : new Date(startDate).toLocaleString(),
				// endDate : new Date(endDate).toLocaleString(),
				startDate,
				endDate,
      });
      await dispatch(getCategoryList());
      alert(`Session updated successfully.`);
      // props.setCreateUser(false)
			gotoTopic(course_code, courseName, courseID)
      // navigate("/dashboard/courses/sub_category/"+categoryCode);
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      }
    }
  };

	const gotoTopic = (code, name, id) => {
		if(category_code && sub_category && code) {
			navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/${category_code}/${sub_category}/${code}/session`, { state : { course_name : name, course_id : id }})
		}
	}

  const mainCategoryList =
    mainCategories.length === 0
      ? ""
      : mainCategories.map((item) => <MenuItem value={item.id}>{item.code}</MenuItem>);
	
	const StackFormat = (props) => {
		return (
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}>{props.title}</span>
							{props.children}
						</Stack>
		)
	}

  return (
    <Page title="Create User | UIII LMS">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {props.edit ? "Edit" : "Create"} Session {courseName.length > 0 && `of ${courseName}`}
          </Typography>
        </Stack>

				{
					isLoading ?
					<CircularProgress /> :
        <Card>
          <Stack mb={4}>
            <FormContainer label="Name" value={name} setValue={setName} />
									<FormParent label="Session Start Date" >
											<DatePicker 
												ampm={false}
												// label="With keyboard"
												value={startDate}
												onChange={setStartDate}
												onError={alert}
												// shouldDisableDate={isWeekend}
												// disablePast
												inputFormat="dd-MM-yyyy HH:mm"
												renderInput={props => <TextField {...props}  /> }
											/>
									</FormParent>
									<FormParent label="Session End Date" >
											<DatePicker 
												ampm={false}
												// label="With keyboard"
												value={endDate}
												onChange={setEndDate}
												onError={alert}
												// shouldDisableDate={isWeekend}
												// disablePast
												// format="yyyy/MM/dd HH:mm"
												inputFormat="dd-MM-yyyy HH:mm"
												renderInput={props => <TextField {...props}  /> }
											/>
									</FormParent>
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              mb={5}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}></span>
              <Button
                variant="contained"
                // component={RouterLink}
                // to="#"
                onClick={props.edit ? updateUser : createUser}
                // startIcon={<Icon icon={plusFill} />}
              >
                {props.edit ? "Update" : "Create"}
              </Button>
            </Stack>
            {/* </form> */}
          </Stack>
        </Card>
				}
      </Container>
    </Page>
  );
}

export default CreateCourse;
