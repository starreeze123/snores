const progressTime = 40, waitTimeout = 30
const totalImgNum = 7, opacity = 0.2
const version = '4.0.2'
const desc_chn = {
    0: "操作成功，您可以重新运行来修改提交的信息；请于8:00后自行核查预约记录，如有异常，请联系开发者",
    1: "您的账号未经授权，请联系开发者",
    2: "您来得太晚（早？）了，如您计划预约明天的场地，请于9:00后重试",
    3: "操作成功: 您今天已经发送了一次预约请求，本次请求已经覆盖了之前的一次",
    4: "登录失败，可能原因：密码错误；如果您确认提供了正确的密码，请联系开发者",
    5: "登录失败，可能原因：触发了短信验证码；请立即自行登录一次系统，然后重试",
    6: "登录失败，未知错误；如果您可以正常手动登录，请联系开发者",
    10: "FORBIDDEN: 如果您坚持认为自己没有问题，请联系开发者",
    100: "正在连接服务器...",
    101: "请稍等，正在验证您的信息，大约需要30-45秒；请不要锁屏，并始终将本页面置于前台，直到收到结果提示",
    102: "连接失败或超时；如果您确认正常接入了校内网，请再试一次；若仍然失败，请联系开发者",
    103: "请尽量不要使用腾讯内置浏览器，否则您的体验会受到影响！建议点击右上角选择浏览器打开",
    104: "带 * 号字段必填！",
    105: `版本已经更新到${version}，欢迎查看 changelog 以了解最新信息！`
}

function start() {
    var node = null
    if (is_mobile()) {
        node = document.createElement('img')
        day = Math.floor(Date.now() / 1000 / 3600 / 24)
        node.src = `assets/bg-${day % totalImgNum + 1}.webp`
    }
    else {
        node = document.createElement('video')
        node.src = 'assets/bg.webm'
        node.autoplay = 'autoplay'
        node.loop = 'loop'
        node.muted = 'muted'
    }
    node.style.width = '100%'
    node.style.height = '100%'
    node.style.objectFit = 'cover'
    node.style.position = 'fixed'
    node.style.zIndex = '-1'
    node.style.top = '0'
    node.style.left = '0'
    node.style.opacity = `${opacity}`
    document.body.insertBefore(node, document.body.firstChild)

    document.addEventListener('DOMContentLoaded', () => {
        if (is_inner())
            show_message(desc_chn[103], false)
    })

    // check version
    var user_version = localStorage.getItem("version");
    if (user_version == null) {
        localStorage.setItem("version", version)
        user_version = version
    }
    if (user_version != version) {
        location.reload();
        localStorage.setItem("version", version)
        show_message(desc_chn[105], false)
    }
}

function is_inner() {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin"
    } else if (ua.match(/QQ/i) == "qq") {
        return "QQ"
    }
    return false
}

function is_mobile() {
    var userAgentInfo = navigator.userAgent.toLowerCase()
    var Agents = new Array("android", "iphone", "symbianos", "windows phone", "ipod")
    for (var v = 0; v < Agents.length; v++)
        if (userAgentInfo.indexOf(Agents[v]) > 0)
            return true
    return false
}

function show_message(msg, dialog = true) {
    var parent = document.getElementById('prompt')
    try {
        parent.removeChild(parent.firstChild)
    }
    catch (error) { }
    parent.appendChild(document.createTextNode(msg))
    if (dialog)
        alert(msg)
}

async function run() {
    // check args
    const time = document.getElementById("time").value
    const field = document.getElementById("field").value
    const type = document.getElementById("type").value
    const user = document.getElementById("user").value
    const password = document.getElementById("password").value
    if (!(time && user && password)) {
        show_message(desc_chn[104])
        return
    }
    var args_str = `--user ${user} --passwd ${password} -t ${type} -p ${time}`
    if (field)
        args_str += ` -f ${field}`
    if (document.getElementById("fallback").checked)
        args_str += ' --fallback'
    const args = await encrypt(args_str)
    console.log(args)

    var timer = setInterval(progress_step, progressTime)
    var timeoutId = null

    // send request
    var socket = new WebSocket("ws://210.28.135.91:65433")
    socket.addEventListener('open', _event => {
        socket.send(args)
    })
    socket.addEventListener('message', event => {
        clearInterval(timer)
        if (timeoutId != null)
            clearTimeout(timeoutId)
        progress.style.visibility = 'hidden'
        button.style.visibility = 'visible'
        status_code = event.data.charCodeAt(0)
        try {
            socket.close()
            show_message(desc_chn[status_code])
        } catch (error) {
            show_message(`Unknown error: please report this bug to developer with the following error message: ${error}. Turn off or refresh this page before you continue.`)
        }
    })
    socket.onerror = (_error => {
        clearInterval(timer)
        progress.style.visibility = 'hidden'
        button.style.visibility = 'visible'
        show_message(desc_chn[102])
    })

    // show progress bar
    var button = document.getElementById("button")
    var progress = document.getElementById("progress")
    var bar = document.getElementById("progress_bar")
    var width = 0.0
    function progress_step() {
        if (width >= 99) {
            clearInterval(timer)
            timeoutId = setTimeout(() => {
                show_message(desc_chn[102])
                progress.style.visibility = 'hidden'
                button.style.visibility = 'visible'
                socket.close()
            }, waitTimeout * 1000)
        } else {
            width += 0.1
            bar.style.width = `${width}%`
            bar.innerHTML = `&nbsp;&nbsp;${parseInt(width)}%`
        }
        progress.style.visibility = 'visible'
        button.style.visibility = 'hidden'
    }

    show_message(desc_chn[101], false)
}

async function encrypt(message) {
    return message
}

start()
