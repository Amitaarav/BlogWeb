import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';
import { Profile } from './pages/Profile';
import { BlogPostPage } from './features/blog-post/pages/BlogPostPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/edit/:id" element={<Publish />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog-v2/:id" element={<BlogPostPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
