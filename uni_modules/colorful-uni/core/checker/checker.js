const checker = {
  //当出现错误时返回错误消息，否则返回空即为验证通过
  /*
   *1.formData:Object 表单对象。{key:value,key:value},key==rules.name
   *2.rules:Array 检验规则 [{name:name,rule:[],msg:[]},{name:name,rule:[],msg:[]}]
   *	name:name 属性=> 元素的名称
   *	rule:字符串数组 ["required","isMobile","isEmail","isCarNo","isIdCard","isAmount","isNum","isChinese","isEnglish",
   *  isEnAndNo","isSpecial","isEmoji",""isDate","isUrl","isSame:key","isRange:[1,9]","minLength:9","maxLength:Number"]
   *	msg:数组 []。 与数组 rule 长度相同,对应的错误提示信息
   */
  validation: function (formData, rules) {
    for (let item of rules) {
      let key = item.name;
      let rule = item.rule;
      let msgArr = item.msg;
      let checkValue = formData[key] === undefined ? "" : formData[key];
      if (
        !key ||
        !rule ||
        rule.length === 0 ||
        !msgArr ||
        msgArr.length === 0
      ) {
        continue;
      }
      // 如果不包含required必填校验，未填写执行下次循环
      if (rule[0] !== "required" && !checkValue) {
        continue;
      }
      for (let i = 0, length = rule.length; i < length; i++) {
        let ruleItem = rule[i];
        let msg = msgArr[i];
        if (!ruleItem || !msg) {
          continue;
        }
        //数据处理
        let isNo = false; // 是否含有！
        let extraItem = null;
        if (~ruleItem.indexOf(":")) {
          let temp = ruleItem.split(":");
          ruleItem = temp[0];
          extraItem = temp[1];
        }
        if (~ruleItem.indexOf("!")) {
          isNo = true;
          ruleItem = ruleItem.slice(1);
        }
        if (!checker[`_${ruleItem}`]) {
          return "Not Found Function";
        }
        let isError = checker[`_${ruleItem}`](checkValue, extraItem, formData);
        isError = isNo ? !isError : isError;
        if (isError) {
          return typeof isError === "string" ? isError : msg;
        }
      }
    }
    return "";
  },
  _required: function (value) {
    return value === null || value === "" || value === undefined ? true : false;
  },
  _isMobile: function (value) {
    return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(
      value
    );
  },
  _isEmail: function (value) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
      value
    );
  },
  _isCarNo: function (value) {
    // 新能源车牌
    const xreg =
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    // 旧车牌
    const creg =
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (value.length === 7) {
      return creg.test(value);
    } else if (value.length === 8) {
      return xreg.test(value);
    } else {
      return false;
    }
  },
  _isIdCard: function (value) {
    let idCard = value;
    if (idCard.length == 15) {
      return this.__isValidityBrithBy15IdCard;
    } else if (idCard.length == 18) {
      let arrIdCard = idCard.split("");
      return (
        this.__isValidityBrithBy18IdCard(idCard) &&
        this.__isTrueValidateCodeBy18IdCard(arrIdCard)
      );
    } else {
      return false;
    }
  },
  __isTrueValidateCodeBy18IdCard: function (arrIdCard) {
    let sum = 0;
    let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    let ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    if (arrIdCard[17].toLowerCase() == "x") {
      arrIdCard[17] = 10;
    }
    for (let i = 0; i < 17; i++) {
      sum += Wi[i] * arrIdCard[i];
    }
    let valCodePosition = sum % 11;
    return arrIdCard[17] == ValideCode[valCodePosition];
  },
  __isValidityBrithBy18IdCard: function (idCard18) {
    let year = idCard18.substring(6, 10);
    let month = idCard18.substring(10, 12);
    let day = idCard18.substring(12, 14);
    let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    return !(
      temp_date.getFullYear() != parseFloat(year) ||
      temp_date.getMonth() != parseFloat(month) - 1 ||
      temp_date.getDate() != parseFloat(day)
    );
  },
  __isValidityBrithBy15IdCard: function (idCard15) {
    let year = idCard15.substring(6, 8);
    let month = idCard15.substring(8, 10);
    let day = idCard15.substring(10, 12);
    let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    return !(
      temp_date.getYear() != parseFloat(year) ||
      temp_date.getMonth() != parseFloat(month) - 1 ||
      temp_date.getDate() != parseFloat(day)
    );
  },
  //金额，只允许保留两位小数
  _isAmount: function (value) {
    return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
  },
  //只能为数字
  _isNum: function (value) {
    return /^[0-9]+$/.test(value);
  },
  // 是否为中文
  _isZh: function (value) {
    let reg = /.*[\u4e00-\u9fa5]+.*$/;
    return (
      value !== "" &&
      reg.test(value) &&
      !checker._isSpecial(value) &&
      !checker._isEmoji(value)
    );
  },
  // 是否问英文
  _isEn: function (value) {
    return /^[a-zA-Z]*$/.test(value);
  },
  //8~20位数字和字母组合
  _isEnAndNum: function (value) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
  },
  //英文或者数字
  _isEnOrNum: function (value, length) {
    let reg = /.*[\u4e00-\u9fa5]+.*$/;
    let result = true;
    if (
      reg.test(value) ||
      checker._isSpecial(value) ||
      checker._isEmoji(value)
    ) {
      result = false;
    }
    if (length) {
      result = value.length === length;
    }
    return result;
  },
  //是否包含特殊字符
  _isSpecial: function (value) {
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
      return true;
    }
    return false;
  },
  //是否包含中文特殊字符
  _isSpecialZh: function (value) {
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regCn.test(value)) {
      return true;
    }
    return false;
  },
  //是否包含表情
  _isEmoji: function (value) {
    return /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(value);
  },
  //2019-10-12
  _isDate: function (value) {
    const reg =
      /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
    return reg.test(value);
  },
  _isUrl: function (value) {
    return /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
      value
    );
  },
  _isSame: function (value1, value2, data) {
    return value1 === data[value2];
  },
  _isRange: function (value, rangeValue) {
    let range = null;
    try {
      range = JSON.parse(rangeValue);
      if (range.length <= 1) {
        throw new Error("range值传入有误！");
      }
    } catch (e) {
      return "range值传入有误！";
    }
    let range1 = range[0],
      range2 = range[1];
    if (!range1 && range1 != 0 && !range2 && range2 != 0) {
      return true;
    } else if (!range1 && range1 != 0) {
      return value <= range2;
    } else if (!range2 && range2 != 0) {
      return value >= range1;
    } else {
      return value >= range1 && value <= range2;
    }
  },
  _minLength: function (value, min) {
    return value.length < Number(min);
  },
  _maxLength: function (value, max) {
    return value.length > Number(max);
  }
};

export default checker;
