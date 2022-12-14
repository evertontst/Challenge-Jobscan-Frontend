import skills from './modules/skills'

export const modules = {
  skills
}

export const state = () => ({
  counter: 0,
  apiBase: process.env.API_URL
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}