import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Ielts from "@/pages/Ielts";
import IeltsHistory from "@/pages/IeltsHistory";
import IeltsLanding from "@/pages/IeltsLanding";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PhotosDemo from "@/pages/PhotosDemo";
import CoupleHome from "@/pages/CoupleHome";
import PhotoGallery from "@/pages/PhotoGallery";

function GalleryWrapper() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!date) return;
    fetch(`/api/photos/day/${date}`)
      .then((r) => r.json())
      .then((json) => {
        const all = [...(json.photos?.me ?? []), ...(json.photos?.ta ?? [])];
        setPhotos(all);
      })
      .catch(() => setPhotos([]));
  }, [date]);

  return <PhotoGallery photos={photos} dateLabel={date || ''} onBack={() => navigate('/')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CoupleHome />} />
          <Route path="/gallery/:date" element={<GalleryWrapper />} />
          <Route path="/photos-demo" element={<PhotosDemo />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/ielts" element={<Ielts />} />
          <Route path="/ielts/history" element={<IeltsHistory />} />
          <Route path="/ielts/landing" element={<IeltsLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="text-center text-xl py-20">404 - 页面不存在</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
