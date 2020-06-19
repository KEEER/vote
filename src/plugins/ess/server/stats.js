const getStats = (question, answers) => {
  switch (question.type) {
  case 'VCheckbox': {
    const count = {}
    for (const { value } of question.options || []) {
      count[value] = answers.filter(answer => answer && answer[value]).length
    }
    return count
  }

  case 'VRadio': {
    const count = {}
    for (const { value } of question.options || []) {
      count[value] = answers.filter(answer => answer === value).length
    }
    return count
  }

  case 'VText':
  case 'VTextarea':
    return {
      data: answers.slice(0, 64),
      hasMore: answers.length > 64,
    }
  }
}

export function handleGetStats (options) {
  const { question, answers, set } = options
  const stats = getStats(question, answers, options)
  if (stats) return set(stats)
}
