import {
    FiShoppingCart,
    FiTool,
    FiHome,
    FiBriefcase,
    FiTruck,
    FiSmartphone,
    FiMonitor,
    FiShoppingBag,
    FiActivity,
    FiPackage,
    FiGrid
} from "react-icons/fi";

const categoryIcons = {
    vendas: FiShoppingCart,
    servicos: FiTool,
    imoveis: FiHome,
    empregos: FiBriefcase,
    veiculos: FiTruck,
    eletronicos: FiSmartphone,
    eletrodomesticos: FiMonitor,
    informatica: FiMonitor,
    moda: FiShoppingBag,
    esportes: FiActivity,
    outros: FiPackage
};

export function getCategoryIcon(slug) {
    return categoryIcons[slug] || FiGrid;
}