import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import axios from 'axios';

// ----------------------------------------------------------------------

export default function UserMoreMenu({ code, category_code, category_name }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

	const [disableDeleteButton, setDisableDeleteButton] = useState(false)

	async function deleteCategory(category_code) {
		setDisableDeleteButton(true)
		if(window.confirm("Are you sure to delete " + category_name + "?")) {
			try {
				await axios.delete('/api/category/delete/' + category_code)	
				alert("Category successfully deleted")
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
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => deleteCategory(code)} disabled={disableDeleteButton}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => {
						// navigate('/dashboard/courses/admin/category/edit', { state:{ code , category_code }}) 
						if(category_code)
							navigate(`/dashboard/courses/admin/${category_code}/${code}/edit`, { state:{ code , category_code }}) 
						else
							navigate(`/dashboard/courses/admin/${code}/edit`, { state:{ code , category_code }}) 
					}}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
