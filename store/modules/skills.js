export default {
  namespaced: true,
  state () {
    return {
      jobs: [],
      skill: {},
      skills: [],
      error: null,
      success: null
    }
  },
  mutations: {
    setJobs (state, jobs) {
      state.jobs = jobs
    },
    setSkill (state, skill) {
      state.skill = skill
    },
    setSkills (state, skills) {
      state.skills = skills
    },
    setError (state, error) {
      state.error = error
    },
    setSuccess (state, success) {
      state.success = success
    }
  },
  actions: {
    async getSkills ({ commit }) {
      try {
        const response = await this.$axios.$get(`${this.state.apiBase}/skills`)
        commit('setSkills', response)
      } catch (error) {
        commit('setError', error.message)
      } 
    },
    async getJobs ({ commit }, listSkills) {
      try {
        const response = await this.$axios.$post(`${this.state.apiBase}/postings/search/skills`,{ skill: listSkills })
        commit('setJobs', response.results)
        return response.results
      } catch (error) {
        commit('setError', error.message)
      } 
    },
    closeError ({ commit }) {
      commit('setError', null)
    },
    closeSuccess ({ commit }) {
      commit('setSuccess', null)
    }
  },
  getters: {
    jobs: state => state.jobs,
    skill: state => state.skill,
    skills: state => state.skills,
    error: state => state.error,
    success: state => state.success,
  }
}
