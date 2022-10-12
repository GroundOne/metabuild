#/bin/bash

# tbd

case "$1" in
"clean")
   echo 'clean'
   ;;
"setup")
   echo 'setup'
   ;;
"distribute")
   echo 'distribute'
   ;;
"subacc:create")
   echo 'subacc:create'
   ;;
"subacc:send")
   echo 'subacc:send'
   ;;
"subacc:state")
   echo 'subacc:state'
   ;;
"subacc:delete")
   echo 'subacc:delete'
   ;;
"build:deploy")
   echo 'build:deploy'
   ;;
"build")
   echo 'build'
   ;;
"build:part")
   echo 'build:part'
   ;;
"deploy")
   echo 'deploy'
   ;;
"deploy:part")
   echo 'deploy:part'
   ;;
"deploy:part:dev")
   echo 'deploy:part:dev'
   ;;
"call:init:presale")
   echo 'call:init:presale'
   ;;
"call:init")
   echo 'call:init'
   ;;
"call:presale:participate")
   echo 'call:presale:participate'
   ;;
"call:presale:participate2")
   echo 'call:presale:participate2'
   ;;
"call:presale:distribute")
   echo 'call:presale:distribute'
   ;;
"view:presale:participants")
   echo 'view:presale:participants'
   ;;
"view:presale:distribution")
   echo 'view:presale:distribution'
   ;;
"view:meta")
   echo 'view:meta'
   ;;
"view:vars")
   echo 'view:vars'
   ;;
"view:blocktime")
   echo 'view:blocktime'
   ;;

"view:done:presale")
   echo 'view:done:presale'
   ;;

"view:done:sale")
   echo 'view:done:sale'
   ;;

"call:mint")
   echo 'call:mint'
   ;;

"view:token")
   echo 'view:token'
   ;;

"view:tokens")
   echo 'view:tokens'
   ;;

"test")
   echo 'test'
   ;;

"test:watch")
   echo 'test:watch'
   ;;

"build:test")
   echo 'build:test'
   ;;

*)
   echo "You have failed to specify what to do correctly."
   exit 1
   ;;
esac
