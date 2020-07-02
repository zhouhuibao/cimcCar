// 判断数据类型
const dataType = data => {
    return Object.prototype.toString
      .call(data)
      .split(' ')[1]
      .split(']')[0];
};

// 判断是否为空
const isEmpty = value => {
    if (dataType(value) === 'String') {
      return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') !== '';
    }
    if (dataType(value) === 'Undefined' || dataType(value) === 'Null') {
      return false;
    }
    return true;
};

// 判断值是不是数字
const isNumber = number => {
    if(!isEmpty(number) || dataType(number)==='Array'){
        return false
    }
    const num = Number(number)
    const reg=/^[0-9]+$/.test(num)
    if(!reg){
        return false
    }
    return num
}


module.exports={
    dataType,
    isNumber,
    isEmpty
}