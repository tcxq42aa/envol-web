#!/usr/bin/env bash
sshpass -p Welcome.sanzang scp ./releases/sz.envol.vip.tar.gz root@39.104.66.184:/root/envol-sz/
sshpass -p Welcome.sanzang ssh -o StrictHostKeyChecking=no root@39.104.66.184 "source /etc/profile && cd /root/envol-sz && rm -rf sz.envol.vip && tar -xzvf sz.envol.vip.tar.gz && pm2 stop ./sz.envol.vip/bin/www && NODE_ENV=prod pm2 start ./sz.envol.vip/bin/www --log-date-format 'DD-MM HH:mm:ss.SSS'"
