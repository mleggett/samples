function sum (arr) {
  if (arr.length === 0) {
    return 0
  }
  const nextEle = arr[0]
  const remainder = sum(arr.slice(1))
  return val = nextEle + remainder
}

const array = [1,2,3,4,5]

console.log('* final',sum(array))
