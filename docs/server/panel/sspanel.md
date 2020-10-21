# SSPanel 面板

[SSPanel](https://github.com/Anankke/SSPanel-Uim) 是目前使用最为广泛的机场 Web 面板之一，根据其开发历史，分为多个不同时期的版本，目前开发最为活跃且生态最好的是 [SSPanel-Uim](https://github.com/Anankke/SSPanel-Uim)，以下 SSPanel 均代指该版本。

## 功能特性

- 支持 Shadowsocks、ShadowsocksR、V2Ray、Trojan
- 集成超过 8 种支付方式
- 支持流量审计
- 商品设置细化，支持同时连接设备数、用户限速等属性
- 返利机制

## 安装

### 环境依赖

1. MySQL
1. PHP 7.2+
1. Composer

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

需要使用的伪静态配置：

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
    root /var/www/sspanel/public; # 改成你自己的路径
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

```shell script
mysql -u root -p
mysql>CREATE DATABASE sspanel;
mysql>use sspanel;
mysql>source /var/www/sspanel/sql/glzjin_all.sql;
mysql>exit
```

#### 修改配置文件

```shell script
cd /var/www/sspanel/
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
vim config/.config.php
```

::: tip 提示
注意数据库的配置，修改完成后网站应该可以正常访问。
:::

#### 创建管理员并同步用户

```shell script
php xcat User createAdmin
php xcat User resetTraffic
php xcat Tool initQQWry
php xcat Tool initdownload
```

#### 创建定时任务

```crontab
30 22 * * * php /var/www/sspanel/xcat SendDiaryMail
0 0 * * * php -n /var/www/sspanel/xcat Job DailyJob
*/1 * * * * php /var/www/sspanel/xcat Job CheckJob
```

::: tip 提示
SSPanel 安装完成。
:::