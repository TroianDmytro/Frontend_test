import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import StartPage from './pages/StartPage'
import GraphicDesignCourse from './pages/GraphicDesignCourse'
import ProgrammingCourse from './pages/ProgrammingCourse'
import ThreeDDesignCourse from './pages/ThreeDDesignCourse'
import DesignCoursePricing from './pages/DesignCoursePricing'
import ProgrammingCoursePricing from './pages/ProgrammingCoursePricing'
import ThreeDDesignCoursePricing from './pages/ThreeDDesignCoursePricing'
import PricingPage from './pages/PricingPage'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import CabinetResponsive from './pages/CabinetResponsive'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import { LoadingProvider, useLoading } from './components/LoadingContext'
import { AuthProvider } from './contexts/AuthContext'
import LoadingOverlay from './components/LoadingOverlay'
import './App.css'

function AppContent() {
  const location = useLocation();
  const { isLoading } = useLoading();
  
  const isStartPage = location.pathname === '/';
  const isGraphicDesignPage = location.pathname === '/courses/graphic-design';
  const isProgrammingPage = location.pathname === '/courses/programming';
  const isThreeDDesignPage = location.pathname === '/courses/3d-design';
  const isDesignPricingPage = location.pathname === '/courses/design-pricing';
  const isProgrammingPricingPage = location.pathname === '/courses/programming-pricing';
  const isThreeDDesignPricingPage = location.pathname === '/courses/3d-design-pricing';

  if (isStartPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/" element={<StartPage />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isGraphicDesignPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/graphic-design" element={<GraphicDesignCourse />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isProgrammingPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/programming" element={<ProgrammingCourse />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isThreeDDesignPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/3d-design" element={<ThreeDDesignCourse />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isDesignPricingPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/design-pricing" element={<DesignCoursePricing />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isProgrammingPricingPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/programming-pricing" element={<ProgrammingCoursePricing />} />
        </Routes>
      </PageTransition>
    );
  }

  if (isThreeDDesignPricingPage) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/courses/3d-design-pricing" element={<ThreeDDesignCoursePricing />} />
        </Routes>
      </PageTransition>
    );
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <div className="min-h-screen w-full flex flex-col overflow-x-hidden" style={{ backgroundColor: '#121212' }}>
        <main className="flex-1">
          <PageTransition>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
              <Route path="/democourses/graphic-design" element={<GraphicDesignCourse />} />
              <Route path="/democourses/programming" element={<ProgrammingCourse />} />
              <Route path="/democourses/3d-design" element={<ThreeDDesignCourse />} />
              <Route path="/democourses/design-pricing" element={<DesignCoursePricing />} />
              <Route path="/democourses/programming-pricing" element={<ProgrammingCoursePricing />} />
              <Route path="/democourses/3d-design-pricing" element={<ThreeDDesignCoursePricing />} />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              } />

              {/* Личный кабинет - все маршруты ведут на CabinetResponsive */}
              <Route path="/cabinet" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/home" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/profile" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/courses" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/calendar" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/books" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/achievements" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/chat" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
              <Route path="/cabinet/wallet" element={
                <ProtectedRoute>
                  <CabinetResponsive/>
                </ProtectedRoute>
              } />
            </Routes>
          </PageTransition>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App
