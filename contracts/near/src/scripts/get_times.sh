#!/bin/zsh

echo $(date +%s) | python -c 'import sys; t=sys.stdin.read(); print("{}{}".format(int(t) + 10 * 60, "000000"))'

