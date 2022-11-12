import { UnorderedMap, Vector } from "near-sdk-js"

export function isValueInVector(value: string | number, vector: Vector) {
  return getValuesInVector(vector).some((v) => v === value)
}

export function getValuesInVector(vector: Vector) {
  const values = []

  for (const value of vector.toArray()) {
    values.push(value)
  }

  return values
}

export function getValuesInHashMap(hashmap: UnorderedMap) {
  const values = []

  for (const key of hashmap.keys.toArray().sort()) {
    const value = hashmap.get(key as string)

    values.push({ [key as string]: value })
  }

  return values
}

export function internalSumOfBytes(seed: String) {
  const bytes = string2Bin(seed)

  const sum = bytes.reduce((acc, inc) => {
    acc += inc
    return acc
  }, 0)

  return sum
}
function string2Bin(str: String) {
  var result = []
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i))
  }
  return result
}
