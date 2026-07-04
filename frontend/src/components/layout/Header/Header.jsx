// src/components/Header/Header.jsx 
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Header.css"

function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault() // 👈 IMPEDE O RECARREGAMENTO DA PÁGINA
    
    if (searchTerm.trim()) {
      console.log('🔍 Buscando por:', searchTerm)
      // 👈 NAVEGA PARA A PÁGINA DE RESULTADOS
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      alert('Digite algo para buscar')
    }
  } 

}

export default Header  