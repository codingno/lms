import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src="/static/login-logo-white.png"             
                  width={279}
                height={76}
  sx={{ width: 279, height: 76, ...sx }} />;
}
