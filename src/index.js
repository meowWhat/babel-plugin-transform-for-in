
module.exports = ({ types: t }) => {
  return {
    visitor: {
      ForInStatement(path) {
        try {
          const node = path.node
          let key
          if (t.isVariableDeclaration(node.left)) {
            key = node.left.declarations[0].id
          } else {
            key = node.left
          }
          const value = node.right
          const body = node.body
          //  如果子语句含有 hasOwnProperty 则跳过
          let test
          if (t.isIfStatement(body)) {
            test = body.test
          }
          if (body.body && t.isIfStatement(body.body[0])) {
            test = body.body[0].test
          }
          if (t.isCallExpression(test)) {
            const callee = test.callee
            if (t.isMemberExpression(callee) && t.isMemberExpression(callee.object)) {
              const object = callee.object
              if (object.object && object.object.name === 'Object' && object.property && object.property.name === 'hasOwnProperty') {
                return
              }
            }
          }
          // 替换 for in => for in { if (hasOwnProperty)}
          const bodyPath = path.get('body')
          const memberExpression = t.memberExpression(
            t.memberExpression(t.identifier('Object'), t.identifier('hasOwnProperty')),
            t.identifier('call')
          )
          const callExpression = t.callExpression(
            memberExpression,
            [value, key]
          )
          bodyPath.replaceWith(
            t.blockStatement([t.ifStatement(callExpression, body)])
          )
        } catch (error) {
          console.log(error)
          throw path.buildCodeFrameError("Error message here")
        }
      }
    },
  }
}