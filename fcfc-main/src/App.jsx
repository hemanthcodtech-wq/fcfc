import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTop from './components/ScrollToTop'
import AnimationProvider from './components/AnimationProvider'
import PageShell from './components/PageShell'

const Home          = lazy(() => import('./pages/Home'))
const About         = lazy(() => import('./pages/About'))
const FAQ           = lazy(() => import('./pages/FAQ'))
const GenerateCoupon = lazy(() => import('./pages/GenerateCoupon'))
const SubmitCoupon  = lazy(() => import('./pages/SubmitCoupon'))
const RenewCoupon   = lazy(() => import('./pages/RenewCoupon'))
const SearchCoupon  = lazy(() => import('./pages/SearchCoupon'))
const AboutCoupon   = lazy(() => import('./pages/AboutCoupon'))
const ThankYou      = lazy(() => import('./pages/ThankYou'))
const CouponSuccess = lazy(() => import('./pages/CouponSuccess'))
const Contact       = lazy(() => import('./pages/Contact'))
const Links         = lazy(() => import('./pages/Links'))
const ResourcePage  = lazy(() => import('./pages/ResourcePage'))
const Gallery       = lazy(() => import('./pages/Gallery'))
const Presentations = lazy(() => import('./pages/Presentations'))
const AdminLogin         = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard     = lazy(() => import('./pages/AdminDashboard'))
const AdminAllCoupons    = lazy(() => import('./pages/AdminAllCoupons'))
const AdminCouponDetail  = lazy(() => import('./pages/AdminCouponDetail'))
const AdminCoupons       = lazy(() => import('./pages/AdminCoupons'))
const AdminSubmitted     = lazy(() => import('./pages/AdminSubmitted'))
const AdminRenewed       = lazy(() => import('./pages/AdminRenewed'))
const AdminRevenue       = lazy(() => import('./pages/AdminRevenue'))
const AdminUsers         = lazy(() => import('./pages/AdminUsers'))
const AdminGallery       = lazy(() => import('./pages/AdminGallery'))
const AdminLinks         = lazy(() => import('./pages/AdminLinks'))
const AdminPresentations = lazy(() => import('./pages/AdminPresentations'))

export default function App() {
  const location = useLocation()
  const hideShell = location.pathname.startsWith('/admin')

  return (
    <>
      <AnimationProvider />
      <ScrollToTop />
      <Suspense fallback={
        !hideShell ? (
          <>
            <Navbar />
            <div style={{ minHeight: '60vh' }} />
            <Footer />
          </>
        ) : <div />
      }>
        <AnimatePresence mode="wait">
          {!hideShell ? (
            <>
              <Navbar />
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <Routes location={location}>
                  <Route path="/"                  element={<PageShell><Home /></PageShell>} />
                  <Route path="/about"             element={<PageShell><About /></PageShell>} />
                  <Route path="/faq"               element={<PageShell><FAQ /></PageShell>} />
                  <Route path="/how-it-works"      element={<PageShell><FAQ /></PageShell>} />
                  <Route path="/contact"           element={<PageShell><Contact /></PageShell>} />
                  <Route path="/links"             element={<PageShell><Links /></PageShell>} />
                  <Route path="/documentation"     element={<PageShell><ResourcePage resource="documentation" /></PageShell>} />
                  <Route path="/api-reference"     element={<PageShell><ResourcePage resource="api-reference" /></PageShell>} />
                  <Route path="/whitepaper"        element={<PageShell><ResourcePage resource="whitepaper" /></PageShell>} />
                  <Route path="/community"         element={<PageShell><ResourcePage resource="community" /></PageShell>} />
                  <Route path="/privacy-policy"    element={<PageShell><ResourcePage resource="privacy-policy" /></PageShell>} />
                  <Route path="/terms-of-service"  element={<PageShell><ResourcePage resource="terms-of-service" /></PageShell>} />
                  <Route path="/gallery"           element={<PageShell><Gallery /></PageShell>} />
                  <Route path="/gallery/:tab"      element={<PageShell><Gallery /></PageShell>} />
                  <Route path="/presentations"     element={<PageShell><Presentations /></PageShell>} />
                  <Route path="/presentations/:tab" element={<PageShell><Presentations /></PageShell>} />
                  <Route path="/coupon/about"      element={<PageShell><AboutCoupon /></PageShell>} />
                  <Route path="/coupon/generate"   element={<PageShell><GenerateCoupon /></PageShell>} />
                  <Route path="/coupon/submit"     element={<PageShell><SubmitCoupon /></PageShell>} />
                  <Route path="/coupon/renew"      element={<PageShell><RenewCoupon /></PageShell>} />
                  <Route path="/coupon/search"     element={<PageShell><SearchCoupon /></PageShell>} />
                  <Route path="/coupon/success"    element={<PageShell><CouponSuccess /></PageShell>} />
                  <Route path="/thank-you"         element={<PageShell><ThankYou /></PageShell>} />
                </Routes>
              </motion.div>
              <Footer />
              <BottomNav />
            </>
          ) : (
            <Routes location={location}>
              <Route path="/admin/login"              element={<AdminLogin />} />
              <Route path="/admin"                    element={<AdminDashboard />} />
              <Route path="/admin/all-coupons"        element={<AdminAllCoupons />} />
              <Route path="/admin/all-coupons/:code"  element={<AdminCouponDetail />} />
              <Route path="/admin/coupons"            element={<AdminCoupons />} />
              <Route path="/admin/submitted"          element={<AdminSubmitted />} />
              <Route path="/admin/renewed"            element={<AdminRenewed />} />
              <Route path="/admin/revenue"            element={<AdminRevenue />} />
              <Route path="/admin/users"              element={<AdminUsers />} />
              <Route path="/admin/gallery"            element={<AdminGallery />} />
              <Route path="/admin/links"              element={<AdminLinks />} />
              <Route path="/admin/presentations"      element={<AdminPresentations />} />
            </Routes>
          )}
        </AnimatePresence>
      </Suspense>
    </>
  )
}
