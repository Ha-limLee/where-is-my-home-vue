<template>
    <div>
        <MainHeader></MainHeader>
        <b-container>
            <h2 class="text-center mt-5 mb-3">아파트 매매 정보</h2>
            <b-row>
                <div class="form-group col-md-2">
                    <select @change="onSidoSelected" class="form-select bg-secondary text-light" id="sido">
                        <option value="">시도선택</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <select @change="onGugunSelected" class="form-select bg-secondary text-light" id="gugun">
                        <option value="">구군선택</option>
                    </select>
                </div>
                
                <div class="form-group col-md-2">
                    <select @change="onDongSelected" class="form-select bg-secondary text-light" id="dong">
                        <option value="">동선택</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <select v-model="form.startyear" class="form-select bg-dark text-light" id="year"></select>
                </div>
                <div class="form-group col-md-2">
                    <select v-model="form.startmonth" class="form-select bg-dark text-light" id="month">
                        <option value="">매매월선택</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <button @click="onGetClick" type="button" id="list-btn" class="btn btn-outline-primary">
                        아파트 매매 정보 가져오기</button>
                </div>
            </b-row>
            <b-row>
                <div class="form-group col-md-2">
                    <select id="sort-order" name="sort-order" class="form-select" aria-label="Default select example">
                    <option selected>정렬 순서 선택</option>
                    <option value="1">오름차순</option>
                    <option value="2">내림차순</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <select id="sort-type" name="sort-type" class="form-select" aria-label="Default select example">
                    <option selected>정렬 기준 선택</option>
                    <option value="1">아파트이름</option>
                    <option value="2">층</option>
                    <option value="3">면적</option>
                    <option value="4">거래금액</option>
                    </select>
                </div>
                <div class="form-group col-md-1">
                    <button id="sort-btn" type="button" class="btn btn-outline-secondary">
                        정렬
                    </button>
                </div>
                
                <div class="form-group col-md-3">
                    <input v-model="form.keyword" class="form-control" type="text" id="apt-name"
                        placeholder="아파트 이름을 입력해주세요">
                </div>
            </b-row>

            <b-card class="mt-3" header="Form Data Result">
                <pre class="m-0">{{ form }}</pre>
            </b-card>
            
            <b-row>
                <b-table striped hover :items="aptList" :fields="fields"></b-table>
            </b-row>

            <KakaoMapVue :apt-list="this.aptList"></KakaoMapVue>
        </b-container>
    </div>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import KakaoMapVue from "@/components/KakaoMap.vue";
import { estate as estateApi } from '@/api';

export default {
    components: {
        MainHeader,
        KakaoMapVue
    },
    mounted() {
        this.$nextTick(function() {
            let date = new Date();
            getYearInfo(date);
            sendRequest("sido", "*00000000");
            document.querySelector("#year").addEventListener("change", function() {
                getMonthInfo(date);
            });
            document.querySelector("#sido").addEventListener("change", function() {
                getGugunInfo(this);
            });
            document.querySelector("#gugun").addEventListener("change", function() {
                getDongInfo(this);
            });
            // document.querySelector("#list-btn").addEventListener("click", fetchFromDB);
            document.querySelector("#sort-btn").addEventListener("click", sortFromDB);
        });
    },
    data() {
        return {
            aptList: [],
            /**
             * @type {[{key: string, label: string, sortable: boolean, variant?: string}]}
             */
            fields: [
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
            form: {
                si: "",
                gugun: "",
                dong: "",
                startyear: "",
                startmonth: "",
                keyword: "",
            }
        }
    },
    methods: {
        onSidoSelected(e) {
            const selectedIndex = e.target.options.selectedIndex;
            let name = "";
            if (selectedIndex != 0)
                name = e.target.options[e.target.options.selectedIndex].text;
            this.form.si = name;
        },
        onGugunSelected(e) {
            const selectedIndex = e.target.options.selectedIndex;
            let name = "";
            if (selectedIndex != 0)
                name = e.target.options[e.target.options.selectedIndex].text;
            this.form.gugun = name;
        },
        onDongSelected(e) {
            const selectedIndex = e.target.options.selectedIndex;
            let name = "";
            if (selectedIndex != 0)
                name = e.target.options[e.target.options.selectedIndex].text;
            this.form.dong = name;
        },
        onGetClick(e) {
            e.preventDefault();
            estateApi.getAptListByOption(this.form)
                .then(({ data }) => {
                    this.aptList = data;
                });
        }
    }
}

/**
 * 지역명 요청에 쓰는 function 모음
 * 
 */

    // https://juso.dev/docs/reg-code-api/
    // let url = "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes";
    // let regcode = "*00000000";
    // 전국 특별/광역시, 도
    // https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000
    

// 지역 정보요청
function sendRequest(selid, regcode) {
    console.log("send request?");
    const url = "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes";
    let params = "regcode_pattern=" + regcode + "&is_ignore_zero=true";
    fetch(url +"?"+params)
        .then((response) => response.json())
        .then((data) => addOption(selid, data));
}

//체크 박스의 옵션 길이를 줄인다.
function initOption(selid) {
    let options = document.querySelector('#'+selid);
    options.length = 0;
}

// 선택된 체크박스(selid)에 따라 데이터를 해당 <option>태그에 정보를 삽입한다.
function addOption(selid, data) {
    let opt = ``;
    initOption(selid);
    console.log("selid? " + selid);

    switch (selid) {
    case "sido":
        opt += `<option value="">시도선택</option>`;
        data.regcodes.forEach(function (regcode) {
        opt += `
            <option value=`+regcode.code+`>`+regcode.name+`</option>
            `;
        });
        break;
    case "gugun":
        opt += `<option value="">구군선택</option>`;
        for (let i = 0; i < data.regcodes.length; i++) {
        if (i != data.regcodes.length - 1) {
            if (
            data.regcodes[i].name.split(" ")[1] == data.regcodes[i + 1].name.split(" ")[1] &&
            data.regcodes[i].name.split(" ").length !=
            data.regcodes[i + 1].name.split(" ").length
            ) {
            data.regcodes.splice(i, 1);
            i--;
            }
        }
        }
        let name = "";
        data.regcodes.forEach(function (regcode) {
        if (regcode.name.split(" ").length == 2) name = regcode.name.split(" ")[1];
        else name = regcode.name.split(" ")[1] + " " + regcode.name.split(" ")[2];
        opt += `
            <option value=`+regcode.code+`>`+name+`</option>
            `;
        });
        break;
    case "dong":
        opt += `<option value="">동선택</option>`;
        let idx = 2;
        data.regcodes.forEach(function (regcode) {
        if (regcode.name.split(" ").length != 3) idx = 3;
        opt += `
            <option value=`+regcode.code+`>`+regcode.name.split(" ")[idx]+`</option>
            `;
        });
    }
    document.querySelector('#'+selid).innerHTML = opt;
}


// 시도가 바뀌면 구군정보 얻기.
function getGugunInfo(sido) {
    if (sido[sido.selectedIndex].value) {
        let regcode = sido[sido.selectedIndex].value.substr(0, 2) + "*00000"; // TODO : this 적절한지 확인
        sendRequest("gugun", regcode);
    } else {
        initOption("gugun");
        initOption("dong");
    }
}

//구군이 바뀌면 동정보 얻기
function getDongInfo(gugun) {
    if (gugun[gugun.selectedIndex].value) {
        let regcode = gugun[gugun.selectedIndex].value.substr(0, 5) + "*";
        sendRequest("dong", regcode);
    } else {
        initOption("dong");
    }
}

/**
 *
 */


// 오늘로부터 20년 전까지 연도 리스트를 삽입한다. 브라우저가 열릴때 실행된다.
function getYearInfo(date) {
    let yearEl = document.querySelector("#year");
    let yearOpt = `<option value="">매매년도선택</option>`;
    let year = date.getFullYear();
    for (let i = year; i > year - 20; i--) {
    yearOpt += `<option value=`+i+`>`+i+`년</option>`;
    }
    yearEl.innerHTML = yearOpt;

};

// 연도 정보 변경시 월 정보를 재 설정. 금년의 경우 금월 이전의 달까지만 출력
function getMonthInfo(date) {
    let month = date.getMonth() + 1;
    let monthEl = document.querySelector("#month");
    let monthOpt = `<option value="">매매월선택</option>`;
    let yearSel = document.querySelector("#year");
    let m = yearSel[yearSel.selectedIndex].value == date.getFullYear() ? month : 13;
    for (let i = 1; i < m; i++) {
        let value = i < 10 ? "0" + i : i;
        monthOpt += `<option value=`+value+`>`+i+`월</option>`;
    }
    monthEl.innerHTML = monthOpt;
};

///////////////////////// select box 설정 (지역, 매매기간) /////////////////////////


/**
 * 시, 군, 구, 동, 년, 월, 아파트 이름으로 아파트 매매정보를 가져온다
 */
let aptData = [];

function fetchFromDB() {
	 // 5자리 시군구코드
     // 예) 서울특별시 종로구 : 11110
    let gugunSel = document.querySelector("#gugun");
    let regCode = gugunSel[gugunSel.selectedIndex].value.substr(0, 5);
    
     // 10자리 동코드
     // 예) 서울특별시 종로구 청운동 : 1111010100
    let dongSel = document.querySelector("#dong");
    let dongCode = dongSel[dongSel.selectedIndex].value;
    
    let yearSel = document.querySelector("#year");
    let year = yearSel[yearSel.selectedIndex].value;
    
    let monthSel = document.querySelector("#month");
    let month = monthSel[monthSel.selectedIndex].value;
    month = parseInt(month);
    
    let aptName = document.querySelector("#apt-name").value;
    
    let url = "${root}/apt?act=listJson&regCode="+regCode+"&dongCode="+dongCode+"&year="+year+"&month="+month+"&apt-name="+aptName;
    
    console.log(url);
    fetch(url)
		.then((response) => response.json())
		.then(data => {
			aptData = data;
			makeList(data); // table.js 아파트 관련 테이블 생성 
//			makeMarkers(data);
	});
}

function fetchFromOpenApi() {
    let url = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";
    let gugunSel = document.querySelector("#gugun");
    let regCode = gugunSel[gugunSel.selectedIndex].value.substr(0, 5);
    let yearSel = document.querySelector("#year");
    let year = yearSel[yearSel.selectedIndex].value;
    let monthSel = document.querySelector("#month");
    let month = monthSel[monthSel.selectedIndex].value;
    let dealYM = year + month;
    let queryParams =
        encodeURIComponent("serviceKey") +
        "=" +
        "W8tskb3ozBWJaXxxw5I%2FVKzmrJ53268CjU%2BcNrKjqwATnE8Y0NQjsSzuxuzf%2FzqDq%2B2joOsA4Q3HR347slp2Yg%3D%3D"; /*Service Key*/
    queryParams +=
        "&" +
        encodeURIComponent("LAWD_CD") +
        "=" +
        encodeURIComponent(regCode); /*아파트소재 구군*/
    queryParams +=
        "&" + encodeURIComponent("DEAL_YMD") + "=" + encodeURIComponent(dealYM); /*조회년월*/
    queryParams +=
        "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /*페이지번호*/
    queryParams +=
        "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("30"); /*페이지당건수*/
        
        /* setDataContainer(); */
        /* const form = document.querySelector("#data-container");
        form.submit(); */

    fetch(`\${url}?\${queryParams}`)
        .then((response) => response.text())
        .then((data) => makeList(data));
}

function parseAmount(dealInfo) {
	return parseInt(dealInfo.dealAmount.split(",").join(""));
}

function sortFromDB() {
	// 정렬 방식 설정
	const orderEl = document.querySelector("#sort-order");
	const orderIndex = orderEl.selectedIndex;
	let k = orderIndex == 2 ? -1 : 1;
	
	// 정렬 기준 설정
	const typeEl = document.querySelector("#sort-type");
	const typeIndex = typeEl.selectedIndex;
	switch (typeIndex) {
	case 1: // 아파트 이름
		aptData.sort((a, b) => {
			if (a.apartmentName < b.apartmentName)
				return -1 * k;
			if (a.apartmentName > b.apartmentName)
				return 1 * k;
			return 0;
		});
		break;
	case 2: // 층
		aptData.sort((a, b) => k * (a.floor - b.floor));
		break;
	case 3: // 면적
		aptData.sort((a, b) => k * (a.area - b.area));
		break;
	case 4: // 거래금액
		aptData.sort((a, b) => k * (parseAmount(a) - parseAmount(b)));
		break;
	}
	
	makeList(aptData);
}

</script>
