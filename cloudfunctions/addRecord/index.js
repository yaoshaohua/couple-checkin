const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-0gfoieecca262cd4'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { type, reason, score } = event

  if (!type || !reason || !score) {
    return {
      code: 400,
      msg: '参数缺失（type/reason/score不能为空）'
    }
  }

  try {
    const result = await db.collection('records').add({
      data: {
        type,
        reason,
        score,
        createTime: db.serverDate()
      }
    })

    return {
      code: 200,
      msg: '新增成功',
      data: result
    }
  } catch (err) {
    return {
      code: 500,
      msg: '新增失败',
      error: err.message
    }
  }
}
