// src/App.jsx
import { Routes, Route } from "react-router-dom"
import Menu from "./components/Menu/Menu"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home"
import CategoryPage from "./pages/CategoryPage"
import AdDetail from "./pages/AdDetail"
import Anunciar from "./pages/Anunciar"
import SearchResults from "./pages/SearchResults"
import Login from "./pages/Login"
import Registro from "./pages/Registro"


// Institucional
import Sobre from "./pages/institucional/Sobre"
import Politicas from "./pages/institucional/Politicas"
import Termos from "./pages/institucional/Termos"
import Contato from "./pages/institucional/Contato"

// Blog
import Blog from "./pages/Blog/Blog"
import Post from "./pages/Blog/Post"
import Categoria from "./pages/Blog/Categoria"

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
        <Route path="/anuncio/:id" element={<AdDetail />} />
        <Route path="/anunciar" element={<Anunciar />} />
        <Route path="/buscar" element={<SearchResults />} />
        
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/politicas" element={<Politicas />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/contato" element={<Contato />} />
        
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Post />} />
        <Route path="/blog/categoria/:categoria" element={<Categoria />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App