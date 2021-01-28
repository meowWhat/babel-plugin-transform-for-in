# Start

```json
  // .babelrc
  {
    "plugins":["babel-plugin-transform-for-in"]
  }
```

# Example
- in 

```javascript
for (var id in this.infoDict) {
  var info = this.infoDict[id]

  if (info.kind !== kind) {
    continue
  }

  var _s = info.pathArr.join('.')

  if (_s.indexOf(s) === 0) {
    if (!includingEqual && _s === s) {
      continue
    }

    res.push(info)
    continue
  }
```
- out

```javascript
for (var id in this.infoDict) {
  if (Object.hasOwnProperty.call(this.infoDict, id)) {
    var info = this.infoDict[id]

    if (info.kind !== kind) {
      continue
    } // 检查是否以 dataPath 开头


    var _s = info.pathArr.join('.')

    if (_s.indexOf(s) === 0) {
      if (!includingEqual && _s === s) {
        continue
      }

      res.push(info)
      continue
    }
  }
}

```