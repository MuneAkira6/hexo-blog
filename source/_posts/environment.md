---
title: 环境问题汇总
date: 2023-12-02 00:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

折腾开发环境显然是一种对人生无益的活动。

### .zshrc

```bash
source ~/.bash_profile

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"


# 启动代理
proxy () {
  export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
  echo "HTTP Proxy on"
}
proxy

# 关闭代理
noproxy () {
  unset http_proxy
  unset https_proxy
  unset all_proxy
  echo "HTTP Proxy off"
}

# yarn全局
export PATH="$PATH:`yarn global bin`:$HOME/.config/yarn/global/node_modules/.bin"

```

### yarn 报错 on Windows

1. 管理员运行 PowerShell
2. `set-ExecutionPolicy RemoteSigned`, "Yes"
3. `get-ExecutionPolicy`, "Unrestricted"
