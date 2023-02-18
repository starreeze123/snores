# Snores

**S**cript for **N**JU Sp**o**rt **Re**servation **S**ystem

Run this script and SNORE happily next morning - the server will do everything for you!

Version 3.2 stable client, copyright (c) 2022~2023 by starreeze (starreeze@foxmail.com).

## License

This is the client software of the Snores project. The server code is (for the moment) private, and the client code (this repo) is under the **MIT License**.

Note that: although I strive to provide good service, program sometimes may fail and **users of the program take full responsibility** for any consequences.

## Introduction

南京大学体育场地预约脚本（客户端），目前仅支持羽毛球、乒乓球。

目前为防止滥用，服务端仅对已获授权的账户开放预约服务。要获取授权，请联系starreeze@foxmail.com。

当天 8 点前或前一天 9 点后运行客户端发送请求，服务器会在 8 点整开始执行预约操作。服务端程序会调出浏览器，并自动完成登录、选择场地、选择同伴、滑动验证码、支付等操作，可以比手动操作节省 2-3s，提高成功率；同时再也不用怕早 8 起不来了。

信息传输已默认启用 RSA-2048 端到端加密；**开发者承诺，不会将用户信息和密码用于除登录预约系统外的任何用途**；服务器在校内，一旦出现问题可溯源：请放心使用。

需要在校园网环境内，使用前请确保在系统中添加了至少一个同伴。

## Manual

### Download & Install

请从 [github-release](https://github.com/starreeze123/snores/releases) 下载最新版，其中包含源码和 windows 一键包。

目前客户端有两种使用方法，分别为傻瓜式（仅支持 windows）和参数式（能装 python 的平台都能用）；前者推荐没有计算机基础的用户使用，后者提供更精细的控制，但操作复杂。要运行傻瓜式，直接双击运行 `snores-client.exe`按照提示操作即可，不必再往下看了；要运行参数式，参阅下面说明。

### Preparation

1. 安装 python(>=3.6)，推荐 3.9+，版本向下兼容。
2. `pip install -r requirements.txt`

### Usage

在当前目录下启动命令行，输入 `python main.py <args>` 来运行程序，参数说明如下。

```
usage: client.py [-h] --type TYPE --user USER --passwd PASSWD [--buddy BUDDY] [--period PERIOD [PERIOD ...]] [--field FIELD [FIELD ...]] [--fallback]

options:
  -h, --help            show this help message and exit
  --type TYPE, -t TYPE  <Required> Type of the field
  --user USER           <Required> username (student id)
  --passwd PASSWD       <Required> uniform login password
  --buddy BUDDY, -b BUDDY
                        Index of the buddy you want to choose; default 0
  --period PERIOD [PERIOD ...], -p PERIOD [PERIOD ...]
                        List of the beginning time of the period you want to choose, ordered in priority; default all
  --field FIELD [FIELD ...], -f FIELD [FIELD ...]
                        List of the field you want to choose, ordered in priority; default all
  --fallback, -a        Do random choice on all available if the time and space specified is not available; default false
```

下面对部分 option 做出详细说明。

#### type

场地类型。场地预约列表（选择类型的那一页）中，按钮所在的位置（这个按钮是第几个按钮），0-indexed。例如：

- fzz 羽毛球（楼下）：0
- fzz 乒乓球：2
- szt 羽毛球：5

#### buddy

同伴序号，打开 https://ggtypt.nju.edu.cn/venue/venues/buddies 即可查看，注意是 0-indexed，就是网页上的序号-1。建议先添加好同伴。

#### period

时间列表，空格分割，可选参数。列表需要按照优先程度排序，程序会优先选择排在前面的时间。填时间段的开始时间，24 小时制。例如，想要晚上 7-8，就填 19 即可。如果不填，则会任选。

#### field

场地序号列表，空格分割，一般从 1 开始，可选参数。列表同样按照优先程度排序，不填任选。如果时间和场地同时指定，优先时间。例如：`-p 10 11 12 -f 10 11 12`，仅有空场 10 号 12-13，12 号 11-12，则选择后者。

#### fallback

如果指定了 fallback，那么当所选时间都不能选择时，自动随机选择一个可选的。不指定默认 False。

### Examples

下面给出示例:

```
python main.py -t 5 --user xxx --passwd xxx # 四组团羽毛球，时间场地任选
python main.py -t 0 -b 1 -p 19 20 16 -a --user xxx --passwd # 最优先晚上7-8，如果全满则次选晚上8-9，还是全满则下午4-5，再不行就任选
```

## Change Log

v1.0, 2022.11.07: 基本功能：定时预约抢场地

v2.0 preview1, 2022.11.21: 系统添加了验证码，更换了基于浏览器的框架，使得可以手工输入验证码；同时支持自动登录

v2.0 preview2, 2022.11.26: 修复周末预约失败的 bug；部分功能实现从 python 改为使用 JavaScript，速度更快

v2.0 stable, 2022.11.27: 修复工作日预约失败的 bug

v2.1 preview1, 2022.11.28: 破解滑动验证码，实现全流程 'end to end'，妈妈再也不用担心我早 8 起不来啦

v2.1 preview2, 2022.11.28: 部分场地信息从硬编码改为动态获取，提高鲁棒性

v2.1 stable, 2022.12.02: 修复了滑动验证码有一定概率失败的 bug；测试了不同操作系统和浏览器支持

v2.2 preview1, 2022.12.06: 简化算法，提高滑动验证码的识别效率；提供 headless 选项，支持直接部署在服务器上（暂未测试）

v3.0 preview1, 2022.12.11: 测试了服务器部署，并开发了对应的服务端和客户端，使用方便，源码可控

v3.1 preview1, 2022.12.18: 客户端与服务端通信加密；打包 windows 一键包

v3.1 stable, 2022.12.24: 修复了服务端在部分服务器上无法启动和异常结束的 bug；更完善的异常处理，提高鲁棒性；优化服务端逻辑，降低资源占用；支持客户端多次提交请求，以后发的为准

v3.2 preview1, 2023.01.24: 服务端支持在线验证用户信息，密码错误/触发验证码立即提醒；客户端添加中文语言

v3.2 preview2, 2023.02.14: 修复场地选择的 bug；客户端交互改进

v3.2 stable, 2023.02.18: 客户端与服务端版本一致性检查；客户端交互改进；通过了更全面的测试
