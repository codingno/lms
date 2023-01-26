import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import { CircularProgress, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getCourseUser } from '../store/actions/get/getCourseUser';
import { useLocation } from 'react-router';
export default function CourseStudent() {
  const location = useLocation()
	const dispatch = useDispatch()
  const [openFilter, setOpenFilter] = useState(false);
  const { courseUserList, refresh } = useSelector(state => state)
	const [isLoading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });
  const { resetForm, handleSubmit } = formik;
  
  async function getCourseUserList(){
		setLoading(true)
    await dispatch(getCourseUser())    
		setLoading(false)
		dispatch({type : 'refresh_done'})
  }

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  useEffect(() => {
    if(refresh)
      return getCourseUserList()
  }, [refresh, location])
  return (
    <Page title="Dashboard: Products | UIII LMS">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Courses
        </Typography>

        {/* <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}
        {isLoading ? 
            <div style={{ margin: 'auto', marginTop: '15px', display: 'flex', justifyContent: 'center'}}>
							<CircularProgress /> 
						</div> : 
            courseUserList.data.length > 2 ?
            <ProductList products={JSON.parse(courseUserList.data)} /> :
            <div style={{width: '100%', alignContent: 'center'}}>Course Not Found</div>
        }
        {/* <ProductCartWidget /> */}
      </Container>
    </Page>
  );
}
