export default form => {
  form.on('validateQuestionOverride', ({ question, data, ctx, finalize }) => {
    const isHidden = ctx.state.branchHiddenState || {}
    // calculate state once and only once
    if (!ctx.state.branchHiddenState) {
      for (const q of form.questions) isHidden[q.id] = !!q.getConfig('branch', 'at-branch', false)
      for (const q of form.questions) {
        if (isHidden[q.id]) continue
        const branches = q.getConfig('branch', 'branches')
        if (!branches) continue
        const answer = data[q.id]
        if (answer == null || answer === '') continue // intentionally not ===
        const branch = branches[answer]
        for (const otherQuestion of form.questions) {
          const at = otherQuestion.getConfig('branch', 'at-branch')
          if (!at) continue
          isHidden[otherQuestion.id] = at !== branch
        }
      }
    }
    ctx.state.branchHiddenState = isHidden
    if (isHidden[question.id]) return finalize()
  })
}
