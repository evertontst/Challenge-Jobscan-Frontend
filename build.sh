#!/bin/bash
docker build -t jobscan . 
open http://localhost:3000
docker run --name jobscan -it -p 3000:3000 jobscan