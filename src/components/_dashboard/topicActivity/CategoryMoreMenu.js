import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { useDispatch } from "react-redux";
import axios from 'axios';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const dispatch = useDispatch();
	const navigate = useNavigate()
	const { category_code, sub_category, course_code, topic_id } = useParams()
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

	const [disableDeleteButton, setDisableDeleteButton] = useState(false)

	async function deleteCategory(category_code, name) {
		setDisableDeleteButton(true)
		if(window.confirm("Are you sure to delete " + ( name || "" ) + " session activity?")) {
			try {
				const { data } = await axios.delete('/api/topic/activity/delete/' + category_code)	
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
					onClick={() => deleteCategory(props.code, props.name)} disabled={disableDeleteButton}
				>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} 
				// onClick={() => navigate('/dashboard/courses/admin/edit', { state:{ code: props.code }}) }
						onClick={() => {
							dispatch({ type : 'refresh_start'})
							// navigate(`/dashboard/courses/admin/${category_code}/${sub_category}/${course_code}/edit`, {state:{ code : props.code }})
							navigate(`/dashboard/courses/admin/${category_code}/${sub_category}/${course_code}/session/${topic_id}/edit`, {state:{ topic_activity_id : props.code }})
						}}
				>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => props.gotoStudentActivity() }>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Manage Student Activity" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
