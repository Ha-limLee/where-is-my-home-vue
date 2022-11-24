<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>
import * as Types from "@/types";

export default {
    props: {
        "aptList": Array,
        /**
         * @type {Types.Building}
         */
        "building": {}
    },
    name: "KakaoMap",
    watch: {
        "aptList": function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.markApts();
            }
        },
        "building": function (newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log(newVal);
                const address = `${newVal.si} ${newVal.gugun} ${newVal.dong}`;
                this.markAddresss(address);
            }
        }
    },
    data() {
        return {
            markerPositions1: [
                [33.452278, 126.567803],
                [33.452671, 126.574792],
                [33.451744, 126.572441],
            ],
            markerPositions2: [
                [37.499590490909185, 127.0263723554437],
                [37.499427948430814, 127.02794423197847],
                [37.498553760499505, 127.02882598822454],
                [37.497625593121384, 127.02935713582038],
                [37.49629291770947, 127.02587362608637],
                [37.49754540521486, 127.02546694890695],
                [37.49646391248451, 127.02675574250912],
            ],
            markers: [],
            selectedMarker: null,
            infowindows: [],
        };
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
    methods: {
        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 5,
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
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            this.infowindows.forEach(x => {
                x.setMap(null);
            });

            this.geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: this.map,
                        position: coords
                    });

                    this.markers.push(marker);

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">아아</div>`
                    });
                    infowindow.open(this.map, marker);

                    this.infowindows.push(infowindow);

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    this.map.setCenter(coords);
                }
            });
        },
        markApts() {
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            const apts = this.aptList.reduce((prev, {aptCode, lat, lng}) => {
                const latlng = new kakao.maps.LatLng(lat, lng);
                prev[aptCode] = latlng;
                return prev;
            }, {});

            if (this.aptList.length) {
                const vueInstance = this;
                const map = this.map;
                const bounds = new kakao.maps.LatLngBounds();
                for (let i = 0; i < this.aptList.length || 0; i++) {
                    const apt = this.aptList[i];
                    const { lat, lng } = apt;
                    const position = new kakao.maps.LatLng(lat, lng);
                    const marker = new kakao.maps.Marker({ map: this.map, position });
                    
                    kakao.maps.event.addListener(marker, 'click', () => {
                        if (marker != vueInstance.selectedMarker || !vueInstance.selectedMarker) {
                            vueInstance.selectedMarker?.setImage(null);
                            vueInstance.selectedMarker = marker;
                            vueInstance.$emit('markerClick', apt.aptCode);
                            const imageSrc = `${process.env.BASE_URL}image/marker/marker_click.png`,
                                imageSize = new kakao.maps.Size(50, 50),
                                imageOption = { offset: new kakao.maps.Point(25, 50) };
                            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                            marker.setImage(markerImage);
                            map.panTo(position);
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
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #map {
        width: 100%;
        height: 60vh;
    }

    .button-group {
        margin: 10px 0px;
    }

    button {
        margin: 0 3px;
    }
</style>
