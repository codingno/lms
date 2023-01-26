import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
  const ref = useRef(null);
	const { category_code, sub_category } = useParams()
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useSelector(state => state)

	const [disableDeleteButton, setDisableDeleteButton] = useState(false)

	async function deleteCategory(code) {
		setDisableDeleteButton(true)
		if(window.confirm("Are you sure to delete " + props.name + " course?")) {
			try {
				const { data } = await axios.delete('/api/course/delete/' + code)	
				alert(data.message)
			} catch (error) {
				alert(error.response.data)	
			}
			dispatch({ type : 'refresh_start'})
		}
		setDisableDeleteButton(false)
	}

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 300, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} 
					onClick={() => deleteCategory(props.code)} disabled={disableDeleteButton}
					>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} 
				onClick={() => 
					// navigate('/dashboard/courses/admin/edit', { state:{ code: props.code }}) 
							navigate(`/dashboard/courses/admin/${category_code}/${sub_category}/${props.code}/edit`, {state:{category_code, sub_category, code : props.code}})
				}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => props.gotoTopic() }>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Manage Session" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => props.gotoEnrollment() }>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Manage Enrollment" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {
          user.data && user.data.role_id == 4 && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => props.gotoGrade() }>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Manage Grade" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
