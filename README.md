## Challenge for Jobscan

I developed the repository for Jobscan. To use this frontend you need to have the backend working properly. If you don't have the backend, get the information [here](https://github.com/jobscan-projects/evertontst-takehome).

## Build Setup

## Database
We need the backend to display the correctly result. To this, we need to set the database

To connect with the backend you will need to change the .env file, for example:
API_URL = http://localhost/api

## Build 

# With Docker
If the backend is set. And you have docker installed, you can set it up by running the build.sh script in this repo, this will setup the containers in docker (and run them) and install dependencies
```bash
sh build.sh
```
# Without Docker

If the backend is set. You need to set in this terminal
```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```
## Tests

```bash
yarn run test
```
# Front-end
We want to provide a web interface for your friend to view a list of relevant job opportunities based on their skills and this list of job postings. Vue.js is preferred, but you may use React or Angular as well. The application should...
 Allow your friend to select up to 10 skills from a list of skills. The list should include skills that appear in the provided list of job postings.
 Rate themself on each skill on a scale of 1-5.
 Display the most relevant job postings from the provided list based on your friend's skills along with a relevance score. The score of each job description should be an integer representing the sum of ratings for each of the matched skills.
 Display the list of job postings with the highest score first.
 Share your front-end project with us. Please include setup instructions!
 
# Back-end
Feel free to modify and extend the Laravel app to meet your needs.
 One of our unit tests is failing, investigate and adjust as necessary. Create a pull request to resolve the issue.
