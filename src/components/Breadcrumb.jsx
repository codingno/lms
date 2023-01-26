import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs() {
	const navigate = useNavigate()
	const location = useLocation()
	const { category_code, sub_category, course_code, topic_id } = useParams()
  const dispatch = useDispatch()
	const [breadLink, setBreadLink] = useState([])
	const { refresh } = useSelector(state => state)

	async function getCategoryData() {
		const getCategoryData = await axios.get("/api/category");
		const { data } = getCategoryData.data;
		const category = data
		let courseData = null
		if(course_code) {
			const getCourseData = await axios.get("/api/course/info/" + course_code)
			const { data } = getCourseData.data
			courseData = data
		}

		let topicData = null
		if(topic_id) {
			const { data } = await axios.get("/api/topic/info/" + topic_id)
			topicData = data.data
		}

		let nonLink = [
			'dashboard',
			'courses',
			'create',
			'edit',
		]

		let url = "/"
		const makebreadLink = location.pathname.split('/')
			.filter(item => item !== "")
			.map(item => {
				url += item + "/"
				const category_name = category.filter(x => x.code === item)
				if(courseData) 
					if(courseData.code === item) 
					{
						return (
							<Typography color="text.primary" key={item}>
												{courseData.name}
											</Typography>
						)
					}

				let nameLink = category_name.length > 0 ? category_name[0].name : item 

				if(topicData) {
					if(topicData.id === parseInt(item)) {
						nameLink = topicData.name
					}
				}

				if(nonLink.indexOf(item) >= 0)
				// if(item === 'create' || item === 'edit')
					return ""
				if(item === 'admin')
					nameLink = 'Courses'
				if(item === 'session')
					nameLink = 'Session'

				return (
					// <Link underline="hover" color="inherit" onClick={() => navigate(url)}>
					<Link underline="hover" color="inherit" to={url} onClick={() => 
						dispatch({ type : 'refresh_start'})
					}>
						{nameLink}
					</Link>
				)
			})
		setBreadLink(makebreadLink)
	}
	useEffect(() => {
			getCategoryData()	
	}, [])

	useEffect(() => {
		if(refresh)
			getCategoryData()	
	}, [refresh])
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
				{breadLink}
        {/* <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/getting-started/installation/"
        >
          Core
        </Link> */}
      </Breadcrumbs>
    </div>
  );
}
