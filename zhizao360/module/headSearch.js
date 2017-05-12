var appInstance = getApp(); //获取全局对象

var search = function () {
    return {
        // 区域选择
        choseArea: function (e, header) {
            var id = e.currentTarget.dataset.id;
            if (header.searchId == id) {
                header.searchId = 0;
            } else {
                header.searchId = id;
            }
            return header;
        },
        //选择位子
        choseposition: function (header, t, request) {
            wx.chooseLocation({
                success: function (res) {
                    //res:{address:"布吉新区南湾街道商业广场"，errMsg:"chooseLocation:ok",latitude:"22.610508",longitude:"114.14684",name:"求水山公园"}name可能有可能没有
                    header.Address = res.address;
                    var county = appInstance.GetAddress(res.address);
                    if (county.province == '') {
                        county.province = county.city;
                        county.city = "市辖区";
                    }
                    header.Data.Address.province = county.province;
                    header.Data.Address.city = county.city;
                    request.Longitude = res.longitude;
                    request.Latitude = res.latitude;
                    // 获取区域
                    appInstance.reqGet("BaseData/GetArea", function (res) {
                        header.Data.District = [];
                        for (var i = 0; i < res.length; i++) {
                            header.Data.District.push({
                                Id: res[i].id,
                                Name: res[i].text
                            })
                        }
                        header.array = header.Data.District;
                        t.setData({
                            item_head: header,
                        })
                    }, { provice: county.province, city: county.city })
                }
            })
            return header;
        },
        bmap_fn: function (bmap, header, t) {
            var BMap = new bmap.BMapWX({
                ak: 'oPufGCXIP6BGyj67bBO3KVsG5G7Qa9G4'
            });
            var fail = function (data) {
               
            };
            var success = function (data) {
                header.Address = data.wxMarkerData[0].address;
                // data.wxMarkerData[0].address = "广东省深圳市南山区"
                var county = appInstance.GetAddress(data.wxMarkerData[0].address);
                header.Data.Address.province = county.province;
                header.Data.Address.city = county.city;
                appInstance.globalData.RegisterLocation = county.city; //存当前IP的地址
                // 获取区域
                appInstance.reqGet("BaseData/GetArea", function (res) {
                    header.Data.District = [];
                    for (var i = 0; i < res.length; i++) {
                        header.Data.District.push({
                            Id: res[i].id,
                            Name: res[i].text
                        })
                    }
                    header.array = header.Data.District;
                    t.setData({
                        item_head: header,
                    })
                }, { provice: county.province, city: county.city })
            }
            // 发起regeocoding检索请求 
            BMap.regeocoding({
                fail: fail,
                success: success,
            });
            return header;
        },
        //重新定位
        reposition: function (header) {
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    header.latitude = res.latitude
                    header.longitude = res.longitude
                    wx.showToast({
                        title: '定位完成',
                        icon: 'success',
                        duration: 1000
                    })
                }
            })
            return header;
        },
        // 区域选择左侧nav
        choseDistrict: function (e, header) {
            var idx = e.currentTarget.dataset.idx;
            header.area_select = idx;
            header.showIndex = 999;
            if (idx == "0") {
                header.array = header.Data.District
            } else {
                header.array = header.Data.Nearby
            }
            return header;
        },
        //区域右侧
        choseCondition: function (e, header) {
            var index = e.currentTarget.dataset.index;
            header.showIndex = index;
            var Id = e.currentTarget.dataset.id;
            var Name = e.currentTarget.dataset.name;
            if (Name != "区域") {
                header.AddressColor = true;
                header.Data.Address.county = Name;
            } else {
                header.AddressColor = false;
                header.Data.Address.county = '';
                header.Data.Address.city = '';
                header.Data.Address.province = '';
            }
            header.AddressName = Name;
            header.searchId = 0;
            return header;
        },
        //选择设备类型
        deviceType: function (e, header) {
            var index = e.currentTarget.dataset.index;
            var value = e.currentTarget.dataset.value;
            var Id = e.currentTarget.dataset.typeid;
            if (value == "不限") {
                for (var i = 0; i < header.typeList.length; i++) {
                    header.choseArr[i] = "false"
                }
                header.molimit = "false";
                header.choseTemp = 0;
                header.Data.DeviceName = [];
                return header;
            } else {
                header.molimit = "true";
            }
            if (header.choseArr[index] == "true") {
                header.choseArr[index] = "false";
                for (var i = 0; i < header.choseTemp; i++) {
                    if (header.Data.DeviceName[i].Id == Id) {
                        header.Data.DeviceName.splice(i, 1);
                        break;
                    }
                }
                header.choseTemp--;
                if (header.choseTemp == 0) {
                    header.molimit = "false";
                }
            } else {
                if (header.choseTemp < 3) {
                    header.choseArr[index] = "true";
                    header.Data.DeviceName.push({ value: value, Id: Id });
                    header.choseTemp++;
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '最多可选三项',
                        showCancel: false,
                    })
                }
            }
            return header;
        },
        //更多左侧nav
        MoreSelect: function (e, header) {
            var idx = e.currentTarget.dataset.idx;
            header.more_select = idx;
            return header;
        },
        //主营行业选择
        choseIndustry: function (e, header) {
            var idx = e.currentTarget.dataset.index;
            header.ParentId = idx;
            header.MainIndustryArray_T = header.MainIndustryArray[idx].SubIndustries;
            return header;
        },
        //二级行业选择
        choseIndustry_T: function (e, header) {
            var idx = e.currentTarget.dataset.typeid;
            var parentId = e.currentTarget.dataset.parentid;
            var name = e.currentTarget.dataset.typename;
            //存选择的值
            header.Data.MoreName.Industry.Name = name;
            header.Data.MoreName.Industry.Id = idx;
            header.Data.MoreName.Industry.parentId = parentId;
            header.ChildId = idx;
            return header;
        },
        //右侧选择
        choseMore_right: function (e, header) {
            var idx = e.currentTarget.dataset.id;
            var name = e.currentTarget.dataset.value;
            header.MoreId = idx;
            //存选择的值
            header.Data.MoreName.StaffNum.Name = name;
            header.Data.MoreName.StaffNum.Id = idx;
            return header;
        },
        //右侧选择
        choseMoreType_right: function (e, header) {
            var idx = e.currentTarget.dataset.id;
            var name = e.currentTarget.dataset.value;
            header.MoreTypeId = idx;
            //存选择的值
            header.Data.MoreName.MoreType.Name = name;
            header.Data.MoreName.MoreType.Id = idx;
            return header;
        },
        //清空按钮
        EventEmpty: function (header) {
            header.MoreId = "-1";
            header.MoreTypeId = "-1";
            header.ParentId = '0';
            header.ChildId = "";
            header.MoreName = "更多";
            header.MoreColor = false;
            header.Data.MoreName = {
                Industry: {
                    Name: '',
                    Id: ''
                },
                StaffNum: {
                    Name: '',
                    Id: ''
                },
                MoreType: {
                    Name: '',
                    Id: ''
                }
            };
            return header
        },
        //更多确定按钮判断
        checkMore: function (header) {
            var obj = header.Data.MoreName;
            var i = 0;
            if (obj.Industry.Name != "") {
                i++
                header.MoreName = obj.Industry.Name
            }
            if (obj.StaffNum.Name != '') {
                i++
                header.MoreName = obj.StaffNum.Name
            }
            if (obj.MoreType.Name != '') {
                i++
                header.MoreName = obj.MoreType.Name
            }
            if (i != 1) {
                header.MoreName = "更多";
            }
            if (i == 0) {
                header.MoreColor = false;
            } else {
                header.MoreColor = true;
            }
            return header
        },
        //输入框聚焦
        EventFocus: function (e, header) {
            header.left = "20rpx";
            header.width = "535rpx";
            header.textLeft = "left";
            header.paddingLeft = "50rpx";
            header.inputFocus = "inline-block";
            header.Searching = false;
            if (header.inputValue != '') {
                header.SearchTxt = "搜索"
                header.ClearShow = false;
            } else {
                header.SearchTxt = "取消"
                header.ClearShow = true;
            }
            return header;
        },
        //取消
        EventConsole: function (header) {
            if (header.pageId == 1) {
                header.left = "155rpx";
            } else {
                header.left = "135rpx";
            }
            header.width = "673rpx";
            header.textLeft = "center";
            header.paddingLeft = "0";
            header.inputFocus = "none";
            header.Searching = true;
            header.ClearShow = true;
            return header;
        },
        EventSearch: function (header) {
            header.left = "20rpx";
            header.width = "623rpx";
            header.textLeft = "left";
            header.paddingLeft = "50rpx";
            header.inputFocus = "none";
            header.Searching = true;
            header.ClearShow = true;
            return header;
        },
        setHeight: function (header) {
            var H = appInstance.globalData.addLog.Windowheight,
                W = appInstance.globalData.addLog.Windowwidth;
            wx.getSystemInfo({
                success: function (res) {
                    if (res.system.indexOf('Android') == -1) {
                        var areaH = parseInt(H - (W / 750 * (455 + 88)));
                        var TypeH = parseInt(H - (W / 750 * (600 + 88)));
                    } else {
                        var areaH = parseInt(H - (W / 750 * 455));
                        var TypeH = parseInt(H - (W / 750 * 600));
                    }
                    header.areaHeight = areaH;
                    header.deviceTypeHeight = TypeH;
                }
            })
            return header;
        },
        //进入该公司详情页
        ToSupplier: function (e) {
            var EnterpriseId = e.currentTarget.dataset.enterpriseid;
            wx.navigateTo({
                url: '/page/home/mybussine/mybussine?enterpriseId=' + EnterpriseId,
            })
        },
        sevice: function (header, that) {
            // 获取设备类型
            appInstance.reqGet("BaseData/GetQueryCondition", function (res) {
                if (!res) {
                    wx.showToast({
                        title: '数据请求失败，请检查网络',
                        icon: 'loading'
                    })
                }
                // 获取设备类型、获取加工类型
                for (var i = 0; i < res.DeviceType.length + 1; i++) {
                    header.choseArr[i] = "false"
                }
                if (header.pageId == 1) {
                    header.typeList = res.DeviceType;
                    header.MoreTypeArray = res.ProcessType;
                } else {
                    header.MoreTypeArray = res.DeviceType;
                    header.typeList = res.ProcessType;
                }
                // 获取员工人数
                header.MoreArray = res.Staff;
                // 获取主营行业
                header.MainIndustryArray = res.Industry; //一级行业
                header.MainIndustryArray_T = res.Industry[0].SubIndustries;//二级行业
                // 获取距离范围
                header.Data.Nearby = res.Distance;
            })
            return header;
        },
    }
}();

module.exports = {
    search: search
}
