# SSPanel

[SSPanel](https://github.com/Anankke/SSPanel-Uim) 是目前使用最为广泛的机场 Web 面板之一，根据其开发历史，分为多个不同时期的版本，目前开发最为活跃且生态最好的是 [SSPanel-Uim](https://github.com/Anankke/SSPanel-Uim)，以下 SSPanel 均代指该版本。

## 功能特性

- 支持 Shadowsocks、ShadowsocksR、V2Ray、Trojan
- 集成超过 8 种支付方式
- 支持流量审计
- 商品设置细化，支持同时连接设备数、用户限速等属性
- 返利机制

## 安装

### 环境依赖

- MySQL
- PHP 7.2+
- Composer

基础环境安装参见 [Linux 基础](../linux.md)。

### 面板

#### 获取面板代码

```shell script
# 创建目录
cd /var/www/
mkdir sspanel

# 拉取代码
cd sspanel
git clone -b dev https://github.com/Anankke/SSPanel-Uim.git ${PWD}

# 下载 composer
git config core.filemode false
wget https://getcomposer.org/installer -O composer.phar

# 安装 PHP 依赖
php composer.phar
php composer.phar install

# 调整目录权限
chmod -R 755 ${PWD}
chown -R www-data:www-data ${PWD}
```

#### Nginx 配置

需要使用的伪静态配置如下。

```nginx
location / {
    try_files $uri /index.php$is_args$args;
}
```

::: tip 提示
如果是按照 [Linux 基础](../linux.md) 安装的 Nginx，那么默认的 Nginx 配置文件会存放在 `/etc/nginx` 目录下，其中 `/etc/nginx/sites-available` 表示所有网站配置，`/etc/nginx/sites-enabled` 表示所有开启的网站配置。一般来说，`/etc/nginx/sites-enabled` 存放的均为指向 `/etc/nginx/sites-available` 内文件的软连接，以保证配置文件的一致性。
:::

完整的 Nginx 配置示例如下，将文件放在 `/etc/nginx/sites-available/sspanel.conf`。

```nginx
server {  
    listen 80;
    listen [::]:80;
    root /var/www/sspanel/public; # 改成你自己的路径，需要以 /public 结尾
    index index.php index.html;
    server_name sspanel.host; # 改成你自己的域名

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.3-fpm.sock;
    }
}
```

::: tip 提示
`root` 路径需要配置成以 `/public` 结尾，是因为 `/public` 目录下才是真正的 Web 静态文件，面板根目录下存放的是 PHP 业务逻辑部分，所以在 Nginx 中要配置为以 `/public` 结尾。
:::

再在 `/etc/nginx/sites-enabled` 下配置软连接。

```shell script
cd /etc/nginx/sites-enabled
ln -s /etc/nginx/sites-available/sspanel.conf sspanel
```

重新加载 Nginx 配置。

```shell script
nginx -s reload
```

#### 导入数据库

安全考虑，尽量不使用数据库的 root 账户，而选择新建一个独立的账户连接数据库。

```shell script
$ mysql -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 30
Server version: 10.5.6-MariaDB-1:10.5.6+maria~bionic mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Reading history-file /root/.mysql_history
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> CREATE DATABASE sspanel;
--------------
create database sspanel
--------------

Query OK, 1 row affected (0.000 sec)

MariaDB [(none)]> USE sspanel;
Database changed
MariaDB [sspanel]> CREATE USER 'sspanel'@'localhost' IDENTIFIED BY 'your_password';
--------------
CREATE USER 'sspanel'@'localhost' IDENTIFIED BY 'your_password'
--------------

Query OK, 0 rows affected (0.007 sec)

MariaDB [sspanel]> GRANT ALL ON sspanel.* TO 'sspanel'@'localhost';
--------------
GRANT ALL ON sspanel.* TO 'sspanel'@'localhost'
--------------

Query OK, 0 rows affected (0.002 sec)

MariaDB [sspanel]> SOURCE /var/www/sspanel/sql/glzjin_all.sql;
...省略...
MariaDB [sspanel]> exit;
Bye
```

#### 修改配置文件

```shell script
cd /var/www/sspanel/
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
vim config/.config.php
```

::: tip 提示
注意数据库的配置，应使用上一步新建的账户，修改完成后网站应该可以正常访问。
:::

#### 创建管理员并同步用户

```shell script
# 创建管理员
php xcat User createAdmin

# 重置所有流量
php xcat User resetTraffic

# 下载 IP 地址库
php xcat Tool initQQWry

# 下载客户端安装包
php xcat Tool initdownload
```

#### 创建定时任务

使用 `crontab -e` 进入 crontab 编辑界面，添加如下定时任务。

```crontab
# 发送日报邮件，不需要发送可以不添加
30 22 * * * php /var/www/sspanel/xcat SendDiaryMail

# 每日定时任务和每分钟定时任务，必须添加
0 0 * * * php -n /var/www/sspanel/xcat Job DailyJob
*/1 * * * * php /var/www/sspanel/xcat Job CheckJob

# 财务报表，不需要可以不添加
5 0 * * * php /var/www/sspanel/xcat FinanceMail day 
6 0 * * 0 php /var/www/sspanel/xcat FinanceMail week
7 0 1 * * php /var/www/sspanel/xcat FinanceMail month

# 检测被墙
*/1 * * * * php /var/www/sspanel/xcat DetectGFW
```

::: tip 提示
SSPanel 安装完成。
:::

## 进阶使用

### Telegram 机器人

待完善。

### 节点配置

待完善。