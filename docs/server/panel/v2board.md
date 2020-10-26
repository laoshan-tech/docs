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

## 进阶使用

待完善。