import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const ComingSoon = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const dashboardPath = user ? `/${user.role.toLowerCase()}` : '/'

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
        px: 3
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '5rem' }}>🚧</Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
        Coming Soon
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400 }}>
        This feature is under development and will be available soon.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(dashboardPath)}
        sx={{ bgcolor: '#D4A574', color: '#1F2937', '&:hover': { bgcolor: '#C9A86A' }, px: 4, py: 1.5 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  )
}

export default ComingSoon
