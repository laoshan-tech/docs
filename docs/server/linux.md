# Linux 基础

无论 Web 面板还是节点，默认都是跑在 Linux 服务器上。因此，基础的 Linux 运维技术必不可少。

## 系统

根据笔者个人喜好，推荐 Debian、Ubuntu 系统。

- Ubuntu 18.04，LTS 版本，发布已有两年，比较稳定
- Debian 10，Debian 最新稳定版
- Ubuntu 20.04，最新的 LTS 版本

以下将以 Ubuntu 18.04 为基础讲解，其他系统大同小异。

::: warning 警告
绝大多数 IDC 会直接提供 root 账户，如果不是请先执行 `sudo su` 切换至 root 账户，再继续以下安装操作。
:::

## 基础运行环境

### 更新系统并安装必备的基础软件

```shell script
apt update && apt upgrade -y
apt install -y curl vim wget unzip apt-transport-https lsb-release ca-certificates git gnupg2
```

### 安装 PPA 软件源

```shell script
apt install software-properties-common
```

### 安装 Nginx

选用 [Ondřej Surý](https://deb.sury.org/) 大神的 stable 版本。

```shell script
# 添加 PPA
add-apt-repository ppa:ondrej/nginx
apt update

# 安装Nginx
sudo apt install nginx

# 开机自启
sudo systemctl enable nginx
```

检查 Nginx 版本。

```shell script
$ nginx -V
nginx version: nginx/1.18.0
built with OpenSSL 1.1.1g  21 Apr 2020
TLS SNI support enabled
configure arguments: --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-fcTQcK/nginx-1.18.0=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-compat --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_flv_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_mp4_module --with-http_perl_module=dynamic --with-http_random_index_module --with-http_secure_link_module --with-http_sub_module --with-http_xslt_module=dynamic --with-mail=dynamic --with-mail_ssl_module --with-stream=dynamic --with-stream_geoip_module=dynamic --with-stream_ssl_module --with-stream_ssl_preread_module --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-headers-more-filter --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-auth-pam --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-cache-purge --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-dav-ext --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-ndk --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-echo --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-fancyindex --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-geoip2 --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/nchan --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-lua --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/rtmp --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-uploadprogress --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-upstream-fair --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/http-subs-filter --add-dynamic-module=/build/nginx-fcTQcK/nginx-1.18.0/debian/modules/ssl-ct
```

### 安装 PHP

依然选用 [Ondřej Surý](https://deb.sury.org/) 大神的版本，此处选取 PHP 7.3，如需其他版本可自行修改。

```shell script
# 添加 PPA
add-apt-repository ppa:ondrej/php
apt update

# 安装PHP
apt install php7.3-fpm php7.3-mysql php7.3-curl php7.3-gd php7.3-mbstring php7.3-xml php7.3-xmlrpc php7.3-opcache php7.3-zip php7.3 php7.3-json php7.3-bz2 php7.3-bcmath

# 开机自启
sudo systemctl enable php7.3-fpm
```

### 安装 MySQL
