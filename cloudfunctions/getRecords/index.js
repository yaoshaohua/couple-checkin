const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-0gfoieecca262cd4'
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    let query = db.collection('records')

    if (event.type && event.type !== 'all') {
      query = query.where({
        type: event.type
      })
    }

    const result = await query.orderBy('createTime', 'desc').get()

    return {
      code: 200,
      msg: '查询成功',
      data: result.data
    }
  } catch (err) {
    return {
      code: 500,
      msg: '查询失败',
      error: err.message
    }
  }
}
