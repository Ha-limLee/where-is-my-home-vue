<template>
        <b-container>
            <h2 class="text-center mt-5 mb-3">건물 주위 아파트 검색</h2>
            <b-row>
                <b-form-input
                placeholder="지하철역, 버스정류장, 아파트, 주변상권 이름을 입력해주세요" v-model="buildingKeyword" debounce="500"></b-form-input>
                <b-dropdown ref="dropdown" variant="link" no-caret toggle-class="text-decoration-none" style="position: relative; top: -15px;">
                    <div style="overflow-y: scroll; height: 300px;">
                        <b-dropdown-item v-for="option, i in options" :key="i" :value="option.value" @click="onOptionClick(option.value)">
                            <b>
                                {{option.text}}
                            </b>
                            <br/>
                            {{option.location.si}}
                            {{option.location.gugun}}
                            {{option.location.dong}}
                        </b-dropdown-item>
                    </div>
                </b-dropdown>
                <!-- <b-form-select v-if="options.length" style="z-index: -1;" v-model="selected" :select-size="4" :options="options"></b-form-select> -->
            </b-row>
            <b-row>
                <div id="map"></div>
            </b-row>

            <b-sidebar v-model="openSidebar" id="sidebar-right" title="Sidebar" right shadow width="500px">
                <div class="px-3 py-2">
                    <h4>{{selected.houseInfo.apartmentName}}</h4>
                    <p>{{selected.houseInfo.roadName}} | 건설년도: {{selected.houseInfo.buildyear}}</p>
                    <b-table :items="selected.houseDealList" :fields="selected.fields"></b-table>
                </div>
            </b-sidebar>
    
        </b-container>
</template>

<script>
import KakaoMapVue from "@/components/KakaoMap.vue";
import { estate as estateApi } from '@/api';
import * as Types from "@/types";

/**
 * @typedef {Types.SimpleApt} SimpleApt
 */

/**
 * @typedef {Types.Building} Building
 */

export default {
    components: {
        KakaoMapVue,
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement("script");
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap);
            script.src =
                `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAOMAP_KEY}&libraries=services`;
            document.head.appendChild(script);
        }
    },
    watch: {
        buildingKeyword(value, oldValue) {
            if (value === "") {
                this.options = [];
            } else if (value !== oldValue && this.buildingKeywordChange) {
                estateApi.getBuildingListByKeyword(value)
                    .then(({ data }) => {
                        console.log(data);
                        if (data.length) {
                            const buildings = data.map(x => {
                                return {
                                    text: x.name,
                                    location: {
                                        si: x.si,
                                        gugun: x.gugun,
                                        dong: x.dong,
                                    },
                                    value: x,
                                }
                            });
                            this.options = buildings;
                            console.log(buildings);
                            this.$refs.dropdown.show(true);
                        } else {
                            this.options = [];
                        }
                    });
            } else if (!this.buildingKeywordChange) {
                this.buildingKeywordChange = true;
            }
        }
    },
    data() {
        return {
            map: null,
            /**
             * @type { Array<{value: any, text: string}> }
             */
            options: [],
            buildingKeyword: "",
            buildingKeywordChange: true,
            buildingMarker: null,
            selectedMarker: null,
            markers: [],
            infowindows: [],
            /**
             * @type { Building }
             */
            building: {},
            aptList: [],
            /**
             * @type {[{key: string, label: string, sortable: boolean, variant?: string}]}
             */
            aptFields: [
                {
                    key: "aptName",
                    label: "아파트 이름",
                    sortable: true,
                },
                {
                    key: "price",
                    label: "가격",
                    sortable: true,
                }
            ],
            openSidebar: false,
            selected: {
                houseInfo: {},
                houseDealList: [],
                fields: [
                    {
                        key: "dealYear",
                        label: "년",
                        sortable: true,
                    },
                    {
                        key: "dealMonth",
                        label: "월",
                        sortable: true,
                    },
                    {
                        key: "dealDay",
                        label: "일",
                        sortable: true,
                    },
                    {
                        key: "dealAmount",
                        label: "거래가격",
                        sortable: true,
                    },
                    {
                        key: "floor",
                        label: "층수",
                        sortable: true,
                    }
                ]
            },
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 4,
            };

            //지도 객체를 등록합니다.
            //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
            this.map = new kakao.maps.Map(container, options);
            this.geocoder = new kakao.maps.services.Geocoder();
        },
        changeSize(size) {
            const container = document.getElementById("map");
            container.style.width = `${size}px`;
            container.style.height = `${size}px`;
            this.map.relayout();
        },
        /**
         * @param {string} address 
         */
        markAddresss(address) {
            if (this.buildingMarker) {
                this.buildingMarker.setMap(null);
            }
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            this.infowindows.forEach(x => {
                x.setMap(null);
            });

            const vueInstance = this;

            this.geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: this.map,
                        position: coords
                    });

                    kakao.maps.event.addListener(marker, 'click', function () {
                        vueInstance.onBuildingMarkerClick(result[0].y, result[0].x);
                        vueInstance.map.panTo(coords);
                        const imageSrc = `${process.env.BASE_URL}image/marker/building_marker_click.png`,
                            imageSize = new kakao.maps.Size(50, 50),
                            imageOption = { offset: new kakao.maps.Point(25, 50) };
                        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                        marker.setImage(markerImage);
                    });

                    this.buildingMarker = marker;

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    // var infowindow = new kakao.maps.InfoWindow({
                    //     content: `<div style="width:150px;text-align:center;padding:6px 0;">${this.buildingKeyword}</div>`
                    // });
                    // infowindow.open(this.map, marker);

                    // this.infowindows.push(infowindow);

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    this.map.setCenter(coords);
                }
            });
        },
        markApts() {
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            if (this.aptList.length) {
                const map = this.map;
                const bounds = new kakao.maps.LatLngBounds();
                for (let i = 0; i < this.aptList.length || 0; i++) {
                    const apt = this.aptList[i];
                    const { lat, lng } = apt;
                    const position = new kakao.maps.LatLng(lat, lng);
                    const marker = new kakao.maps.Marker({ map: this.map, position });
                    kakao.maps.event.addListener(marker, 'click', () => {
                        // vueInstance.$emit('markerClick', apt.aptCode);
                        if (marker != this.selectedMarker || !this.selectedMarker) {
                            this.onMarkerClick(apt.aptCode);
                            this.selectedMarker?.setImage(null);
                            this.selectedMarker = marker;
                            map.panTo(position);
                            const imageSrc = `${process.env.BASE_URL}image/marker/marker_click.png`,
                                imageSize = new kakao.maps.Size(50, 50),
                                imageOption = { offset: new kakao.maps.Point(25, 50) };
                            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                            
                            marker.setImage(markerImage);
                        }
                    });

                    this.markers.push(marker);
                    bounds.extend(position);
                }
                this.map.setBounds(bounds);
            }

            // console.log(this.aptList);

            // if (Object.keys(apts).length > 0) {
            //     const positions = Object.values(apts);
            //     this.markers = positions.map((position) => {
            //         const marker = new kakao.maps.Marker({ map: this.map, position, });
            //         kakao.maps.event.addListener(marker, 'click', function () {
            //             console.log(console.log(position));
            //         });
            //         return marker;
            //     });

            //     const bounds = positions.reduce(
            //         (bounds, latlng) => bounds.extend(latlng),
            //         new kakao.maps.LatLngBounds()
            //     );

            //     this.map.setBounds(bounds);
            // }
        },
        onMarkerClick(aptId) {
            this.openSidebar = true;
            estateApi.getAptAndTradeById(aptId)
                .then(({ data }) => {
                    const { buildingInfo, houseDealList } = data;
                    houseDealList.sort((a, b) => {
                        if (a.dealYear === b.dealYear) {
                            if (a.dealMonth === b.dealMonth) {
                                return -(a.dealDay - b.dealDay);
                            } else {
                                return -(a.dealMonth - b.dealMonth);
                            }
                        } else {
                            return -(a.dealYear - b.dealYear);
                        }
                    });
                    this.selected.houseInfo = buildingInfo;
                    this.selected.houseDealList = houseDealList;
                })
        },
        displayMarker(markerPositions) {
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            const positions = markerPositions.map(
                (position) => new kakao.maps.LatLng(...position)
            );

            if (positions.length > 0) {
                this.markers = positions.map(
                (position) =>
                    new kakao.maps.Marker({
                    map: this.map,
                    position,
                    })
                );

                const bounds = positions.reduce(
                (bounds, latlng) => bounds.extend(latlng),
                new kakao.maps.LatLngBounds()
                );

                this.map.setBounds(bounds);
            }
        },
        displayInfoWindow() {
            if (this.infowindow && this.infowindow.getMap()) {
                //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
                this.map.setCenter(this.infowindow.getPosition());
                return;
            }

            var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
                iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

            this.infowindow = new kakao.maps.InfoWindow({
                map: this.map, // 인포윈도우가 표시될 지도
                position: iwPosition,
                content: iwContent,
                removable: iwRemoveable,
            });

            this.map.setCenter(iwPosition);
        },
        /**
         * @param {Building} value 
         */
        onOptionClick(value) {
            this.building = value;
            this.buildingKeywordChange = false;
            this.buildingKeyword = value.name;
            const addresss = `${value.si} ${value.gugun} ${value.dong}`;
            this.markAddresss(addresss);
        },

        onBuildingMarkerClick(lat, lng) {
            estateApi.getAptListByLocation(lat, lng, 500)
                .then(({ data }) => {
                    this.aptList = data;
                    this.markApts();
                    // 처음 클릭한 마커가 가장 위로 오도록 한다
                    this.buildingMarker.setMap(null);
                    this.buildingMarker.setMap(this.map);
                })
            // estateApi.getAptAndTradeById(aptId)
            //     .then(({ data }) => {
            //         const { houseInfo, houseDealList } = data;
            //         houseDealList.sort((a, b) => {
            //             if (a.dealYear === b.dealYear) {
            //                 if (a.dealMonth === b.dealMonth) {
            //                     return -(a.dealDay - b.dealDay);
            //                 } else {
            //                     return -(a.dealMonth - b.dealMonth);
            //                 }
            //             } else {
            //                 return -(a.dealYear - b.dealYear);
            //             }
            //         });
            //         this.selected.houseInfo = houseInfo;
            //         this.selected.houseDealList = houseDealList;
            //     })
        },
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #map {
        width: 100%;
        height: 70vh;
    }

    .button-group {
        margin: 10px 0px;
    }

    button {
        margin: 0 3px;
    }
</style>
