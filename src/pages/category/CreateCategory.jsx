import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import {
  Container,
  Stack,
  Typography,
  Button,
  Icon,
  Card,
  Select,
  MenuItem,
  FormControl,
  FilledInput,
  OutlinedInput,
	TextareaAutosize,
	FormLabel,
	FormControlLabel,
	FormHelperText,
	RadioGroup,
	Radio,
	CircularProgress,
} from "@mui/material";
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

function CreateCategory(props) {
	const { category_code, sub_category } = useParams()
  const { pathname, state } = useLocation();
	const lastPathName = pathname.split('/').pop()
	const page = lastPathName === 'edit' ? sub_category ? 'edit_sub' : 'edit_parent' : category_code ? 'create_sub' : 'create_parent'
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [userID, setUserID] = useState(null);
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [code, setCode] = useState("");
  // const [role_id, setRoleID] = useState(7);
  // const [roles, setRoles] = useState([]);

  const [categoryID, setCategoryID] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
	const [categoryStatus, setCategoryStatus] = useState(1)

  const [subCategory, setSubCategory] = useState(category_code ? 1 : 0);
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [parent, setParent] = useState(category_code);
  const [position, setPosition] = useState("");

	const [isLoading, setLoading] = useState(false)
  const {user} = useSelector(state => state)

	async function getUserInfo() {
		setLoading(true)
		try {
			const code = page === 'edit_sub' ? sub_category : category_code
			const user = await axios.get("/api/category/info/" + code);
			const { data } = user.data;
			setCategoryID(data.id);
			setName(data.name);
			setCode(data.code);
			setDescription(data.description);
			setCategoryStatus(data.status);
			setParent(data.parent || "");
			setPosition(parseInt(data.position))
			setSubCategory(data.parent ? 1 : 0);
			setLoading(false)
		} catch (error) {
			if (error.response) {
				alert(error.response.data);
				navigate(`/dashboard/courses/${user.data.role_id == 3 || user.data.id == 4 ? 'teacher' : user.data.role}/category`);
			}
		}
	}

  useEffect(() => {
    if (lastPathName === 'edit') 
			getUserInfo()

  }, []);

  useEffect(() => {
    if (mainCategories.length == 0) getRoles();

    async function getRoles() {
      try {
        const getCategoryData = await axios.get("/api/category/main_category");
        const { data } = getCategoryData.data;
				const filterdData = data.filter(item => item.code !== code)
				const parentCategory = filterdData.filter(item => item.code === category_code)[0]
				setMainCategoryName(parentCategory.name)
        setMainCategories(filterdData);
      } catch (error) {
        if (error.response) {
          alert(error.response.data);
          // props.setCreateUser(false)
          navigate("/dashboard/courses/admin");
        }
      }
    }

  }, [mainCategories]);

	useEffect(() => {
		const isParent = mainCategories.filter(item => item.code === code)
		if(isParent.length > 0)
			setMainCategories(mainCategories.filter(item => item.code !== code ))
	}, [code])

  const createUser = async () => {
		
    try {
      await axios.post("/api/category/create", {
				name,
				code,
				description,
				parent,
				status : categoryStatus,	
      });
      await dispatch(getCategoryList());
      alert(`${category_code ? 'Sub ' : ''}Category created successfully.`);
      // props.setCreateUser(false)
			dispatch({ type : 'refresh_start'})
      // navigate("/dashboard/courses/admin");
      navigate(`/dashboard/courses/admin${ category_code ? '/' + category_code : ''}`);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const updateUser = async () => {
    try {
      await axios.patch("/api/category/update", {
        id: categoryID,
				name,
				code,
				description,
				parent,
				status : categoryStatus,	
      });
      await dispatch(getCategoryList());
      alert(`${category_code ? 'Sub ' : ''}Category updated successfully.`);
      // props.setCreateUser(false)
			dispatch({ type : 'refresh_start'})
      navigate(`/dashboard/courses/admin${ category_code ? '/' + category_code : ''}`);
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      }
    }
  };

  const mainCategoryList =
    mainCategories.length === 0
      ? ""
      : mainCategories.map((item) => <MenuItem value={item.code}>{item.code}</MenuItem>);

  return (
    <Page title="Create User | UIII LMS">
      <Container>
        <Stack
          // direction="row"
          // alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {/* {sub_category ? "Edit" : "Create"} { category_code ? 'Program Study ' : 'Category '}   */}
						{lastPathName === 'edit' ? "Edit" : "Create"} {page.split('_')[1] === 'sub' ? 'Program Study ' : 'Category '}
          </Typography>
          <Typography variant="h4" gutterBottom>
						{mainCategoryName ? 'of ' + mainCategoryName : ''}
          </Typography>
        </Stack>

				{
					isLoading ?
					<CircularProgress /> :
        <Card>
          <Stack mb={4}>
            {/* <form className="create-user-form" action=""> */}
            {/* <Stack direction="row" alignItems="center" ml={5} mt={5} >
							<span>
								First Name
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={firstname}
									onChange={e => setFirstname(e.target.value)}
								/>
							</FormControl>
						</Stack> */}
            <FormContainer label="Name" value={name} setValue={setName} />
            <FormContainer
              label="Category Code"
              value={code}
              setValue={setCode}
            />
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
              <span style={{ width: "35%" }}>Description</span>
              {/* <TextareaAutosize
                sx={{
                  padding: "5px",
                }}
                aria-label="minimum height"
                minRows={6}
                style={{ width: "65%" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              /> */}
              <textarea 
								name="description"
								cols="25"
								rows="10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
								style={{
                  padding: "14px",
									width: "65%"
								}}
							></textarea>
              {/* </label> */}
            </Stack>
            {/* <Stack direction="row" alignItems="center" ml={5} mt={2} >
							<span>
								Last Name
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={lastname}
									onChange={e => setLastname(e.target.value)} 
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} >
							<span>
								Username
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={username}
									onChange={e => setUsername(e.target.value)}
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "40%", display: "flex", justifyContent: "space-between"}} >
							<span>
								Email
							</span>
							<FormControl sx={{ width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "40%", display: "flex", justifyContent: "space-between"}} >
							<span>
								User Code
							</span>
							<FormControl sx={{ width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={code}
									onChange={e => setCode(e.target.value)}
								/>
							</FormControl>
						</Stack> */}
            {/* <label htmlFor="firstname">
							<input type="text" name="firstname" value={firstname} onChange={e => setFirstname(e.target.value)} />
						</label>
						<label htmlFor="lastname">
							<span>
							Last Name
							</span>
							<input type="text" name="lastname" 
							value={lastname}
							onChange={e => setLastname(e.target.value)} 
							/>
						</label>
						<label htmlFor="username">
							<span>
							Username
							</span>
							<input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} />
						</label>
						<label htmlFor="email">
							<span>
							Email
							</span>
							<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
						</label> */}
            <FormContainer label="Position" value={position} setValue={setPosition} type="number" helper="Fill number or blank" />
            {/* <Stack
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
              <span style={{ width: "35%" }}>Program Study?</span>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="subcategories"
                  name="radio-buttons-group"
                  value={subCategory}
                  onChange={(e) => setSubCategory(parseInt(e.target.value))}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
						{
							subCategory > 0 &&
							<>
            {mainCategories.length > 0 && (
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
                <span style={{ width: "35%" }}>Parent</span>
                <Select
									displayEmpty
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  inputProps={{ "aria-label": "Without label" }}
                >
									<MenuItem value={""}>
										<em>None</em>
									</MenuItem>
                  {mainCategoryList}
                </Select>
              </Stack>
            )}
							</> 
						} */}
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
              <span style={{ width: "35%" }}>Status</span>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="gender"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={categoryStatus}
                  onChange={(e) => setCategoryStatus(parseInt(e.target.value))}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Non Active"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            {/* <Stack direction="row" alignItems="center" ml={19} mt={2} mb={5} > */}
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
                onClick={lastPathName === 'edit' ? updateUser : createUser}
                // startIcon={<Icon icon={plusFill} />}
              >
                {lastPathName === 'edit' ? "Update" : "Create"}
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

export default CreateCategory;
