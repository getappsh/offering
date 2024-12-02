#! /bin/bash

#ci-cd script to update the ec2 instance with the latest version of node image

# stop the current running containers
echo "docker-compose -f docker-compose-aws.yaml down"
docker-compose -f getapp-api/docker-compose-aws.yaml down

# Check if image exists before attempting to remove it
echo "remove the old image from the VM"

# the "|| true" at the end allows to return 0 even when there is no image on the machin.
docker images | grep harbor.getapp.sh/getapp-dev/api | awk '{print $3}' | xargs -I {} docker rmi {} || true
echo "docker-compose -f docker-compose-aws.yaml up -d"
docker-compose -f getapp-api/docker-compose-aws.yaml up -d


