var search = function () {
    return {
        // 区域选择
        choseArea: function (e, header) {
            var id = e.currentTarget.dataset.id;
            header.searchId = id;
            header.Address = "dddd";
            header.array = [{ message: "a" }, { message: "b" }, { message: "c" }, { message: "d" }];
            header.area_select = '0';
            return header;
        },
        // 设备类型
        choseType: function (e, header) {
            var id = e.currentTarget.dataset.id;
            header.searchId = id;
            return header;
        },
        // 更多
        choseMore: function (e, header) {
            var id = e.currentTarget.dataset.id;
            header.searchId = id;
            return header;
        },
        //重新定位
        reposition: function (header) {
            wx.chooseLocation({
                success: function (res) {
                    //res:{address:"布吉新区南湾街道商业广场"，errMsg:"chooseLocation:ok",latitude:"22.610508",longitude:"114.14684",name:"求水山公园"}name可能有可能没有
                    header.address = res.address;
                }
            })
            return header;
        },
        // 区域选择左侧nav
        choseDistrict: function (e, header) {
            var idx = e.currentTarget.dataset.idx;
            header.area_select = idx
            if (idx == "0") {
                header.array = [{ message: "a" }, { message: "b" }, { message: "c" }, { message: "d" }]
            } else {
                header.array = [{ message: "ddd" }, { message: "fff" }, { message: "vvv" }, { message: "ggg" }]
            }
            return header;
        },
        //选择设备类型
        deviceType: function (e, header) {
            var index = e.target.dataset.index;
            var value = e.target.dataset.value;
            if (value == "不限") {
                for (var i = 0; i < header.typeList.length + 1; i++) {
                    header.choseArr[i] = "false"
                }
                header.choseTemp = 0;
                return header;
            } else {
                header.choseArr[header.choseArr.length - 1] = "true";
            }
            if (header.choseArr[index] == "true") {
                header.choseArr[index] = "false";
                header.choseTemp--;
                if (header.choseTemp == 0) {
                    header.choseArr[header.choseArr.length - 1] = "false";
                }
            } else {
                if (header.choseTemp < 3) {
                    header.choseArr[index] = "true";
                    header.choseTemp++;
                }
            }
            return header;
        },
        //更多左侧nav
        MoreSelect: function (e, header,PQty,ProducessType) {
            var idx = e.currentTarget.dataset.idx;
            header.more_select = idx;
            header.MoreTypeId="-1";
            if (idx == "1") {
                header.MoreArray = PQty;
            }
            if (idx == "2") {
                header.MoreArray = ProducessType;
            }
            return header;
        },
        //主营行业选择
        choseIndustry: function (e, header,IndustryList) {
            var idx = e.currentTarget.dataset.index;
            header.ParentId = idx;
            header.MainIndustryArray_T = IndustryList[idx].SubIndustries;
            return header;
        },
    }
}();

module.exports = {
    search
}
