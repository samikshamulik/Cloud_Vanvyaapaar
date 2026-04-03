import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, TextField, Card, CardContent,
  Stack, Stepper, Step, StepLabel, Divider, alpha, CircularProgress
} from '@mui/material'
import {
  LocalShipping, Payment, ArrowBack, ArrowForward,
  CreditCard, Person, Phone, Home
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import buyerService from '../../services/buyerService'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import LoadingAnimation from '../../components/common/LoadingAnimation'

const steps = ['Shipping Address', 'Confirm Order']

const BuyerCheckout = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { clearCart } = useCartStore()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setLoading(false)
      setError('Please login to continue')
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)
      const items = await buyerService.getCart(user.id)
      setCartItems(Array.isArray(items) ? items : [])
    } catch (error: any) {
      console.error('Error fetching cart:', error)
      setError('Failed to load cart')
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = subtotal > 999 ? 0 : 50
    return { subtotal, shipping, total: subtotal + shipping }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate address
      if (!address.fullName || !address.phone || !address.addressLine || !address.city || !address.pincode) {
        toast.error('Please fill all address fields')
        return
      }
    }
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handlePlaceOrder = async () => {
    if (!user) return
    try {
      setProcessingPayment(true)
      await buyerService.placeOrder(user.id)
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/buyer/orders')
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setProcessingPayment(false)
    }
  }

  const { subtotal, shipping, total } = calculateTotal()

  if (loading) {
    return (
      <LoadingAnimation 
        variant="tribal" 
        size="large" 
        text="Preparing your checkout..." 
        fullScreen={true}
      />
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'error.main' }}>{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/buyer/cart')} sx={{ bgcolor: '#10B981' }}>
          Back to Cart
        </Button>
      </Container>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/buyer/products')} sx={{ bgcolor: '#10B981' }}>
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#10B981" />
      <FloatingElements 
        showScrollTop={true}
        quickActions={[
          {
            icon: <ArrowBack />,
            label: 'Back to Cart',
            onClick: () => navigate('/buyer/cart'),
            color: '#10B981'
          }
        ]}
      />
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/buyer/cart')} sx={{ mb: 3, color: '#10B981' }}>
        Back to Cart
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, fontFamily: 'serif' }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <Box>
          {activeStep === 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <LocalShipping sx={{ fontSize: 32, color: '#10B981' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Shipping Address</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#10B981' }} /> }}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: '#10B981' }} /> }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      label="Address"
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      InputProps={{ startAdornment: <Home sx={{ mr: 1, color: '#10B981' }} /> }}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Payment sx={{ fontSize: 32, color: '#10B981' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Confirm Order</Typography>
                  </Stack>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CreditCard sx={{ fontSize: 80, color: alpha('#10B981', 0.3), mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Cash on Delivery</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      Pay when your order is delivered to your doorstep
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePlaceOrder}
                      disabled={processingPayment}
                      startIcon={processingPayment ? <CircularProgress size={20} /> : <Payment />}
                      sx={{
                        bgcolor: '#10B981',
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        '&:hover': { bgcolor: '#059669' }
                      }}
                    >
                      {processingPayment ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ color: '#10B981' }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Box>

        {/* Order Summary */}
        <Box>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Order Summary</Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {cartItems.map((item) => (
                  <Box key={item.id}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{item.product.name} x {item.quantity}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {formatPrice(total)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
    </Box>
  )
}

export default BuyerCheckout
