export function handleGetStats ({ question, submissions, set }) {
  const answers = submissions.map(s => s.data[question.id])
  switch (question.options.type) {
  case 'VCheckbox': {
    const count = {}
    for (const { value } of question.options.options || []) {
      count[value] = answers.filter(answer => answer && answer[value]).length
    }
    return set(count)
  }

  case 'VRadio': {
    const count = {}
    for (const { value } of question.options.options || []) {
      count[value] = answers.filter(answer => answer === value).length
    }
    return set(count)
  }

  case 'VText':
  case 'VTextarea':
  {
    const res = {
      data: answers.slice(0, 64),
      hasMore: answers.length > 64,
    }
    return set(res)
  }
  }
}
