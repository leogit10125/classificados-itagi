const fs = require('fs');
const path = require('path');

// Cores para o console
const cores = {
  verde: '\x1b[32m',
  amarelo: '\x1b[33m',
  vermelho: '\x1b[31m',
  azul: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${cores.azul}🚀 Iniciando reorganização do projeto...${cores.reset}\n`);

// 1. CRIAR BACKUP PRIMEIRO (segurança)
function criarBackup() {
  const backupDir = `backup-${Date.now()}`;
  console.log(`${cores.amarelo}📦 Criando backup em ${backupDir}/...${cores.reset}`);
  
  fs.cpSync('src', backupDir, { recursive: true, force: true });
  console.log(`${cores.verde}✅ Backup criado com sucesso!${cores.reset}\n`);
  
  return backupDir;
}

// 2. ESTRUTURA DESEJADA (o "mapa do tesouro")
const estrutura = {
  components: {
    Header: ['Header.jsx', 'Header.css'],
    Hero: ['Hero.jsx', 'Hero.css'],
    Menu: ['Menu.jsx', 'Menu.css'],
    Footer: ['Footer.jsx', 'Footer.css'],
    AdCard: ['AdCard.jsx', 'AdCard.css'],
    AdsCarousel: ['AdsCarousel.jsx', 'AdsCarousel.css'],
    Categories: ['Categories.jsx', 'Categories.css']
  },
  pages: {
    Home: ['Home.jsx', 'Home.css'],
    AdDetail: ['AdDetail.jsx', 'AdDetail.css'],
    CategoryPage: ['CategoryPage.jsx', 'CategoryPage.css'],
    SearchResults: ['SearchResults.jsx', 'SearchResults.css'],
    Anunciar: ['Anunciar.jsx', 'Anunciar.css'],
    Auth: ['Login.jsx', 'Registro.jsx', 'Auth.css'],
    Blog: ['Blog.jsx', 'Post.jsx', 'Categoria.jsx', 'Blog.css'],
    Institucional: ['Sobre.jsx', 'Contato.jsx', 'Termos.jsx', 'Politicas.jsx', 'Institucional.css']
  }
};

// 3. MAPEAMENTO DE ARQUIVOS SOLTOS
const arquivosSoltos = [
  // Componentes soltos
  { nome: 'Header.jsx', origem: 'src/components', destino: 'src/components/Header' },
  { nome: 'Header.css', origem: 'src/components', destino: 'src/components/Header' },
  
  // Páginas soltas
  { nome: 'Home.jsx', origem: 'src/pages', destino: 'src/pages/Home' },
  { nome: 'Home.css', origem: 'src/pages', destino: 'src/pages/Home' },
  { nome: 'AdDetail.jsx', origem: 'src/pages', destino: 'src/pages/AdDetail' },
  { nome: 'AdDetail.css', origem: 'src/pages', destino: 'src/pages/AdDetail' },
  { nome: 'CategoryPage.jsx', origem: 'src/pages', destino: 'src/pages/CategoryPage' },
  { nome: 'CategoryPage.css', origem: 'src/pages', destino: 'src/pages/CategoryPage' },
  { nome: 'SearchResults.jsx', origem: 'src/pages', destino: 'src/pages/SearchResults' },
  { nome: 'SearchResults.css', origem: 'src/pages', destino: 'src/pages/SearchResults' },
  { nome: 'Anunciar.jsx', origem: 'src/pages', destino: 'src/pages/Anunciar' },
  { nome: 'Anunciar.css', origem: 'src/pages', destino: 'src/pages/Anunciar' },
  { nome: 'Login.jsx', origem: 'src/pages', destino: 'src/pages/Auth' },
  { nome: 'Registro.jsx', origem: 'src/pages', destino: 'src/pages/Auth' },
  { nome: 'Auth.css', origem: 'src/pages', destino: 'src/pages/Auth' }
];

// 4. FUNÇÃO PARA CRIAR PASTAS
function criarPastas() {
  console.log(`${cores.azul}📁 Criando estrutura de pastas...${cores.reset}`);
  
  // Criar pastas de componentes
  Object.keys(estrutura.components).forEach(pasta => {
    const caminho = `src/components/${pasta}`;
    if (!fs.existsSync(caminho)) {
      fs.mkdirSync(caminho, { recursive: true });
      console.log(`   Criada: ${caminho}`);
    }
  });
  
  // Criar pastas de páginas
  Object.keys(estrutura.pages).forEach(pasta => {
    const caminho = `src/pages/${pasta}`;
    if (!fs.existsSync(caminho)) {
      fs.mkdirSync(caminho, { recursive: true });
      console.log(`   Criada: ${caminho}`);
    }
  });
  
  console.log(`${cores.verde}✅ Pastas criadas!${cores.reset}\n`);
}

// 5. FUNÇÃO PARA MOVER ARQUIVOS (COM VERIFICAÇÃO)
function moverArquivos() {
  console.log(`${cores.azul}📦 Movendo arquivos...${cores.reset}`);
  
  arquivosSoltos.forEach(item => {
    const origem = `${item.origem}/${item.nome}`;
    const destino = `${item.destino}/${item.nome}`;
    
    // Verifica se origem existe
    if (fs.existsSync(origem)) {
      // Verifica se destino já existe (para não sobrescrever)
      if (!fs.existsSync(destino)) {
        fs.renameSync(origem, destino);
        console.log(`   ✅ Movido: ${origem} → ${destino}`);
      } else {
        console.log(`   ⚠️  Arquivo já existe em ${destino}, pulando...`);
      }
    } else {
      console.log(`   ℹ️  Arquivo não encontrado: ${origem} (pulando)`);
    }
  });
  
  console.log(`${cores.verde}✅ Arquivos movidos!${cores.reset}\n`);
}

// 6. FUNÇÃO PARA ATUALIZAR IMPORTS (a parte mais importante!)
function atualizarImports() {
  console.log(`${cores.azul}🔄 Atualizando imports nos arquivos...${cores.reset}`);
  
  const mapeamentoImports = {
    // Formato: 'caminhoAntigo': 'caminhoNovo'
    "'./pages/Home'": "'./pages/Home/Home'",
    "'./pages/Home.jsx'": "'./pages/Home/Home'",
    "'./pages/AdDetail'": "'./pages/AdDetail/AdDetail'",
    "'./pages/AdDetail.jsx'": "'./pages/AdDetail/AdDetail'",
    "'./pages/CategoryPage'": "'./pages/CategoryPage/CategoryPage'",
    "'./pages/CategoryPage.jsx'": "'./pages/CategoryPage/CategoryPage'",
    "'./pages/SearchResults'": "'./pages/SearchResults/SearchResults'",
    "'./pages/SearchResults.jsx'": "'./pages/SearchResults/SearchResults'",
    "'./pages/Anunciar'": "'./pages/Anunciar/Anunciar'",
    "'./pages/Anunciar.jsx'": "'./pages/Anunciar/Anunciar'",
    "'./pages/Login'": "'./pages/Auth/Login'",
    "'./pages/Login.jsx'": "'./pages/Auth/Login'",
    "'./pages/Registro'": "'./pages/Auth/Registro'",
    "'./pages/Registro.jsx'": "'./pages/Auth/Registro'",
    "'../components/Header'": "'../components/Header/Header'",
    "'../components/Header.jsx'": "'../components/Header/Header'"
  };
  
  // Arquivos que provavelmente têm imports (recursivamente)
  function processarArquivosJsx(diretorio) {
    const arquivos = fs.readdirSync(diretorio, { withFileTypes: true });
    
    arquivos.forEach(arquivo => {
      const caminhoCompleto = path.join(diretorio, arquivo.name);
      
      if (arquivo.isDirectory()) {
        processarArquivosJsx(caminhoCompleto);
      } else if (arquivo.name.endsWith('.jsx') || arquivo.name.endsWith('.js')) {
        let conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
        let conteudoOriginal = conteudo;
        
        // Aplicar todas as substituições
        Object.entries(mapeamentoImports).forEach(([antigo, novo]) => {
          const regex = new RegExp(antigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          conteudo = conteudo.replace(regex, novo);
        });
        
        // Só salvar se mudou
        if (conteudo !== conteudoOriginal) {
          fs.writeFileSync(caminhoCompleto, conteudo);
          console.log(`   ✏️  Atualizado: ${caminhoCompleto}`);
        }
      }
    });
  }
  
  processarArquivosJsx('src');
  console.log(`${cores.verde}✅ Imports atualizados!${cores.reset}\n`);
}

// 7. FUNÇÃO PARA CRIAR ARQUIVOS DE ÍNDICE (opcional, mas elegante)
function criarIndexFiles() {
  console.log(`${cores.azul}📄 Criando arquivos index.js para imports mais limpos...${cores.reset}`);
  
  // Criar index.js em cada pasta de componente
  Object.keys(estrutura.components).forEach(pasta => {
    const caminhoIndex = `src/components/${pasta}/index.js`;
    const componente = pasta;
    const conteudo = `export { default } from './${componente}';\n`;
    
    if (!fs.existsSync(caminhoIndex)) {
      fs.writeFileSync(caminhoIndex, conteudo);
      console.log(`   Criado: ${caminhoIndex}`);
    }
  });
  
  // Criar index.js em cada pasta de página
  Object.keys(estrutura.pages).forEach(pasta => {
    const caminhoIndex = `src/pages/${pasta}/index.js`;
    const conteudo = pasta === 'Auth' 
      ? `export { default as Login } from './Login';\nexport { default as Registro } from './Registro';\n`
      : `export { default } from './${pasta}';\n`;
    
    if (!fs.existsSync(caminhoIndex)) {
      fs.writeFileSync(caminhoIndex, conteudo);
      console.log(`   Criado: ${caminhoIndex}`);
    }
  });
  
  console.log(`${cores.verde}✅ Arquivos index criados!${cores.reset}\n`);
}

// 8. EXECUTAR TUDO
function main() {
  try {
    const backupDir = criarBackup();
    
    criarPastas();
    moverArquivos();
    atualizarImports();
    criarIndexFiles();
    
    console.log(`${cores.verde}🎉 Reorganização concluída com sucesso!${cores.reset}`);
    console.log(`${cores.amarelo}📝 Backup salvo em: ${backupDir}${cores.reset}`);
    console.log(`${cores.azul}💡 Dica: Teste a aplicação para garantir que tudo funciona!${cores.reset}`);
    
  } catch (erro) {
    console.log(`${cores.vermelho}❌ Erro durante a reorganização:${cores.reset}`, erro);
    console.log(`${cores.amarelo}🔄 Restaure o backup se necessário.${cores.reset}`);
  }
}

main();