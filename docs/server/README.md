# 介绍

服务端是为客户端服务的，运行在各类服务器上，主要提供 Web 面板、流量转发、网络隧道、代理节点等功能。

## Web 面板

Web 面板指各类「机场」电商系统，提供用户注册、充值、套餐购买、返利、管理后台等功能。

常见的面板有

- [SSPanel](https://github.com/Anankke/SSPanel-Uim)
- VNetPanel（已经闭源）
- [V2Board](https://github.com/v2board/v2board)
- [django-sspanel](https://github.com/Ehco1996/django-sspanel)
- 等等

## 流量转发

流量转发指将进入服务器 A 的流量转发到服务器 B，通常用来优化出境线路。例如，用户连接某境外服务器 B 时速度较慢，时断时续，此时可在境内服务器 A 上搭建流量转发，用户连接境内服务器 A，保证连接速度，服务器 A 将用户流量转发到境外服务器 B，即可规避用户直连境外服务器时的卡顿情况。

常见的流量转发工具有

- iptables
- Brook
- GOST
- socat
- 等等

## 网络隧道

网络隧道配合流量转发一起使用，用于加密转发的流量，以达到安全、防劫持、防干扰、防重放的效果。

常见的网络隧道有

- ipsec/gre
- TLS
- WebSocket
- OpenVPN
- L2TP VPN
- WireGuard
- tinc
- 等等

## 代理节点

提供最终的代理功能，不同的代理节点支持不同的协议。

常见的代理节点程序有

- Shadowsocks
- ShadowsocksR
- V2Ray
- Trojan
- 等等
