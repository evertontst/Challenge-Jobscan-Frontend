<template>
  <div>
    <nav>
      <div class="logo">
        <Logo />
      </div>
    </nav>
    <div class="content">
      <div class="info">
        <h1>Job Matcher</h1>
        <div class="panel">
          <p><strong>Cherry pick skills and qualifications personalized for you</strong> to match the best jobs for your skillset.</p>
          <p>The more you use it and the more scans you complete, the smarter the skills and jobs will be.</p>
          
          <div v-if="jobs.length == 0">
            <div class="title">
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="svg-thunder">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
                </svg>
                <h5>Skills</h5>
              </div>
            </div>
            <div class="flexResults">
              <div class="get-results">
                <p>Type the name of a skills to search</p>
                <input
                  id="search"
                  v-model="searchTerm"
                  type="text"
                  placeholder="Type here..."
                >
                <ul
                  v-if="searchSkills.length"
                >
                  <li class="showing-results">
                    Showing {{ searchSkills.length }} of {{ skills.length }} results
                  </li>
                  <li
                      v-for="skill in searchSkills"
                      :key="skill.name"
                      class="cursor-pointer hover:bg-gray-100 p-1"
                      @click="selectSkill(skill)"
                  >
                    {{ skill.name }}
                  </li>
                </ul>
              </div>   
              <div v-if="selectedSkill.length > 0" class="list-results">
                You have selected <strong v-if="selectedSkill.length == 1">{{ selectedSkill.length  }} skill</strong><strong v-else>{{ selectedSkill.length  }} skills</strong> you can select up to <strong>10 skills</strong>.
                <p>Rating your knowledge or remove a skill</p>
                <div v-if="hasMsg">
                  <div class="messageError">
                    {{ messageError }}
                  </div>
                </div>
                <div v-for="select in selectedSkill" :key="select.id">                   
                  <div class="rating">
                    <p>{{select.name }}</p>
                    <input :id="`rating-5-${select.id}`" v-model="select.rate" :name="`rating-5-${select.id}`" type="radio" value="5">
                    <label :for="`rating-5-${select.id}`"></label>
                    <input :id="`rating-4-${select.id}`" v-model="select.rate" :name="`rating-4-${select.id}`" type="radio" value="4">
                    <label :for="`rating-4-${select.id}`"></label>
                    <input :id="`rating-3-${select.id}`" v-model="select.rate" :name="`rating-3-${select.id}`" type="radio" value="3">
                    <label :for="`rating-3-${select.id}`"></label>
                    <input :id="`rating-2-${select.id}`" v-model="select.rate" :name="`rating-2-${select.id}`" type="radio" value="2">
                    <label :for="`rating-2-${select.id}`"></label>
                    <input :id="`rating-1-${select.id}`" v-model="select.rate" :name="`rating-1-${select.id}`" type="radio" value="1">
                    <label :for="`rating-1-${select.id}`"></label>
                    <span @click="removeSelectedSkill(select)">
                      <i class="fa fa-ban remove-skill" title="Remove a skill from your profile" alt="Remove a skill from your profile"></i>
                    </span>
                  </div>
                </div>  
                <button @click="searchBySkills(selectedSkill)">
                  Next
                  <i class="fa fa-angle-right fa-fw" aria-hidden="true"></i>
                </button>
              </div>   
            </div>
          </div>
          <div v-else>
            <div class="title">
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="svg-thunder">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
                </svg>
                <h5>Jobs</h5>
              </div>
            </div>
            <div class="list-jobs">
              <p>We found <b>{{ jobs.length }} jobs</b> with your skills</p>
              <div class="jobs-results">
                <div class="job-title">
                    <b>Title</b> 
                </div>
                <div class="job-company">
                    <b>Company</b> 
                </div>
                <div class="job-score">
                    <b>Score</b> 
                </div>
                <div v-for="job in jobs" :key="job.id">
                  <div class="job-title">
                    {{ job.title }}
                  </div>
                  <div class="job-company">
                    {{ job.company.name }}
                  </div>
                  <div class="job-score">
                    {{ job.score }}
                  </div>
                </div>
              </div>
            </div>

            <div class="new-search">
              <button @click="newSearch()">
                  New search
                  <i class="fa fa-angle-right fa-fw" aria-hidden="true"></i>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>

export default {
  name: 'IndexPage',
  components: {
    Logo: () => import('~/components/LogoJobscan.vue'),
  },
  data () {
    return {
      isLoading: true,
      hasMsg: false,
      jobs: [],
      messageError: undefined,
      searchTerm: '',
      selectedSkill: [],
      skillToSearch: [],
      results: null
    }
  },
  head: {
    title: 'Jobscan - Job Matcher',
    meta: [
      {
        hid: 'description',
        name: 'description',  
        content: 'Select your skills to matched the perfect Jobs'
      }
    ],
  },
  computed: {
    skills () {
      return this.results
    },
    searchSkills () {
      if (this.searchTerm === '') {
        return []
      }
      let matches = 0

      return this.results.filter(skill => {
        if (
          skill.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          && matches < 10)
        {
          matches++
          return skill
        }
        return null
      })
    },
  },
  watch: {
    hasMsg () {
      if (this.hasMsg === true) {
        setTimeout(() => (this.hasMsg = false), 2000)
      }
    }
  },
  async created () {
    await this.$store.dispatch('skills/getSkills')
    this.results = this.$store.getters['skills/skills']
    this.isLoading = false
  },
  methods: {
    newSearch () {
      this.jobs = []
      this.selectedSkill = []
      this.results = this.$store.getters['skills/skills']
    },
    removeSelectedSkill(skillRemoved) {
      this.results.push(skillRemoved)
      this.selectedSkill = this.selectedSkill.filter(function (skill) {
          return skill.id !== skillRemoved.id
      })
    },
    selectSkill (skillReceived) {
      if(this.selectedSkill.length <= 9) {
        const filteredSkills = this.skills.filter(function (skill) {
          return skill.id !== skillReceived.id
        })
        this.results = filteredSkills
        skillReceived.rate = undefined
        this.selectedSkill.push(skillReceived)
        this.searchTerm = ''
      }
    },
    async searchBySkills(skills) {
      skills.forEach(skill => {
        if(!skill.rate) {
          this.hasMsg = true
          this.messageError = 'You need to rate your skill'
        }
      });
      if(this.hasMsg) {
        return
      }
      const skillQuery = skills.reduce(
        (a, v) => ({
          ...a,
          [v.slug]: v.rate,
        }),
        {},
      )
      
      
      
      this.jobs = await this.$store.dispatch(
        'skills/getJobs',
        skillQuery,
      )
    }
  }
}
</script>
<style lang="scss">
  .logo img { 
    height: 52px;
    vertical-align: middle;
    margin-top:15px;
  }
  .content input {
    padding: 1rem; 
    margin-bottom: 0.125rem;
    width: 15rem; 
    border: 1px solid transparent;
    background-color: #f1f1f1;
    font-size: 16px;
  }
  .panel {
    min-height: calc(100vh - 13.5rem);
    overflow: auto;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-color: #ddd;
    box-shadow: 0 0 15px lightgrey;
    text-align: left;
    padding: 1.5rem;
    p {
      line-height: 2;
    }
  }
  .messageError {
    background-color: #fff3cd;
    color: #856404;
    width: 90%;
    display: flex;
    align-items: center;
    font-weight: 400;
    flex: 0 1 auto;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    margin: 0.5rem 0;
    border-color: rgb(21 128 61);
    }
  label {
    width:18.75rem;
  }
  h1 {
    text-transform: uppercase;
    margin-top: 50px;
  }
  h5 {
    color: rgba(19,31,47);
  }
  .title {
    padding-bottom: 1rem;
    border-color: rgba(221,225,234);
    border-style: solid;
    border-width: 0;
    border-bottom-width: 1px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    border-style: solid;
    margin: 1.5rem 0;
    display: flex;
    height: 40px;
  }
  .svg-thunder {
    width: 2rem;
    color: rgba(245,158,11,1);
    vertical-align: middle;
    float: left;
    margin-right: 0.625rem;
  }
  .get-results {
    float: left;
    p {
      width:300px;
    }
  }
  ul {
    width: 15rem; 
    border-radius: 0.25rem;
    background-color: rgb(255 255 255);
    border-width: 1px;
    border-color: rgba(221,225,234);
    padding: 0.5rem 1rem;
    position: absolute;
    z-index: 10;
    margin-top: 0.25rem;
    li {
      width: 15rem; 
      padding: 0.25rem 0.25rem 0.5rem;
      border-color: rgb(229 231 235);
      border-bottom-width: 1px;
    }
  }
  .showing-results {
    padding: 0.25rem 0.25rem 0.5rem;
    font-weight: 700;
    border-color: rgb(229 231 235);
    border-bottom-width: 1px;
    color: rgb(19, 31, 47);
  }
  .list-results {
    font-size: 1.125rem; /* 18px */
    line-height: 1.75rem; 
    padding-top:0.5rem;
    width:60%;
    float: left;
    padding:0 1.25rem 0;
  }
  .list-jobs {
    line-height: 1.75rem;
    width:70%;
    float: left;
    p {
      margin-bottom:20px;
    }
  }
  .rating {
    display: flex;
    overflow: hidden;
    flex-direction: row-reverse;
    position: relative;
    justify-content: left;
    p {
      line-height: 2;
      display: inline-block;
      vertical-align: middle;
      margin: 1rem;
    }
    input {
      width: 60%;
      float:right;
    }
  }
  .remove-skill {
      line-height: 1.35;
      font-size: 2.1rem;
      display: inline-block;
      vertical-align: middle;
      margin-top: 1rem;
      color: #e3e3e3;
      cursor: pointer;
    }
  .remove-skill:hover {
    color:red;
  }
  
  .rating-0 {
    filter: grayscale(100%);
  }
  .rating > input {
    display: none;
  }
  .rating > label {
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-top: 1rem;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23e3e3e3' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 76%;
    transition: .3s;
  }
  .rating > input:checked ~ label,
  .rating > input:checked ~ label ~ label {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23fcd93a' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
  }
  .rating > input:not(:checked) ~ label:hover,
  .rating > input:not(:checked) ~ label:hover ~ label {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23d8b11e' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
  }
  
  .panel button {
    padding: 10px 20px;
    border: 2px #2aacea solid;
    background-color: #2aacea;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 2px;
    float: right;
    margin-right: 10%;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    user-select: none;
    background-image: none;
    text-decoration: none;
  }
  .new-search {
    width: 30%;
    float: right;
  }
  .job-results {
    display: inline-flex;
  }
  .job-title {
    width:40%;
    float:left;
    padding: 0.25rem 0;
  }
  .job-company {
    width:30%;
    padding: 0.25rem 0;
    float:left;
  }
  .job-score {
    width:30%;
    padding: 0.25rem 0;
    float:left;
  }
  .flexResults {
    width:100%;
  }
    .rating__icon--none {
    color: #eee;
  }
  @media only screen and (max-width: 1200px) and (min-width: 110px) {
    .new-search {
      width:15%;
    }
  }
  @media only screen and (max-width: 1100px) and (min-width: 800px) {
    .list-results {
      width:45%;
      margin-top:1rem;
    }
    .list-jobs {
      width: 100%;
    }
    .new-search {
      width: 100%;
      margin-top:1rem;
    }
  }
  @media only screen and (max-width: 799px) and (min-width: 299px) {
    .get-results {
      width:100%;
      display: inline-block;
    }
    .list-results {
      width:100%;
      display: inline-block;
      padding:10px 0;
    }
    .list-jobs {
      width: 100%;
    }
    .new-search {
      margin-top:10px
    }
    .panel button {
      margin-top:1.5rem
    }
    .job-title {
      width:60%
    }
    .job-score {
      width:10%
    }
  }
</style>

