#!/bin/bash
# start.sh
./wait-for-it.sh postgres:5432 -- npm start
