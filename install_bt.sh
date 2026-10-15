#!/bin/bash
url='https://download.bt.cn/install/installStable_12.sh'
if [ -f /usr/bin/curl ]; then
    curl -sSO "$url"
else
    wget -O installStable_12.sh "$url"
fi
bash installStable_12.sh 5x59vxy56
