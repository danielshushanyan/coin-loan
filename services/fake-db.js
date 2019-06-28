export default {
  setToLocalStorage(budgets) {
    localStorage.setItem('CL_Budgets', JSON.stringify(budgets))
  },
  getFromLocalStorage(store) {
    const budgets = JSON.parse(localStorage.getItem('CL_Budgets'))

    if (
      budgets &&
      JSON.stringify(budgets) !== JSON.stringify(store.getters.allBudgets)
    ) {
      budgets.forEach(item => {
        store.dispatch('setBudget', item)
      })
    }
  }
}
