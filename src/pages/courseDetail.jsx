import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseUser } from '../store/actions/get/getCourseUser';
import { CircularProgress, ImageListItem } from '@mui/material';
import CustomizedAccordions from './TopicDetail';
import { getTopicCourse } from '../store/actions/get/getTopicCourse';
export default function LabTabs() {
  const dispatch = useDispatch()
  const [value, setValue] = React.useState('1');
  const {course_id} = useParams()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const courseUserList = useSelector(state => state.courseUserList)
  const topicCourse = useSelector(state => state.topicCourse)
  const [course, setCourse] = React.useState(courseUserList.data !== '' ? JSON.parse(courseUserList.data).filter(item => item.id == course_id)[0] : {})
    if(course == {} && courseUserList.load)
      setCourse(JSON.parse(courseUserList.data).filter(item => item.id == course_id)[0])
  React.useEffect(() => {
    async function getCourseUserList(){
      topicCourse.load = false
      await dispatch(getCourseUser())    
    }
    if(!courseUserList.load)
      return getCourseUserList()
    // else if(course == {} && courseUserList.load)
      
  }, [])
  React.useEffect(() => {
    async function getCourseData(){
      topicCourse.load = false
      setCourse(JSON.parse(courseUserList.data).filter(item => item.id == course_id)[0])
    }
    if(courseUserList.load)
      return getCourseData() 
  },[courseUserList])
  
  React.useEffect(() => {
    async function getTopic(){
      await dispatch(getTopicCourse(null,{course_id}))
    }
    if(!topicCourse.load)
      return getTopic() 
  },[topicCourse, courseUserList])

    // setCourse(courseUserList.load ? JSON.parse(courseUserList.data).filter(item => item.id == course_id)[0] : {})
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext style={{padding: "10px"}} value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Detail" value="1" />
            <Tab label="Topic" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" style={{display: "flex"}}>{course.id && (
            <>
                <ImageListItem style={{width:"225px"}} >
                    <img src={"/"+course.image_url}/>
                </ImageListItem>
                <Box style={{width: "100%", paddingLeft:"10px"}}>
                    <h2>
                        <b>{course.name} ({course.code})</b>
                    </h2>
                    &nbsp;
                    <b>Description : </b>{course.description}    

                </Box>
            </>
        )}</TabPanel>
        <TabPanel style={{padding:"0", marginTop: "-40px"}} value="2">
						{
              !topicCourse.load ?
            <div style={{ margin: 'auto', marginTop: '15px', display: 'flex', justifyContent: 'center'}}>
							<CircularProgress /> 
						</div> :
            <CustomizedAccordions topic={topicCourse.load ? JSON.parse(topicCourse.data) : []}/>
            }
        </TabPanel>
      </TabContext>
    </Box>
  );
}