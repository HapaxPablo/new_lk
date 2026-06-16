// components/PlaceTitle.tsx
import { INomenclatureDetailsItem } from '@/types/nomenclature';
import { formatPlaceTitle, TitleVariant } from '@/utils/nomenclatureUtils';
import { FC } from 'react';

interface PlaceTitleProps {
    place: INomenclatureDetailsItem;
    variant?: TitleVariant;
    className?: string;
}

export const PlaceTitle: FC<PlaceTitleProps> = ({ place, variant = 'full', className }) => {
    const title = formatPlaceTitle(place, variant);
    console.log('title', title);
    return <h1 className={`text-sm sm:text-2xl font-bold text-[#1E3961] whitespace-pre-line ${className || ''}`}>{title}</h1>;
};