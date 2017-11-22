#!/usr/bin/env bash
sshpass -p Welcome1 scp ./releases/www.envol.vip.tar.gz root@47.92.104.90:/root/envol-web/
sshpass -p Welcome1 ssh -o StrictHostKeyChecking=no root@47.92.104.90 "source ~/.bash_profile && cd /root/envol-web && rm -rf www.envol.vip && tar -xzvf www.envol.vip.tar.gz && pm2 stop ./www.envol.vip/bin/www && NODE_ENV=production pm2 start ./www.envol.vip/bin/www"
