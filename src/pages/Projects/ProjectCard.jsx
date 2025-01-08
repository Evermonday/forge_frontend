import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Project({ id }) {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='h3'>Scenario #{id}</Typography>
        </CardContent>
        <CardActions>
          <Button variant='outlined'>View Details</Button>
        </CardActions>
      </Card>
    </>
  );
}
