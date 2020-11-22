# V2Board

[V2Board](https://github.com/v2board/v2board) 是近年新开发的又一个机场面板之一，因界面优雅、配置明了而深受广大机场主喜爱。

## 功能特性

- 支持 Shadowsocks、Vmess、Trojan 协议
- Laravel 框架开发
- 稳定、简单、快速
- 单一版本

## 安装

### 环境依赖

- PHP >= 7.3
- Nginx >= 1.17
- MySQL = 5.x
- Redis

基础环境安装参见 [Linux 基础](../linux.md)。

### 面板安装

#### 获取面板代码

```shell script
# 创建目录
cd /var/www
mkdir v2board

# 拉取代码
cd v2board
git clone https://github.com/v2board/v2board.git ${PWD}

# 下载 composer
wget https://getcomposer.org/installer -O composer.phar

# 安装 PHP 依赖
php composer.phar
php composer.phar install

# 执行面板安装命令，根据提示完成安装
php artisan v2board:install

# 调整目录权限
chmod -R 755 ${PWD}
chown -R www-data:www-data ${PWD}
```

#### Nginx 配置

需要使用的伪静态配置如下。

```nginx
location / {  
    try_files $uri $uri/ /index.php$is_args$query_string;  
}
```

完整的 Nginx 配置如下，将文件放置在 `/etc/nginx/sites-available/v2board.conf`，Nginx 配置文件的常用目录请参考 [SSPanel](./sspanel.md#nginx-配置)。

```nginx
server {  
    listen 80;
    listen [::]:80;
    root /var/www/v2board/public; # 改成你自己的路径，需要以 /public 结尾
    index index.php index.html;
    server_name sspanel.host; # 改成你自己的域名

    location /downloads {}

    location / {  
        try_files $uri $uri/ /index.php$is_args$query_string;  
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.3-fpm.sock;
    }

    location ~ .*\.(js|css)?$
    {
        expires 1h;
        error_log off;
        access_log /dev/null; 
    }
}
```

再在 `/etc/nginx/sites-enabled` 下配置软连接。

```shell script
cd /etc/nginx/sites-enabled
ln -s /etc/nginx/sites-available/v2board.conf v2board
```

重新加载 Nginx 配置。

```shell script
nginx -s reload
```

#### 配置定时任务

使用 `crontab -e` 进入 crontab 编辑界面，添加如下定时任务。

```crontab
# 注意修改为自己的目录
*/1 * * * * php /var/www/v2board/artisan schedule:run
```

#### 队列服务

首先安装 Node.js 14.x。

```shell script
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```

检查 Node.js 版本。

```shell script
$ node -v
v14.15.0
```

安装 Node.js 后也会同时安装 NPM，这是 Node.js 的依赖管理器，检查 NPM 的版本。

```shell script
$ npm -v
6.14.8
```

Node.js 与 NPM 安装完成后，即可开始安装 PM2。

```shell script
# 全局安装最新版的 PM2
sudo npm install pm2@latest -g
```

启动队列服务。

```shell script
cd /var/www/v2board
pm2 start pm2.yaml

# 开机启动
pm2 startup
systemctl enable pm2-root
```

查看队列服务状态。

```shell script
$ pm2 list
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ V2Board    │ default     │ N/A     │ fork    │ 32329    │ 8s     │ 0    │ online    │ 0%       │ 39.0mb   │ root     │ disabled │
│ 1   │ V2Board    │ default     │ N/A     │ fork    │ 32330    │ 8s     │ 0    │ online    │ 0%       │ 38.8mb   │ root     │ disabled │
│ 2   │ V2Board    │ default     │ N/A     │ fork    │ 32331    │ 7s     │ 0    │ online    │ 0%       │ 38.6mb   │ root     │ disabled │
│ 3   │ V2Board    │ default     │ N/A     │ fork    │ 32332    │ 7s     │ 0    │ online    │ 0%       │ 38.9mb   │ root     │ disabled │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

查看 PM2 开机启动状态。

```shell script
$ systemctl status pm2-root
● pm2-root.service - PM2 process manager
   Loaded: loaded (/etc/systemd/system/pm2-root.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2020-11-22 22:01:49 CST; 4min 44s ago
     Docs: https://pm2.keymetrics.io/
  Process: 32276 ExecStop=/usr/lib/node_modules/pm2/bin/pm2 kill (code=exited, status=0/SUCCESS)
  Process: 32288 ExecStart=/usr/lib/node_modules/pm2/bin/pm2 resurrect (code=exited, status=0/SUCCESS)
 Main PID: 32310 (node)
    Tasks: 15 (limit: 1107)
   CGroup: /system.slice/pm2-root.service
           ├─32310 PM2 v4.5.0: God Daemon (/root/.pm2)
           ├─32329 php artisan queue:work --queue=send_email,send_telegram
           ├─32330 php artisan queue:work --queue=send_email,send_telegram
           ├─32331 php artisan queue:work --queue=send_email,send_telegram
           └─32332 php artisan queue:work --queue=send_email,send_telegram

Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: [PM2] Process /bin/bash restored
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: ┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: │ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: ├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: │ 0   │ V2Board    │ default     │ N/A     │ fork    │ 32329    │ 0s     │ 0    │ online    │ 0%       │ 27.2mb   │ root     │ disabled │
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: │ 1   │ V2Board    │ default     │ N/A     │ fork    │ 32330    │ 0s     │ 0    │ online    │ 0%       │ 26.9mb   │ root     │ disabled │
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: │ 2   │ V2Board    │ default     │ N/A     │ fork    │ 32331    │ 0s     │ 0    │ online    │ 0%       │ 25.7mb   │ root     │ disabled │
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: │ 3   │ V2Board    │ default     │ N/A     │ fork    │ 32332    │ 0s     │ 0    │ online    │ 0%       │ 17.3mb   │ root     │ disabled │
Nov 22 22:01:49 VM-0-5-ubuntu pm2[32288]: └─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Nov 22 22:01:49 VM-0-5-ubuntu systemd[1]: Started PM2 process manager.
```

## 进阶使用

### 后端节点

#### 概念解析

- 连接端口和服务端口

   连接端口是用户连接所使用的端口，服务端口为节点提供服务所使用的端口。
   
   > 假设你有一台中转服务器将 A 服务器 1234 端口数据转发到 B 服务器 4567 端口，那么用户连接 A 服务器，而后端节点部署于 B 服务器。此时，连接端口为 A 服务器的 1234 端口，服务端口为 B 服务器的 4567 端口。

- 父节点与子节点

   一般只有多入口单出口（多中转单落地）的情况下才会使用到。
   
   - 父节点用于服务端获取节点配置及客户端连接所使用，假设使用的是官方的服务端只需要在 V2Board 进行节点配置无需额外在服务端进行配置，配置将会自动从 V2Board 获取一键部署。

   - 子节点继承父节点的节点状态以便显示正确的节点状态展示给用户，参数配置只做为客户端连接使用，不会与服务端进行交互。节点倍率同步父节点。

#### 由 V2Board 官方团队维护的后端

仅支持 V2Board。

- Shadowsocks

  - [项目群组](https://t.me/tidal_lab)

- V2ray

  - [项目群组](https://t.me/tidal_lab)
  - [项目地址](https://github.com/tokumeikoi/aurora)

- Trojan

  - [项目群组](https://t.me/tidal_lab)
  - [项目地址](https://github.com/tokumeikoi/tidalab-trojan)

#### 第三方提供的后端

参考 [节点](../node.md)。

### Telegram

