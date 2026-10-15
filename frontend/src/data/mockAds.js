// src/data/mockAds.js
export const categories = [
  { id: 1, slug: "vendas", name: "Vendas", icon: "🏷️", count: 0 },
  { id: 2, slug: "servicos", name: "Serviços", icon: "🔧", count: 0 },
  { id: 3, slug: "imoveis", name: "Imóveis", icon: "🏠", count: 0 },
  { id: 4, slug: "empregos", name: "Empregos", icon: "💼", count: 0 },
  { id: 5, slug: "veiculos", name: "Veículos", icon: "🚗", count: 0 },
  { id: 6, slug: "eletronicos", name: "Eletrônicos", icon: "📱", count: 0 }
]

export const mockAds = [
  {
    id: 1,
    title: "iPhone 13 Pro 256GB - Like New",
    price: 3500,
    priceFormatted: "R$ 3.500",
    category: "eletronicos",
    categoryName: "Eletrônicos",
    location: "Centro, Itagi",
    image: "https://placehold.co/600x400/4361ee/white?text=iPhone+13+Pro",
    featured: true,
    views: 245,
    description: "iPhone 13 Pro 256GB na cor Grafite. Celular em perfeito estado, usado por 6 meses. Acompanha caixa original, carregador e capinha.",
    user: {
      name: "João Silva",
      phone: "(73) 99999-9999",
      email: "joao@email.com",
      ads: 12
    },
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Apartamento 2 quartos no Centro",
    price: 450000,
    priceFormatted: "R$ 450.000",
    category: "imoveis",
    categoryName: "Imóveis",
    location: "Centro, Itagi",
    image: "https://placehold.co/600x400/7209b7/white?text=Apartamento",
    featured: true,
    views: 189,
    description: "Apartamento com 2 quartos, sendo 1 suíte, sala ampla, cozinha planejada, vaga de garagem. Ótima localização, próximo a comércios e escolas.",
    user: {
      name: "Maria Santos",
      phone: "(73) 98888-8888",
      email: "maria@email.com",
      ads: 5
    },
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Moto CG 160 2022 - Baixa km",
    price: 12900,
    priceFormatted: "R$ 12.900",
    category: "veiculos",
    categoryName: "Veículos",
    location: "Bairro Novo, Itagi",
    image: "https://placehold.co/600x400/f72585/white?text=CG+160",
    featured: false,
    views: 98,
    description: "Honda CG 160 2022, azul, 8.500 km, revisões em dia, IPVA pago, documentação OK. Moto seminova, perfeita para uso diário.",
    user: {
      name: "Carlos Oliveira",
      phone: "(73) 97777-7777",
      email: "carlos@email.com",
      ads: 3
    },
    createdAt: "2024-01-18"
  },
  {
    id: 4,
    title: "Notebook Dell Inspiron i7",
    price: 2800,
    priceFormatted: "R$ 2.800",
    category: "eletronicos",
    categoryName: "Eletrônicos",
    location: "Jardim América, Itagi",
    image: "https://placehold.co/600x400/4cc9f0/white?text=Notebook+Dell",
    featured: false,
    views: 156,
    description: "Notebook Dell Inspiron, processador i7 10ª geração, 16GB RAM, SSD 512GB, placa de vídeo dedicada. Perfeito para trabalho e estudo.",
    user: {
      name: "Ana Pereira",
      phone: "(73) 96666-6666",
      email: "ana@email.com",
      ads: 8
    },
    createdAt: "2024-01-12"
  },
  {
    id: 5,
    title: "Smart TV Samsung 55\" 4K",
    price: 3200,
    priceFormatted: "R$ 3.200",
    category: "eletronicos",
    categoryName: "Eletrônicos",
    location: "Centro, Itagi",
    image: "https://placehold.co/600x400/f72585/white?text=TV+Samsung",
    featured: false,
    views: 67,
    description: "Smart TV Samsung 55 polegadas, 4K, HDR, Wi-Fi, Bluetooth. Comprada há 8 meses, pouco uso, nota fiscal e caixa originais.",
    user: {
      name: "Roberto Lima",
      phone: "(73) 95555-5555",
      email: "roberto@email.com",
      ads: 2
    },
    createdAt: "2024-01-20"
  },
  {
    id: 6,
    title: "Geladeira Brastemp Frost Free",
    price: 3000,
    priceFormatted: "R$ 3.000",
    category: "vendas",
    categoryName: "Vendas",
    location: "Santa Cruz, Itagi",
    image: "https://placehold.co/600x400/4895ef/white?text=Geladeira",
    featured: false,
    views: 43,
    description: "Geladeira Brastemp Frost Free, 375L, cor Inox. Funcionando perfeitamente, motivo da venda: mudança de cidade.",
    user: {
      name: "Patrícia Souza",
      phone: "(73) 94444-4444",
      email: "patricia@email.com",
      ads: 1
    },
    createdAt: "2024-01-19"
  },
  {
    id: 7,
    title: "Cadeira Gamer ThunderX3",
    price: 850,
    priceFormatted: "R$ 850",
    category: "vendas",
    categoryName: "Vendas",
    location: "Industrial, Itagi",
    image: "https://placehold.co/600x400/b5179e/white?text=Cadeira+Gamer",
    featured: false,
    views: 34,
    description: "Cadeira Gamer ThunderX3, cor preta/vermelha, reclinável, braços ajustáveis. Em ótimo estado, usada por 1 ano.",
    user: {
      name: "Fernando Costa",
      phone: "(73) 93333-3333",
      email: "fernando@email.com",
      ads: 4
    },
    createdAt: "2024-01-16"
  }
]

// Atualizar contagem das categorias
mockAds.forEach(ad => {
  const category = categories.find(c => c.slug === ad.category)
  if (category) {
    category.count++
  }
})