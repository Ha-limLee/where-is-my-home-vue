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
            map: null,
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

            //?????? ????????? ???????????????.
            //?????? ????????? ????????? ?????? ????????? ???????????? initMap?????? ???????????????.
            this.map = new kakao.maps.Map(container, options);
            kakao.maps.event.addListener(this.map, 'click', (e) => {
                this.$emit('mapClick', e);
            });
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

                    // ??????????????? ?????? ????????? ????????? ???????????????
                    var marker = new kakao.maps.Marker({
                        map: this.map,
                        position: coords
                    });

                    this.markers.push(marker);

                    // ?????????????????? ????????? ?????? ????????? ???????????????
                    var infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">??????</div>`
                    });
                    infowindow.open(this.map, marker);

                    this.infowindows.push(infowindow);

                    // ????????? ????????? ??????????????? ?????? ????????? ??????????????????
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
                //?????? ????????? ?????????????????? ?????? ????????? ?????? ??????????????? ??????????????? ????????? ???????????????.
                this.map.setCenter(this.infowindow.getPosition());
                return;
            }

            var iwContent = '<div style="padding:5px;">Hello World!</div>', // ?????????????????? ????????? ???????????? HTML ??????????????? document element??? ???????????????
                iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //??????????????? ?????? ???????????????
                iwRemoveable = true; // removeable ????????? ture ??? ???????????? ?????????????????? ?????? ??? ?????? x????????? ???????????????

            this.infowindow = new kakao.maps.InfoWindow({
                map: this.map, // ?????????????????? ????????? ??????
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
