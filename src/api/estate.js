import { axiosService } from "./instance";

export default {
    getAptListByOption(form) {
        return axiosService.get(`/estate/trade/apartment?si=${form.si}&gugun=${form.gugun}&dong=${form.dong}&startyear=${form.startyear}&startmonth=${form.startmonth}&keyword=${form.keyword}`);
    },
    /**
     * @param {string} dongCode 
     */
    getAptListByDongCode(dongCode) {
        return axiosService.get(`/estate/region/apartment?dongCode=${dongCode}`);
    },
    getInterestLocation() {
        return axiosService.get(`/estate/interest`);
    },
    /**
     * 관심지역 추가
     * @param {string} dongCode 
     */
    addInterest(dongCode) {
        return axiosService.post(`/estate/interest/${dongCode}`);
    },
    /**
     * 관심지역 제거
     * @param {string} dongCode 
     */
    deleteInterest(dongCode) {
        return axiosService.delete(`/estate/interest/${dongCode}`);
    },
    /**
     * 아파트 정보 및 거래 내역 가져오기
     * @param {number} aptId 
     */
    getAptAndTradeById(aptId) {
        return axiosService.get(`/estate/apartment/${aptId}`);
    },

    /**
     * 키워드와 건물 매치
     * @param {*} keyword 
     */
    getBuildingListByKeyword(keyword) {
        return axiosService.get(`/estate/building/keyword/${keyword}`);
    }
};