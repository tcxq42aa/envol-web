#!/usr/bin/env bash
sshpass -p Xuqi.321 scp ./releases/qimeng.envol.vip.tar.gz root@47.104.91.246:/root/envol-qimeng/
sshpass -p Xuqi.321 ssh -o StrictHostKeyChecking=no root@47.104.91.246 "source /etc/profile && cd /root/envol-qimeng && rm -rf qimeng.envol.vip && tar -xzvf qimeng.envol.vip.tar.gz && pm2 stop ./qimeng.envol.vip/bin/www && NODE_ENV=prod pm2 start ./qimeng.envol.vip/bin/www --log-date-format 'DD-MM HH:mm:ss.SSS'"
