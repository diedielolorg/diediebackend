#!/bin/bash
sudo chmod -R 777 /home/ubuntu/diediebackend // sudo 권한 부여

#navigate into our working directory
cd /home/ubuntu/diediebackend 프로젝트 루트 경로 접근

#install node modules & update swagger & pm2 reload
sudo npm ci 패키지 설치
sudo pm2 reload main pm2 reload