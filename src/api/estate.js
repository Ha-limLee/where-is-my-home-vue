import { axiosService } from "./instance";

export default {
    getAptListByDongCode(form) {
        return axiosService.get(`/estate/trade/apartment?si=${form.si}&gugun=${form.gugun}&dong=${form.dong}&startyear=${form.startyear}&startmonth=${form.startmonth}&keyword=${form.keyword}`);
    }
};