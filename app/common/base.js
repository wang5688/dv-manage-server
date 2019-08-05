const IdModel = require('../models/Ids');

class Base {
  constructor() {
    this.idList = ['userId']; // id类型 用于id的自增
  }

  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误');
      return;
    }

    try {
      const idData = await IdModel.findOne();
      idData[type] += 1; // id自增
      await idData.save();
      return idData[type]; // 返回自增最新的id
    } catch (e) {
      console.log('获取id失败');
    }
  }
}

module.exports = Base;