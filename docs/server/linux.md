# Linux 基础

无论 Web 面板还是节点，默认都是跑在 Linux 服务器上。因此，基础的 Linux 运维技术必不可少。

::: danger 危险
出于减少服务器对外暴露面的考虑，不推荐使用任何形式的运维面板。
:::

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

# 安装PHP 7.3，如果需要其他版本，自行替换
apt install php7.3-fpm php7.3-mysql php7.3-curl php7.3-gd php7.3-mbstring php7.3-xml php7.3-xmlrpc php7.3-opcache php7.3-zip php7.3 php7.3-json php7.3-bz2 php7.3-bcmath

# 开机自启
sudo systemctl enable php7.3-fpm
```

### 安装 MariaDB 数据库

> MariaDB 是 MySQL 关系数据库管理系统的一个复刻，由社区开发，有商业支持，旨在继续保持在 GNU GPL 下开源。

MariaDB 与 MySQL 完全兼容，不需要担心功能差异的问题。

选取官方源的镜像进行安装 MariaDB 10.5 稳定版本。

#### 添加清华大学镜像源

```shell script
sudo apt-get install software-properties-common dirmngr apt-transport-https
sudo apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
sudo add-apt-repository 'deb [arch=amd64,arm64,ppc64el] https://mirrors.tuna.tsinghua.edu.cn/mariadb/repo/10.5/ubuntu bionic main'
```

#### 安装 MariaDB Server

```shell script
sudo apt update
sudo apt install mariadb-server
```

#### 进行安全设置

```shell script
sudo mysql_secure_installation
```

1.  需要输入当前的数据库 root 密码
   
    一般来说初次安装都是空，直接按 Enter。

1.  询问是否需要切换到 Unix Socket 认证

    一般来说还是使用密码认证比较通用，选 N。

1.  询问是否需要设置 root 密码

    可按需要填写密码。

1.  询问是否需要移除匿名账户

    选 Y。

1.  询问是否需要禁止 root 用户远程登录

    如果需要 root 从其他机器登录，则选 N，如果只会从本机登录 root，那么选 Y。

1.  询问是否需要删除 test 数据库

    选 Y，test 数据库不需要，只供测试时候用。
    
1.  询问是否刷新权限表

    选 Y，立刻刷新权限表使得前面的修改生效。

#### 安装验证

```shell script
$ mysql -V
mysql  Ver 15.1 Distrib 10.5.6-MariaDB, for debian-linux-gnu (x86_64) using readline 5.2
```

::: tip 提示
至此 LNMP 安装完成。
:::

### 安装 Docker

如果有使用 Docker 的需求，可以直接用 Docker 官方提供的脚本安装。

```shell script
sh -c "$(curl -fsSL get.docker.com)"
```

#### 安装 `docker-compose`

```shell script
apt install python3-pip
pip3 install -U pip
pip3 install docker-compose
```

## 配置优化

### 安全设置

#### SSH

SSH 的配置文件位于 `/etc/ssh/sshd_config`，推荐切换默认端口、关闭密码登录、使用密钥认证。

```
# 端口设置，建议 10000 以上
Port 20002

# 开启密钥认证
PubkeyAuthentication yes

# 不允许空密码
PermitEmptyPasswords no

# 关闭密码认证
PasswordAuthentication no
```

给自己的用户创建一对密钥，具体的步骤可以参考 [详细步骤：创建和管理 Azure 中的 Linux VM 用于身份验证的 SSH 密钥](https://docs.microsoft.com/zh-cn/azure/virtual-machines/linux/create-ssh-keys-detailed)，这里只简单说明一下。

```shell script
cd ~

# 如果 .ssh 目录不存在，就创建一个
mkdir .ssh

# 生成一对密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

把公钥的内容复制到 `~/.ssh/authorized_keys` 文件下，没有就创建一个，私钥的内容保存到自己的电脑上，配在自己使用的客户端（如 XShell、Putty 等）中。

重启 SSH 服务。

```shell script
service ssh restart
```

**新开一个窗口，测试一下 SSH 密钥登录是否正常，免得配置错误以后 SSH 登不上去。**

### 网络优化

推荐使用优化脚本操作，手动方式不做赘述。

```shell script
wget -N --no-check-certificate "https://github.000060000.xyz/tcp.sh" && chmod +x tcp.sh && ./tcp.sh
```

**BBR、BBRPlus、锐速等 TCP 优化方案的效果因人而异，请自行测试。**

::: danger 危险
内核变更要谨慎，操作失误可能导致机器启动不了。
:::