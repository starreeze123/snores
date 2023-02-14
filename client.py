# -*- coding: utf-8 -*-
# @Date    : 2022-12-11 10:50:26
# @Author  : Starreeze (starreeze@foxmail.com)

import socket, sys
from argparse import ArgumentParser
from pwinput import pwinput

try:
    from Crypto.PublicKey import RSA
    from Crypto.Cipher import PKCS1_OAEP
except ImportError:
    enable_encryption = False
    print("WARNING: encryption disabled because pycryptodome is not installed.")


HOST = "210.28.135.91"
PORT = 65432
KEY_FILE = "public.pem"
enable_encryption = True
connection_timeout = 90
desc_eng = {
    0: "ok",
    1: "you are not authorized; please contact the developer",
    2: "you come too late (early?); please try after 9:00 for tomorrow's reservation",
    3: "WARNING: you have already requested a reservation before, and this one has replaced it",
    4: "ERROR: login failed - probable reason: wrong password; if you believe it's not your fault, please contact the developer",
    5: "ERROR: login failed - probable reason: SMS verification triggered; please login manually and try again",
    6: "ERROR: login failed - unknown error; if you can login manually, please contact the developer",
    -1: "forbidden; if you believe this is a mistake, please contact the developer",
    100: "connecting to the server...",
    101: "please wait for around 30s while the server is validating your information...",
    102: "connection failed; if you are in the campus and your network is ok, please try again later\nif this error persists, please contact the developer",
}
desc_chn = {
    0: "操作成功，您可以重新运行来修改提交的信息；请于8:00后自行核查预约记录，如有异常，请联系开发者",
    1: "您的账号未经授权，请联系开发者",
    2: "您来得太晚（早？）了，如您计划预约明天的场地，请于9:00后重试",
    3: "请注意: 您今天已经发送了一次预约请求，本次请求已经覆盖了之前的一次",
    4: "登录失败，可能原因：密码错误；如果您确认提供了正确的密码，请联系开发者",
    5: "登录失败，可能原因：触发了短信验证码；请立即自行登录一次系统，然后重试",
    6: "登录失败，未知错误；如果您可以正常手动登录，请联系开发者",
    -1: "FORBIDDEN: 如果您坚持认为自己没有问题，请联系开发者",
    100: "正在连接服务器...",
    101: "请稍等，正在验证您的信息，大约需要30秒...",
    102: "连接失败或超时；如果您确认正常接入了校内网，请再试一次；若仍然失败，请联系开发者",
}
desc = [desc_eng, desc_chn]


def exit_with(code: int):
    if sys.platform == "win32":
        input("press enter to exit or just close this window")
    exit(code)


def report_bug(message):
    print(
        "unknown error; please update to the latest version.\n"
        "If it already is, please report this bug to developer with the following error message:"
    )
    print(message)


def parse_args():
    parser = ArgumentParser()
    parser.add_argument("--type", "-t", required=True, help="<Required> Type of the field", type=int)
    parser.add_argument(
        "--user",
        help="<Required> username (student id)",
        required=True,
        type=str,
    )
    parser.add_argument(
        "--passwd",
        help="<Required> uniform login password",
        required=True,
        type=str,
    )
    parser.add_argument(
        "--buddy",
        "-b",
        help="Index of the buddy you want to choose; default 0",
        default=0,
        type=int,
    )
    parser.add_argument(
        "--period",
        "-p",
        nargs="+",
        default=[],
        help="List of the beginning time of the period you want to choose, ordered in priority; default all",
        type=int,
    )
    parser.add_argument(
        "--field",
        "-f",
        nargs="+",
        default=[],
        help="List of the field you want to choose, ordered in priority; default all",
        type=int,
    )
    parser.add_argument(
        "--fallback",
        "-a",
        action="store_true",
        help="Do random choice on all available if the time and space specified is not available; default false",
    )
    return parser.parse_args()


def simple_mode() -> str:
    type_id = input("请选择您想要预约的场地类型（输入数字编号回车即可）：\n0.fzz羽毛球（楼下）\n2.fzz乒乓球\n5.szt羽毛球\n")
    period = input("请选择时间段（开始时间，24小时制，例如想要下午4-5则输入16）：")
    field = input("请选择场地（不填可以直接回车，视为任选）：")
    user = input("学号（开发者承诺，不会将用户信息和密码用于除登录预约系统外的任何用途）：")
    passwd = pwinput("统一认证密码：")
    res = f"--user {user} --passwd {passwd} -t {type_id} -p {period}"
    if not (type_id and period and user and passwd):
        print("参数错误：除了场地，其他字段均为必填；请重新运行")
        exit_with(-1)
    if field:
        res += f" -f {field}"
    return res


def complex_mode() -> str:
    parse_args()  # just do arg checking
    # re-format arguments as --user {user} --passwd {passwd} ...
    user_idx = sys.argv.index("--user")
    arg_user_str = "--user " + sys.argv[user_idx + 1] + " "
    del sys.argv[user_idx + 1]
    del sys.argv[user_idx]
    passwd_idx = sys.argv.index("--passwd")
    arg_passwd_str = "--passwd " + sys.argv[passwd_idx + 1] + " "
    del sys.argv[passwd_idx + 1]
    del sys.argv[passwd_idx]
    arg_str = arg_user_str + arg_passwd_str + " ".join(sys.argv[1:])
    return arg_str


def encrypt(message: str, key_file: str) -> bytes:
    with open(key_file, "rb") as f:
        key = RSA.importKey(f.read())
    encryptor = PKCS1_OAEP.new(key)
    encrypted = encryptor.encrypt(message.encode("utf-8"))
    return encrypted


def main():
    if len(sys.argv) < 2:
        args_str = simple_mode()
        mode = 1
    else:
        args_str = complex_mode()
        mode = 0
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(6)
        print(desc[mode][100])
        try:
            s.connect((HOST, PORT))
        except (ConnectionRefusedError, socket.timeout):
            print(desc[mode][102])
            exit_with(128)
        try:
            s.settimeout(connection_timeout)
            if enable_encryption:
                s.sendall(encrypt(args_str, KEY_FILE))
            else:
                s.sendall(args_str.encode("utf-8"))
            print(desc[mode][101])
            status = s.recv(1)[0]
        except KeyboardInterrupt:
            exit_with(-1)
        except (ConnectionRefusedError, socket.timeout):
            print(desc[mode][102])
            exit_with(128)
        except Exception as e:
            report_bug(e)
            exit_with(-1)
    try:
        print(desc[mode][status])
    except KeyError:
        report_bug("unknown status code: %d" % status)
    exit_with(status)


if __name__ == "__main__":
    main()
