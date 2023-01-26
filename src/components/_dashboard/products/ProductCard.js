import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';
import { Description } from '@mui/icons-material';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { id, name, description, image_url, status } = product;

  return (
    <Link to={id+"/detail"} color="inherit" underline="hover" component={RouterLink}>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {status && (
            <Label
              variant="filled"
              color={(status === 'sale' && 'error') || 'info'}
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase'
              }}
            >
            </Label>
          )}
          <ProductImgStyle alt={name} src={"/"+image_url} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* <ColorPreview  colors={"blue"}/> */}
            <Typography variant="subtitle1">
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through'
                }}
              >
                {/* {description} */}
              </Typography>
              &nbsp;
                {description.length > 15 ? description.slice(0,15)+" ..." : description}
              {/* {fCurrency(price)} */}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}
