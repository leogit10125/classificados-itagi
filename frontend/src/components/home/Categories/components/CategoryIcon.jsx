import {
    ShoppingCart,
    Wrench,
    House,
    BriefcaseBusiness,
    Car,
    Smartphone,
    Refrigerator,
    Monitor,
    Shirt,
    Trophy,
    Package
} from "lucide-react";

function CategoryIcon({ slug }) {

    const icons = {
        vendas: ShoppingCart,
        servicos: Wrench,
        imoveis: House,
        empregos: BriefcaseBusiness,
        veiculos: Car,
        eletronicos: Smartphone,
        eletrodomesticos: Refrigerator,
        informatica: Monitor,
        moda: Shirt,
        esportes: Trophy,
        outros: Package
    };

    const Icon = icons[slug] || Package;

    return (
        <Icon
            className="category-icon"
            strokeWidth={2.1}
        />
    );

}

export default CategoryIcon;