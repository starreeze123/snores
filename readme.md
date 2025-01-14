# Snores💤

<p><b>S</b>cript for <b>N</b>JU Sp<b>o</b>rt <b>Re</b>servation <b>S</b>ystem</p>
<p>Run this script and SNORE happily next morning - the server will do everything for you!</p>
<p>Version 5.0.0, copyright (c) 2022~2024 by starreeze (starreeze@foxmail.com).</p>

<p style="color: crimson;">NEW!</p>

visit http://210.28.135.91:65434/ to use!

## Introduction

<p>南京大学体育场地预约脚本（客户端），目前仅支持羽毛球、乒乓球。</p>
<p>目前为防止滥用，服务端仅对已获授权的账户开放预约服务。要获取授权，请联系starreeze@foxmail.com。</p>
<p>当天 8 点前或前一天 11 点后运行客户端发送请求，服务器会在 8 点整开始执行预约操作。服务端程序会自动完成登录、选择场地、选择同伴、滑动验证码、支付等操作，可以比手动操作节省2-3s，提高成功率；同时再也不用怕早 8 起不来了。</p>
<p>目前信息使用明文传输，请确保网络环境安全；开发者承诺，不会将用户信息和密码用于除登录预约系统外的任何用途；服务器在校内，一旦出现问题可溯源：请放心使用。</p>
<p>使用前请确保在系统中添加了至少一个同伴，将会默认使用第一个同伴。</p>

## Changelog

<p>v1.0, 2022.11.07: 基本功能：定时预约抢场地</p>
<p>v2.0 preview1, 2022.11.21: 系统添加了验证码，更换了基于浏览器的框架，使得可以手工输入验证码；同时支持自动登录</p>
<p>v2.0 preview2, 2022.11.26: 修复周末预约失败的 bug；部分功能实现从 python 改为使用 JavaScript，速度更快</p>
<p>v2.0 stable, 2022.11.27: 修复工作日预约失败的 bug</p>
<p>v2.1 preview1, 2022.11.28: 破解滑动验证码，实现全流程 'end to end'，妈妈再也不用担心我早 8 起不来啦</p>
<p>v2.1 preview2, 2022.11.28: 部分场地信息从硬编码改为动态获取，提高鲁棒性</p>
<p>v2.1 stable, 2022.12.02: 修复了滑动验证码有一定概率失败的 bug；测试了不同操作系统和浏览器支持</p>
<p>v2.2 preview1, 2022.12.06: 简化算法，提高滑动验证码的识别效率；提供 headless 选项，支持直接部署在服务器上（暂未测试）</p>
<p>v3.0 preview1, 2022.12.11: 测试了服务器部署，并开发了对应的服务端和客户端，使用方便，源码可控</p>
<p>v3.1 preview1, 2022.12.18: 客户端与服务端通信加密；打包 windows 一键包</p>
<p>v3.1 stable, 2022.12.24: 修复了服务端在部分服务器上无法启动和异常结束的 bug；更完善的异常处理，提高鲁棒性；优化服务端逻辑，降低资源占用；支持客户端多次提交请求，以后发的为准</p>
<p>v3.2 preview1, 2023.01.24: 服务端支持在线验证用户信息，密码错误/触发验证码立即提醒；客户端添加中文语言</p>
<p>v3.2 preview2, 2023.02.14: 修复场地选择的 bug；客户端交互改进</p>
<p>v3.2 stable, 2023.02.18: 客户端与服务端版本一致性检查；客户端交互改进；通过了更全面的测试</p>
<p>v4.0.0, 2023.03.13: html+js+ws 重写客户端和服务端，跨平台体验更佳</p>
<p>v4.0.1, 2023.03.17: 加入 fallback 选项，页面加入 ChangeLog，优化 UI</p>
<p>v4.0.2, 2023.03.28: 修复客户端 websocket 不能正常关闭的 bug，优化 UI</p>
<p>v4.0.3, 2023.04.26: 添加保存账号密码选项</p>
<p>v4.1.0, 2023.05.08: 完善多用户逻辑，添加反馈和分级机制</p>
<p>v4.1.1, 2023.05.24: 修复多用户bug，添加远程调试支持</p>
<p>v4.1.2, 2024.03.05: 支持 docker 部署以更优雅地解决环境依赖；添加自动刷新机制，修正客户端更新滞后的问题</p>
<p>v4.1.3, 2024.03.20: 支持选择 2 个场地以增强容错；小范围代码重构</p>
<p>v4.2.0, 2024.07.05: 优化 fallback 逻辑优先同时段；移除服务端过时无用的 session 逻辑；添加 21-22 时段；优化 UI</p>
<p>v5.0.0, 2024.08.17: 全面重构后端，使用requests而非浏览器自动化实现预约主流程，大幅提高可靠性和效率；优化OCR验证码识别流程，大幅提高验证账号信息的速度</p>
<p>v5.0.1, 2024.11.07: 调整 fallback 逻辑，修复失效的 bug；优化参数</p>
<p>v5.0.2, 2024.11.26: 添加登录、信息获取重试步骤；强化日志错误提示；优化UI</p>
