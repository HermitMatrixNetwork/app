/*
 * @Author: 黄海聪
 * @Date: 2022-06-23 15:17:17
 * @LastEditors: 黄海聪
 * @FilePath: /utils/validator.js
 * @Description: In User Settings Edit
 */

const validator = {
  required(val) {
    if (val.length == 0) return false
    return true
  },
  min(val, rule) {
    if (val.length < rule.len) return false
    return true
  },
  max(val, rule) {
    if (val.length > rule.len) return false
    return true
  }
}

/**
 *适配校验器并运行
 * @param { string } target 字段名
 * @returns { object } result 校验结果
 */
export function validate(target) {
  let value = this[target]
  let rules = this.rules
  if (!rules) return console.error('没有配置校验规则')
  if (value == null || value == undefined) return console.error('校验值不能为null或undefined')
  rules = rules[target] || rules
  let result = true
  let message = ''
  if (Array.isArray(rules)) {
    for (let rule of rules) {
      result = runValidation.call(this, rule, value)
      if (result == false) {
        message = rule.errMessage || `值:${target} 没有配置错误信息`
        break
      }
    }
  } else {
    result = runValidation.call(this, rules, value)
    if (result == false) message = rules.errMessage || `值:${target} 没有配置错误信息`
  }
  if (message !== '') console.error(message)

  return {
    fieldName: target,
    result,
    errMessage: message
  }
}


/**
 * @param { object } rule 校验规则
 * @param { any } value 带校验的值
 * @returns { boolean } result 校验结果
 */
export function runValidation(rule, value) {
  let result
  let fn
  if (rule.validator || typeof rule.validator === 'function') {
    result = rule.validator.call(this, value)
  } else {
    fn = validator[rule.rule]
    if (!fn) {
      console.warn(`暂不支持${rule.rule}校验规则`)
      return true
    }
    result = fn(value, rule)
  }
  return result
}

/** 
 * @param { object | array } rules 校验规则
 * @returns { array } 校验结果(多条或单条) 
 */

export function validateAll(rules) {
  const result = []
  for (let target in rules) {
    result.push(validate.call(this, target))
  }
  return result
}
