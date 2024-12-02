#!/bin/bash

# UID & GID
uid=1002990000
# group name & user name
username=getapp

# Add the user to /etc/passwd
echo "${username}:x:${uid}:${uid}:/home/${username}:/sbin/nologin" >> /etc/passwd

# Add the user to /etc/group
echo "${username}:x:${uid}:" >> /etc/group

