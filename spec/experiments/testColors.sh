# aa_256 ()
# {
#     local o x=`tput op` y=`printf %$((${COLUMNS}-6))s`;
#     for i in {0..256};
#     do
#         o=00$i;
#         echo -e ${o:${#o}-3:3} `tput "setaf $i" "setab $i"`${y// /=}$x;
#     done
# }

# tput ()
# {
#     local a;
#     for a in "$@";
#     do
#         echo -en "${a}n";
#     done | tput -S
# }


# a_256 ()
# {
#     ( x=`tput op` y=`printf %$((${COLUMNS}-6))slocal `;
#     for i in {242..232} 232 232;
#     do
#         echo  "`tput setaf $i;tput setab $i`${y}${x}`tput op`";
#     done )
# }

#!/bin/sh

# #Background
# for clbg in $(seq 40 47) $(seq 100 107) 49 ; do
# #Foreground
# for clfg in $(seq 30 37) $(seq 90 97) 39 ; do
# #Formatting
# for attr in 0 1 2 4 5 7 ; do
# #Print the result
# printf "\e[${attr};${clbg};${clfg}m ^[${attr};${clbg};${clfg}m \e[0m"
# done
# echo #Newline
# done
# done

# exit 0


# W=`tput setaf 7` RC="E[0;0;0m" L=$(sed 's/[0-9]//g; s/./ /g' <<<`seq -s+0 $(($COLUMNS/2))`);

# for i in `seq 0 256`;
# do
#   printf "${W}n%.3d `tput setab $i`${L}${RC}" $i;
# done

# tputm ()
# {
#     local a;
#     for a in "$@";
#     do
#         printf "${a}n";echo ""
#     done | tput -S
# }


# {
#  local t=`tputm 'clear' 'setaf 75'` l a b f=/tmp/ps IFS=' ';
# exec 6<>$f;ps L|tr -s ' ' &>$f;
# while read -u6 l;do a=${l/% */} b=${l/* /};
# figlet -rtw $((${COLUMNS} /2 )) -f big "$l";
# tput sgr0;
# command ps wwo pid:6,user:8,vsize:8,comm:20,$a:50 k -$a -A;cont;
# done;
# };