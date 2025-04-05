import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CreateBlog from './pages/CreateBlog';
import BlogDetails from './pages/BlogDetails';
import MyBlogs from './pages/MyBlogs';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Hero from './pages/Hero';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="overflow-x-hidden">
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-black">
              {/* Background Elements */}
              <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
              <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 mix-blend-multiply dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30"></div>
              
              {/* Main Content */}
              <div className="relative min-h-screen flex flex-col">
                <Routes>
                  <Route path="/landing" element={<Hero />} />
                  <Route
                    path="*"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-1 w-full">
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/blogs/:id" element={<BlogDetails />} />
                              <Route
                                path="/create-blog"
                                element={
                                  <PrivateRoute>
                                    <CreateBlog />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/my-blogs"
                                element={
                                  <PrivateRoute>
                                    <MyBlogs />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/edit-blog/:id"
                                element={
                                  <PrivateRoute>
                                    <EditBlog />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/profile"
                                element={
                                  <PrivateRoute>
                                    <Profile />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/settings"
                                element={
                                  <PrivateRoute>
                                    <Settings />
                                  </PrivateRoute>
                                }
                              />
                              <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                          </div>
                        </main>
                        
                        {/* Footer */}
                        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-auto">
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                © {new Date().getFullYear()} BlogApp. All rights reserved.
                              </div>
                              <div className="flex space-x-6">
                                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                                  Terms
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                                  Privacy
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                                  Contact
                                </a>
                              </div>
                            </div>
                          </div>
                        </footer>
                      </>
                    }
                  />
                </Routes>
              </div>

              <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
