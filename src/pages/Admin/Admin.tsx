
import { HallAdd } from "../../components/HallAdd/HallAdd";
import { HallConfig } from "../../components/HallConfig/HallConfig";
import { OpenSales } from "../../components/OpenSales/OpenSales";
import { PriceConfig } from "../../components/PriceConfig/PriceConfig";
import { SeancesGrid } from "../../components/SeancesGrid/SeancesGrid";
import { SectionAdmin } from "../../components/SectionAdmin/SectionAdmin";

export function Admin () {
    return <>
        <SectionAdmin title="Управление залами"><HallAdd /></SectionAdmin>
        <SectionAdmin title="Конфигурация залов"><HallConfig /></SectionAdmin>
        <SectionAdmin title="Конфигурация цен"><PriceConfig /></SectionAdmin>
        <SectionAdmin title="Сетка сеансов"><SeancesGrid /></SectionAdmin>
        <SectionAdmin title="Открыть продажи"><OpenSales /></SectionAdmin>
    </>
}