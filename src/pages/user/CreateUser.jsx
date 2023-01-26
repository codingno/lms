import React, { useState, useEffect } from 'react'
import Page from '../../components/Page'
import {
  Container,
  Stack,
  Typography,
  Button,
	Input,
	InputAdornment,
  Icon,
	IconButton,
  Card,
  Select,
  MenuItem,
	Modal,
  FormControl,
  FilledInput,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { getUserList } from '../../store/actions/get/getUser'

import { useNavigate, useLocation, useParams } from 'react-router-dom'

// import './create-user.css'

function FormContainer({ label, type, value, setValue, endAdorment }) {
	return (
		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
			<span style={{ width : "35%"}}>
				{label}
			</span>
			<FormControl sx={{ width: '65%' }} variant="outlined">
				<OutlinedInput
					type={type || 'text'}
					value={value}
					onChange={e => setValue(e.target.value)}
					endAdornment={endAdorment ? endAdorment : ''}
				/>
			</FormControl>
		</Stack>
	)
}

function CreateUser(props) {
	const { user_id } = useParams()
	const { state } = useLocation();
	const { user } = useSelector(state => state)
  const navigate = useNavigate()
	const dispatch = useDispatch()
	const [userID, setUserID] = useState("")
	const [firstname, setFirstname] = useState("")
	const [lastname, setLastname] = useState("")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(0)
	const [showModalPassword, setShowModalPassword] = useState(false)
	const [currentPassword, setCurrentPassword] = useState("")
	const [code, setCode] = useState("")
	const [role_id, setRoleID] = useState(7)
	const [roles, setRoles] = useState([])

  const [userImage, setUserImage] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [userData, setUserData] = useState({});

	const [isLoading, setLoading] = useState(false)

	const isAdmin = user.data.role_id === 1
	const isOwn = user.data.id === parseInt(user_id)
	
	async function getUserInfo() {
		setLoading(true)
		try {
			const user = await axios.get('/api/user/info/'+ user_id)	
			const { data } = user.data
			if(!data)
				throw Error('User not found')
			setUserID(data.id)
			setFirstname(data.firstname)
			setLastname(data.lastname)
			setUsername(data.username)
			setEmail(data.email)
			setCode(data.code)
			if(data.photo)
				if(typeof(data.photo) !== 'null')
					setImageUrl(window.location.origin + "/" + data.photo);
			setRoleID(data.roles.id)
			setLoading(false)
			setUserData(data)
		} catch (error) {
			if(error.response) {
				alert(error.response.data)
			}
			else alert(error)
			navigate('/dashboard/user')
		}
	}

	useEffect(() => {
		if(props.edit || user_id ) {
			if(user) {
				if(!isAdmin && !isOwn) {
					alert(`You don't have permission to access this features`)
					return navigate('/')
				}
			}
			getUserInfo()
		}

	}, [])

	useEffect(() => {
		if(roles.length == 0 && isAdmin)
			getRoles()

		async function getRoles() {
			try {
				const getRolesData = await axios.get('/api/user/roles')
				setRoles(getRolesData.data.data)
			} catch (error) {
				if(error.response) {
					alert(error.response.data)
					// props.setCreateUser(false)
					navigate('/dashboard/user')
				}
			}
		}
			
	}, [roles])

	const uploadFileHandle = e => {
		if(e.target.files[0]) {
		 setUserImage(e.target.files[0])
		 setImageUrl(URL.createObjectURL(e.target.files[0]))
		}
	}

	const uploadImage = async () => {
		if(userImage === "")
			return null
		const formData = new FormData();

		formData.append('user', userImage);
		formData.append('folder', 'user');
		try {
      const file = await axios.post("/api/image/upload/user", 
				formData)
			return file
		} catch (error) {
			alert(error)	
		}
	}

	const createUser = async () => {
		try {
			const imageFile = await uploadImage()
			await axios.put('/api/user/create', {firstname, lastname, username, email, role_id, code,
				photo : imageFile ? imageFile.data : '',
			})
			await dispatch(getUserList());
			alert(`User created successfully.`)
			// props.setCreateUser(false)
					navigate('/dashboard/user')
		} catch(error) {
			if(error.response) 
				alert(error.response.data.message)
			else alert(error)
		}
	}

	const updateUser = async () => {
		try {
			if(password.length > 0 && currentPassword.length == 0)
				if(window.confirm(`Are you sure to change the password?`)) {
					setShowModalPassword(true)
					return
				}
			const currentImage = image_url.split(window.location.origin + "/")[1]
			let imageFile = {}
			if(currentImage !== userData.photo)
				imageFile = await uploadImage()
			await axios.patch('/api/user/update', { id : userID, firstname, lastname, username, email, role_id, code,
				photo : imageFile ? imageFile.data : userData.photo
			})
			await dispatch(getUserList());
			alert(`User updated successfully.`)
			// props.setCreateUser(false)
					navigate('/')
		} catch(error) {
      console.log(`🚀 ~ file: CreateUser.jsx ~ line 195 ~ updateUser ~ error`, error)
			if(error.response) {
				alert(error.response.data)
			}
			else alert(error)
		}
	}

	async function changePassword() {
		try {
			const { status } = await axios.patch('/api/user/' + user_id + '/changepass', { password, currentPassword })	
			if(status === 200) {
				setShowModalPassword(false)
				updateUser()
			}
		} catch (error) {
			if(error.response) {
				alert(error.response.data)
			}
			else alert(error)
		}
	}

	const roleList = roles.length === 0 ? '' :
	roles.map(item => <MenuItem key={item.id + item.name} value={item.id}>{item.name}</MenuItem>)

	return (
    <Page title={`${props.edit ? "Edit" : "Create"} User | UIII LMS`}>
      <Container>
				<Modal
					open={showModalPassword}
					onClose={() => { setCurrentPassword(""); setShowModalPassword(false)}}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Card 
						sx={{
							position : 'absolute',
							left : '50%',
							top : '50%',
							transform : 'translate(-50%,-50%)',
							p : 4,
						}}
					>
						<>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Please put current password
							</Typography>
							<FormControl 
								sx={{
									width : '100%',
									flexDirection : 'column',
									justifyContent : 'space-between',
									alignItems : 'center',
									py : 4,
								}}
								variant="outlined"
							>
								<OutlinedInput 
									value={currentPassword}
									sx={{
										// width : '100px',
										// mx : 2,
										mb : 2,
									}}
									onChange={e => setCurrentPassword(e.target.value)}
									type="password"
								/>
								<Button
									// sx={{
									// 	marginLeft : '30px'
									// }}
									variant="contained"
									onClick={changePassword}
									// startIcon={<Icon icon={plusFill} />}
								>
									Change Password and Update
								</Button>
							</FormControl>
						</>
					</Card>
				</Modal>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {props.edit ? "Edit" : "Create"} User
          </Typography>
        </Stack>

				{
					isLoading ?
					<CircularProgress /> :
        <Card>
					<Stack>
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
						<FormContainer label="First Name" value={firstname} setValue={setFirstname} />
						<FormContainer label="Last Name" value={lastname} setValue={setLastname} />
						<FormContainer label="Username" value={username} setValue={setUsername} />
						<FormContainer label="Email" value={email} setValue={setEmail} type="email" />
						{
							( user_id && isOwn ) &&
						<FormContainer label="Change Password" value={password} setValue={setPassword} type={showPassword ? "text" : "password"} placeholder="Password"
							endAdorment={
									<InputAdornment position="end">
										<IconButton 
										// className="show-password" 
										onClick={() => setShowPassword(!showPassword)} edge="end">
											{showPassword ? <VisibilityOff /> : <Visibility/> }
										</IconButton>
									</InputAdornment>
							}
						 />
						}
						<FormContainer label="User Code" value={code} setValue={setCode} />
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
              <span style={{ width: "35%" }}>User Image</span>
              <FormControl component="fieldset" sx={{ width: "65%"}}>
								<div style={{ width : '100%', height : '100%', display: 'flex', flexDirection : 'row', alignItems: 'flex-end'}}>
									<label htmlFor="contained-button-file">
										<Input accept="image/*" id="contained-button-file" multiple type="file" 
											sx={{ display : 'none'}}
											// onChange={(e) => e.target.files[0] && setCourseImage(e.target.files[0])}
											onChange={uploadFileHandle}
										/>
										<Button variant="contained" component="span">
											Upload File
										</Button>
									</label>
									{
										image_url &&
										<img style={{ height : '100px', display : 'inline-block', marginLeft: '20px'}} src={image_url} alt="course" />
									}
								</div>
              </FormControl>
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
						{
							( roles.length > 0 && isAdmin ) &&
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
							{/* <label htmlFor="role_id"> */}
								<span style={{ width : "35%"}}>
								Role
								</span>
								<Select
									value={role_id}
									onChange={e => setRoleID(e.target.value)}
									inputProps={{ 'aria-label': 'Without label' }}
								>
									{roleList}
								</Select>
							{/* </label> */}
							</Stack>
						}
        			{/* <Stack direction="row" alignItems="center" ml={19} mt={2} mb={5} > */}
        		<Stack direction="row" alignItems="center" ml={5} mt={2} mb={5} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
								<span style={{ width : "35%"}}>
								</span>
						<Button
							variant="contained"
							// component={RouterLink}
							// to="#"
							onClick={props.edit ? updateUser : createUser}
							// startIcon={<Icon icon={plusFill} />}
						>
							{props.edit ? "Update" : "Create" }
						</Button>
							</Stack>
					{/* </form> */}
					</Stack>
				</Card>
			}
			</Container>
		</Page>
	)
}

export default CreateUser
