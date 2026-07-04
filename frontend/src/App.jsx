import { Routes, Route } from "react-router-dom"
import Menu from "./components/Menu/Menu"
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop"

// Pages
import Home from "./pages/Home"
import CategoryPage from "./pages/CategoryPage"
import AdDetail from "./pages/AdDetail"
import Anunciar from "./pages/Anunciar"
import SearchResults from './pages/SearchResults/SearchResults'
import EditarAnuncio from './pages/EditarAnuncio'
import MeusAnuncios from "./pages/MeusAnuncios/MeusAnuncios"

// Auth
import Login from "./pages/Auth/Login"
import Registro from "./pages/Auth/Registro"
import RecuperarSenha from "./pages/RecuperarSenha"
import RedefinirSenha from "./pages/RedefinirSenha"

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
      <ScrollToTop />
      <Menu />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
        <Route path="/anuncio/:id" element={<AdDetail />} />
        <Route path="/anunciar" element={<Anunciar />} />
        <Route path="/buscar" element={<SearchResults />} />
        <Route path="/editar-anuncio/:id" element={<EditarAnuncio />} />
        <Route path="/meus-anuncios" element={<MeusAnuncios />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        <Route path="/sobre" element={<Sobre />} />
        <Route path="/politicas" element={<Politicas />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/contato" element={<Contato />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Post />} />
        <Route path="/blog/categoria/:categoria" element={<Categoria />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App