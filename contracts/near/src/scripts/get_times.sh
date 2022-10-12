#!/bin/zsh

source .env

minutes=${1:-2} # default of 2 minutes from now
echo Sale opening delay from now \\t$minutes

timestamp=$(echo $(date +%s) | python -c "import sys; t=sys.stdin.read(); print('{}{}'.format(int(t) + $minutes * 60, '000000000'))")
saleOpening=$timestamp
export saleOpening

minutes=${2:-4} # default of 4 minutes from now
echo Sale close delay from now \\t$minutes

timestamp=$(echo $(date +%s) | python -c "import sys; t=sys.stdin.read(); print('{}{}'.format(int(t) + $minutes * 60, '000000000'))")
saleClose=$timestamp
export saleClose

minutes=${3:-4} # default of 6 minutes from now
echo Distribution start from now \\t$minutes

timestamp=$(echo $(date +%s) | python -c "import sys; t=sys.stdin.read(); print('{}{}'.format(int(t) + $minutes * 60, '000000000'))")
distributionStart=$timestamp
export distributionStart

echo
echo Current:\\t\\t\\t$(echo $(date +%s) | python -c "import sys; t=sys.stdin.read(); print('{}{}'.format(int(t), '000000000'))")
echo saleOpening=$saleOpening
echo saleClose=$saleClose
echo distributionStart=$distributionStart

# echo '${saleOpening} ${saleClose}' | envsubst '${saleOpening} ${saleClose}'